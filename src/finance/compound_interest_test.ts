import {
  assertEquals,
} from "@std/assert";
import {
  buildCompoundInterestSeries,
} from "./compound_interest.ts";

Deno.test("buildCompoundInterestSeries returns one entry per period with compound growth", () => {
  const series = buildCompoundInterestSeries({
    principal: 1000,
    rate: 0.1,
    periods: 3,
  });

  assertEquals(series, [
    {
      period: 1,
      principal: 1000,
      interest: 100,
      accumulatedInterest: 100,
      balance: 1100,
    },
    {
      period: 2,
      principal: 1100,
      interest: 110,
      accumulatedInterest: 210,
      balance: 1210,
    },
    {
      period: 3,
      principal: 1210,
      interest: 121,
      accumulatedInterest: 331,
      balance: 1331,
    },
  ]);
});

Deno.test("buildCompoundInterestSeries returns empty series for zero periods", () => {
  const series = buildCompoundInterestSeries({
    principal: 500,
    rate: 0.05,
    periods: 0,
  });

  assertEquals(series, []);
});

Deno.test("buildCompoundInterestSeries respects custom start period", () => {
  const series = buildCompoundInterestSeries({
    principal: 200,
    rate: 0.25,
    periods: 2,
    startPeriod: 0,
  });

  assertEquals(series, [
    {
      period: 0,
      principal: 200,
      interest: 50,
      accumulatedInterest: 50,
      balance: 250,
    },
    {
      period: 1,
      principal: 250,
      interest: 62.5,
      accumulatedInterest: 112.5,
      balance: 312.5,
    },
  ]);
});
