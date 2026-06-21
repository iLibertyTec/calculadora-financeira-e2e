import {
  assertAlmostEquals,
  assertEquals,
  assertThrows,
} from "@std/assert";
import { calculateCompoundInterest } from "./compound_interest.ts";

Deno.test("calculateCompoundInterest computes annual compounding", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.1,
    years: 2,
    compoundsPerYear: 1,
  });

  assertEquals(result.principal, 1000);
  assertAlmostEquals(result.finalAmount, 1210, 1e-10);
  assertAlmostEquals(result.accruedInterest, 210, 1e-10);
  assertEquals(result.series.length, 3);
  assertEquals(result.series.map((point) => point.period), [0, 1, 2]);
  assertAlmostEquals(result.series[2].year, 2, 1e-10);
  assertAlmostEquals(result.series[2].amount, 1210, 1e-10);
});

Deno.test("calculateCompoundInterest computes monthly compounding", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 1,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 13);
  assertAlmostEquals(result.finalAmount, 1126.8250301319697, 1e-12);
  assertAlmostEquals(result.accruedInterest, 126.82503013196972, 1e-12);
  assertAlmostEquals(result.series[6].year, 0.5, 1e-12);
  assertAlmostEquals(result.series[6].amount, 1061.520150601, 1e-9);
});

Deno.test("calculateCompoundInterest returns principal unchanged for zero rate", () => {
  const result = calculateCompoundInterest({
    principal: 2500,
    annualRate: 0,
    years: 3,
    compoundsPerYear: 4,
  });

  assertEquals(result.finalAmount, 2500);
  assertEquals(result.accruedInterest, 0);
  assertEquals(result.series.length, 13);
  for (const point of result.series) {
    assertEquals(point.amount, 2500);
    assertEquals(point.accruedInterest, 0);
  }
});

Deno.test("calculateCompoundInterest supports fractional years with whole periods", () => {
  const result = calculateCompoundInterest({
    principal: 5000,
    annualRate: 0.08,
    years: 0.5,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 7);
  assertAlmostEquals(result.series[0].year, 0, 1e-12);
  assertAlmostEquals(result.series[6].year, 0.5, 1e-12);
  assertAlmostEquals(result.finalAmount, 5202.680155655079, 1e-12);
});

Deno.test("calculateCompoundInterest rejects unsupported fractional periods", () => {
  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: 1000,
        annualRate: 0.1,
        years: 1.1,
        compoundsPerYear: 12,
      }),
    RangeError,
    "years must produce a whole number of compounding periods",
  );
});

Deno.test("calculateCompoundInterest validates numeric boundaries", () => {
  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: -1,
        annualRate: 0.1,
        years: 1,
        compoundsPerYear: 1,
      }),
    RangeError,
    "principal must be a finite number",
  );

  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: 100,
        annualRate: 0.1,
        years: 1,
        compoundsPerYear: 0,
      }),
    RangeError,
    "compoundsPerYear must be a positive integer",
  );
  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: 100,
        annualRate: Number.NaN,
        years: 1,
        compoundsPerYear: 1,
      }),
    RangeError,
    "annualRate must be a finite number",
  );
});
