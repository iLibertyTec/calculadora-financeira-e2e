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

Deno.test("calculateCompoundInterest supports fractional periods outside the frequency grid", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.1,
    years: 1.1,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 15);
  assertAlmostEquals(result.series[13].year, 13 / 12, 1e-12);
  assertAlmostEquals(result.series[14].period, 13.200000000000001, 1e-12);
  assertAlmostEquals(result.series[14].year, 1.1, 1e-12);
  assertAlmostEquals(result.finalAmount, 1115.8462987816868, 1e-12);
  assertAlmostEquals(result.accruedInterest, 115.84629878168683, 1e-12);
});

Deno.test("calculateCompoundInterest handles periods smaller than one full compounding interval", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 0.05,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 2);
  assertEquals(result.series[0].period, 0);
  assertAlmostEquals(result.series[1].period, 0.6000000000000001, 1e-12);
  assertAlmostEquals(result.series[1].year, 0.05, 1e-12);
  assertAlmostEquals(result.finalAmount, 1005.9880556662681, 1e-12);
});

Deno.test("calculateCompoundInterest tolerates floating-point imprecision in periods", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 0.1 + 0.2,
    compoundsPerYear: 10,
  });

  assertEquals(result.series.length, 4);
  assertAlmostEquals(result.series[3].year, 0.3, 1e-12);
  assertAlmostEquals(result.finalAmount, 1036.3636363636363, 1e-12);
});

Deno.test("calculateCompoundInterest handles zero principal and zero years", () => {
  const zeroPrincipal = calculateCompoundInterest({
    principal: 0,
    annualRate: 0.15,
    years: 2,
    compoundsPerYear: 4,
  });
  assertEquals(zeroPrincipal.finalAmount, 0);
  assertEquals(zeroPrincipal.accruedInterest, 0);

  const zeroYears = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.15,
    years: 0,
    compoundsPerYear: 12,
  });
  assertEquals(zeroYears.series.length, 1);
  assertEquals(zeroYears.finalAmount, 1000);
  assertEquals(zeroYears.accruedInterest, 0);
});

Deno.test("calculateCompoundInterest allows negative rates above -100%", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: -0.12,
    years: 1,
    compoundsPerYear: 12,
  });

  assertAlmostEquals(result.finalAmount, 886.3848717161292, 1e-12);
  assertAlmostEquals(result.accruedInterest, -113.61512828387083, 1e-12);
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
    "compoundsPerYear must be a positive number",
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
  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: 100,
        annualRate: -1,
        years: 1,
        compoundsPerYear: 1,
      }),
    RangeError,
    "annualRate must be greater than -1",
  );
});

Deno.test("calculateCompoundInterest validates infinities", () => {
  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: Number.POSITIVE_INFINITY,
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
        years: Number.NEGATIVE_INFINITY,
        compoundsPerYear: 1,
      }),
    RangeError,
    "years must be a finite number",
  );
});
