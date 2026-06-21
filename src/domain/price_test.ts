import {
  assertEquals,
  assertThrows,
} from "@std/assert";
import { calculatePriceAmortization } from "./price.ts";

deno.test("calculatePriceAmortization returns constant payment totals for positive rate", () => {
  const result = calculatePriceAmortization({
    principal: 10000,
    monthlyRate: 0.02,
    months: 12,
  });

  assertEquals(result, {
    monthlyPayment: 945.6,
    totalPaid: 11347.2,
    totalInterest: 1347.2,
  });
});

deno.test("calculatePriceAmortization divides principal equally when rate is zero", () => {
  const result = calculatePriceAmortization({
    principal: 1200,
    monthlyRate: 0,
    months: 12,
  });

  assertEquals(result, {
    monthlyPayment: 100,
    totalPaid: 1200,
    totalInterest: 0,
  });
});

deno.test("calculatePriceAmortization rejects invalid parameters", () => {
  assertThrows(() => {
    calculatePriceAmortization({
      principal: 0,
      monthlyRate: 0.02,
      months: 12,
    });
  }, Error, "Principal must be greater than zero");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: -0.01,
      months: 12,
    });
  }, Error, "Monthly rate cannot be negative");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: 0.02,
      months: 0,
    });
  }, Error, "Months must be a positive integer");
});
