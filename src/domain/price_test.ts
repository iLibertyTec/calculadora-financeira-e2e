import { assertEquals, assertThrows } from "@std/assert";
import { calculatePriceAmortization } from "./price.ts";

Deno.test("calculatePriceAmortization returns constant payment totals for positive rate", () => {
  const result = calculatePriceAmortization({
    principal: 10000,
    monthlyRate: 0.02,
    months: 12,
  });

  assertEquals(result, {
    monthlyPayment: 945.6,
    totalPaid: 11347.18,
    totalInterest: 1347.18,
  });
});

Deno.test("calculatePriceAmortization divides principal equally when rate is zero", () => {
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

Deno.test("calculatePriceAmortization rejects invalid parameters", () => {
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

  assertThrows(() => {
    calculatePriceAmortization({
      principal: Number.NaN,
      monthlyRate: 0.02,
      months: 12,
    });
  }, Error, "Principal must be greater than zero");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: Number.POSITIVE_INFINITY,
      months: 12,
    });
  }, Error, "Monthly rate cannot be negative");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: 0.02,
      months: 12.5,
    });
  }, Error, "Months must be a positive integer");
});
