import {
  assertEquals,
  assertObjectMatch,
} from "@std/assert";
import {
  calculateCompoundInterest,
  validateCompoundInterestPayload,
} from "./compound_interest_validation.ts";

Deno.test("validateCompoundInterestPayload returns normalized data for valid payload", () => {
  const result = validateCompoundInterestPayload({
    principal: 1000,
    annualRate: 0.125,
    years: 5,
    compoundsPerYear: 12,
  });

  assertEquals(result, {
    ok: true,
    data: {
      principal: 1000,
      annualRate: 0.125,
      years: 5,
      compoundsPerYear: 12,
    },
  });
});

Deno.test("validateCompoundInterestPayload returns field errors for missing fields", () => {
  const result = validateCompoundInterestPayload({});

  assertEquals(result, {
    ok: false,
    errors: [
      { field: "principal", message: "principal is required" },
      { field: "annualRate", message: "annualRate is required" },
      { field: "years", message: "years is required" },
      {
        field: "compoundsPerYear",
        message: "compoundsPerYear is required",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects invalid types", () => {
  const result = validateCompoundInterestPayload({
    principal: "1000",
    annualRate: "0.1",
    years: true,
    compoundsPerYear: null,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "principal",
        message: "principal must be a finite number",
      },
      {
        field: "annualRate",
        message: "annualRate must be a finite number",
      },
      { field: "years", message: "years must be a finite number" },
      {
        field: "compoundsPerYear",
        message: "compoundsPerYear must be a finite number",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects negative and invalid constraints", () => {
  const result = validateCompoundInterestPayload({
    principal: -1,
    annualRate: -1,
    years: -2,
    compoundsPerYear: 0,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "principal",
        message: "principal must be greater than 0",
      },
      {
        field: "annualRate",
        message: "annualRate must be a decimal rate greater than -1",
      },
      {
        field: "years",
        message: "years must be greater than 0",
      },
      {
        field: "compoundsPerYear",
        message: "compoundsPerYear must be greater than 0",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects NaN and infinity", () => {
  const result = validateCompoundInterestPayload({
    principal: Number.NaN,
    annualRate: Number.POSITIVE_INFINITY,
    years: Number.NEGATIVE_INFINITY,
    compoundsPerYear: Number.NaN,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "principal",
        message: "principal must be a finite number",
      },
      {
        field: "annualRate",
        message: "annualRate must be a finite number",
      },
      { field: "years", message: "years must be a finite number" },
      {
        field: "compoundsPerYear",
        message: "compoundsPerYear must be a finite number",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects non-integer compounding frequency", () => {
  const result = validateCompoundInterestPayload({
    principal: 1000,
    annualRate: 0.1,
    years: 3,
    compoundsPerYear: 12.5,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "compoundsPerYear",
        message: "compoundsPerYear must be an integer",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects non-object payloads without throwing", () => {
  const result = validateCompoundInterestPayload(null);

  assertObjectMatch(result, {
    ok: false,
    errors: [
      {
        field: "payload",
        message: "body must be a JSON object",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects undefined body with specific message", () => {
  const result = validateCompoundInterestPayload(undefined);

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "payload",
        message: "body is required",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects unknown fields", () => {
  const result = validateCompoundInterestPayload({
    principal: 1000,
    annualRate: 0.1,
    years: 5,
    compoundsPerYear: 12,
    extra: true,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "payload",
        message: "unknown field: extra",
      },
    ],
  });
});

Deno.test("validateCompoundInterestPayload rejects years above maximum", () => {
  const result = validateCompoundInterestPayload({
    principal: 1000,
    annualRate: 0.1,
    years: 101,
    compoundsPerYear: 12,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      {
        field: "years",
        message: "years must be less than or equal to 100",
      },
    ],
  });
});

Deno.test("calculateCompoundInterest keeps domain contract available", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.12,
    years: 1,
    compoundsPerYear: 12,
  });

  assertEquals(result.amount.toFixed(2), "1126.83");
  assertEquals(result.interestEarned.toFixed(2), "126.83");
});
