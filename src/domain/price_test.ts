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
    totalPaid: 11347.19,
    totalInterest: 1347.19,
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

Deno.test("calculatePriceAmortization treats near-zero rates as zero for stability", () => {
  const result = calculatePriceAmortization({
    principal: 1200,
    monthlyRate: 1e-12,
    months: 12,
  });

  assertEquals(result, {
    monthlyPayment: 100,
    totalPaid: 1200,
    totalInterest: 0,
  });
});

Deno.test("calculatePriceAmortization keeps financial total from raw formula before display rounding", () => {
  const result = calculatePriceAmortization({
    principal: 1000,
    monthlyRate: 0.01,
    months: 3,
  });

  assertEquals(result, {
    monthlyPayment: 340.02,
    totalPaid: 1020.07,
    totalInterest: 20.07,
  });
});

Deno.test("calculatePriceAmortization rejects invalid parameters", () => {
  assertThrows(() => {
    calculatePriceAmortization({
      principal: 0,
      monthlyRate: 0.02,
      months: 12,
    });
  }, RangeError, "Principal must be greater than zero");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: -0.01,
      months: 12,
    });
  }, RangeError, "Monthly rate cannot be negative");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: -1e-12,
      months: 12,
    });
  }, RangeError, "Monthly rate cannot be negative");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: 0.02,
      months: 0,
    });
  }, RangeError, "Months must be a positive integer");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: Number.NaN,
      monthlyRate: 0.02,
      months: 12,
    });
  }, RangeError, "Principal must be greater than zero");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: Number.POSITIVE_INFINITY,
      months: 12,
    });
  }, RangeError, "Monthly rate must be a finite number");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: 0.02,
      months: 12.5,
    });
  }, RangeError, "Months must be a positive integer");

  assertThrows(() => {
    calculatePriceAmortization({
      principal: 1000,
      monthlyRate: 0.02,
      months: Number.POSITIVE_INFINITY,
    });
  }, RangeError, "Months must be a positive integer");
});
