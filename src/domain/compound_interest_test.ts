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
  assertAlmostEquals(
    result.series[result.series.length - 1].amount,
    result.finalAmount,
    1e-10,
  );
});

Deno.test("calculateCompoundInterest computes monthly compounding", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 1,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 13);
  assertAlmostEquals(result.finalAmount, 1126.8250301319697, 1e-10);
  assertAlmostEquals(result.accruedInterest, 126.82503013196972, 1e-10);
  assertAlmostEquals(result.series[6].year, 0.5, 1e-10);
  assertAlmostEquals(result.series[6].amount, 1061.520150601, 1e-8);
  assertAlmostEquals(
    result.series[result.series.length - 1].amount,
    result.finalAmount,
    1e-10,
  );
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

Deno.test("calculateCompoundInterest supports fractional years with whole and partial periods", () => {
  const result = calculateCompoundInterest({
    principal: 5000,
    annualRate: 0.08,
    years: 0.5,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 7);
  assertAlmostEquals(result.series[0].year, 0, 1e-10);
  assertAlmostEquals(result.series[6].year, 0.5, 1e-10);
  assertAlmostEquals(result.finalAmount, 5202.680155655079, 1e-10);
  assertAlmostEquals(
    result.series[result.series.length - 1].amount,
    result.finalAmount,
    1e-10,
  );
});

Deno.test("calculateCompoundInterest accepts fractional horizon outside whole-period grid", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 0.3,
    compoundsPerYear: 12,
  });

  assertEquals(result.series.length, 5);
  assertEquals(result.series.map((point) => point.period), [0, 1, 2, 3, 4]);
  assertAlmostEquals(result.series[3].year, 0.25, 1e-10);
  assertAlmostEquals(result.series[4].year, 0.3, 1e-10);
  assertAlmostEquals(result.finalAmount, 1036.491015291668, 1e-10);
  assertAlmostEquals(
    result.series[result.series.length - 1].amount,
    result.finalAmount,
    1e-10,
  );
});

Deno.test("calculateCompoundInterest tolerates floating-point imprecision in years", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 0.1 + 0.2,
    compoundsPerYear: 10,
  });

  assertEquals(result.series.length, 5);
  assertEquals(result.series.map((point) => point.period), [0, 1, 2, 3, 4]);
  assertAlmostEquals(result.series[3].year, 0.3, 1e-10);
  assertAlmostEquals(result.finalAmount, 1036.432768, 1e-10);
  assertAlmostEquals(
    result.series[result.series.length - 1].year,
    0.1 + 0.2,
    1e-10,
  );
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

  const zeroPrincipalAndYears = calculateCompoundInterest({
    principal: 0,
    annualRate: 0,
    years: 0,
    compoundsPerYear: 1,
  });
  assertEquals(zeroPrincipalAndYears.series.length, 1);
  assertEquals(zeroPrincipalAndYears.finalAmount, 0);
  assertEquals(zeroPrincipalAndYears.accruedInterest, 0);
});

Deno.test("calculateCompoundInterest allows negative rates above -100%", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: -0.12,
    years: 1,
    compoundsPerYear: 12,
  });

  assertAlmostEquals(result.finalAmount, 886.3848717161292, 1e-10);
  assertAlmostEquals(result.accruedInterest, -113.61512828387083, 1e-10);
});

Deno.test("calculateCompoundInterest allows annual negative rate with annual compounding", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: -0.2,
    years: 1,
    compoundsPerYear: 1,
  });

  assertEquals(result.series.length, 2);
  assertAlmostEquals(result.finalAmount, 800, 1e-10);
  assertAlmostEquals(result.series[1].amount, result.finalAmount, 1e-10);
});

Deno.test("calculateCompoundInterest keeps monotonic growth for positive rates", () => {
  const result = calculateCompoundInterest({
    principal: 1500,
    annualRate: 0.06,
    years: 1.25,
    compoundsPerYear: 4,
  });

  for (let index = 1; index < result.series.length; index += 1) {
    const previous = result.series[index - 1];
    const current = result.series[index];
    assertEquals(current.amount >= previous.amount, true);
  }

  assertAlmostEquals(
    result.series[result.series.length - 1].amount,
    result.finalAmount,
    1e-10,
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
    "principal must be a finite number greater than or equal to zero",
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
        annualRate: 0.1,
        years: 1,
        compoundsPerYear: 12.5,
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

  assertThrows(
    () =>
      calculateCompoundInterest({
        principal: 100,
        annualRate: 0.1,
        years: Number.MAX_VALUE,
        compoundsPerYear: 12,
      }),
    RangeError,
    "years * compoundsPerYear must be a finite number",
  );
});
