import {
  assertEquals,
  assertThrows,
} from "@std/assert";
import {
  roundToCents,
  validateFinancingParams,
  type FinancingParams,
} from "./financing.ts";

Deno.test("validateFinancingParams returns valid params", () => {
  const params: FinancingParams = {
    principal: 100000,
    monthlyRate: 0.015,
    termMonths: 360,
  };

  assertEquals(validateFinancingParams(params), params);
});

Deno.test("validateFinancingParams rejects principal less than or equal to zero", () => {
  assertThrows(() => {
    validateFinancingParams({
      principal: 0,
      monthlyRate: 0.01,
      termMonths: 12,
    });
  }, RangeError, "principal must be greater than zero");

  assertThrows(() => {
    validateFinancingParams({
      principal: -1,
      monthlyRate: 0.01,
      termMonths: 12,
    });
  }, RangeError, "principal must be greater than zero");
});

Deno.test("validateFinancingParams rejects negative monthly rate", () => {
  assertThrows(() => {
    validateFinancingParams({
      principal: 1000,
      monthlyRate: -0.01,
      termMonths: 12,
    });
  }, RangeError, "monthlyRate must be greater than or equal to zero");
});

Deno.test("validateFinancingParams rejects term less than or equal to zero", () => {
  assertThrows(() => {
    validateFinancingParams({
      principal: 1000,
      monthlyRate: 0.01,
      termMonths: 0,
    });
  }, RangeError, "termMonths must be greater than zero");

  assertThrows(() => {
    validateFinancingParams({
      principal: 1000,
      monthlyRate: 0.01,
      termMonths: -12,
    });
  }, RangeError, "termMonths must be greater than zero");
});

Deno.test("roundToCents rounds financial values consistently", () => {
  assertEquals(roundToCents(10), 10);
  assertEquals(roundToCents(10.004), 10);
  assertEquals(roundToCents(10.005), 10.01);
  assertEquals(roundToCents(1.335), 1.34);
  assertEquals(roundToCents(1234.567), 1234.57);
});
