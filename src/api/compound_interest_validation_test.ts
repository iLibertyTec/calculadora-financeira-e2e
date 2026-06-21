import {
  assertEquals,
  assertObjectMatch,
} from "@std/assert";
import { validateCompoundInterestPayload } from "./compound_interest_validation.ts";

Deno.test("validateCompoundInterestPayload returns normalized data for valid payload", () => {
  const result = validateCompoundInterestPayload({
    principal: 1000,
    annualRate: 12.5,
    years: 5,
    compoundsPerYear: 12,
  });

  assertEquals(result, {
    ok: true,
    data: {
      principal: 1000,
      annualRate: 12.5,
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
    annualRate: "10",
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

Deno.test("validateCompoundInterestPayload rejects negative and zero constraints", () => {
  const result = validateCompoundInterestPayload({
    principal: 0,
    annualRate: -101,
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
        message: "annualRate must be between -100 and 1000",
      },
      { field: "years", message: "years must be greater than 0" },
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
    annualRate: 10,
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
        field: "principal",
        message: "payload must be a JSON object",
      },
    ],
  });
});
