import {
  assertEquals,
  assertStrictEquals,
} from "@std/assert";
import {
  convertCurrency,
  MOCK_RATES_TIMESTAMP,
  MOCK_RATES_VERSION,
  SUPPORTED_CURRENCIES,
} from "./rates.ts";

Deno.test("convertCurrency converts between supported currencies deterministically", () => {
  const result = convertCurrency(100, "USD", "BRL");

  assertStrictEquals(result.ok, true);

  if (result.ok) {
    assertEquals(result.rate, 5);
    assertEquals(result.convertedAmount, 500);
    assertEquals(result.sourceCurrency, "USD");
    assertEquals(result.targetCurrency, "BRL");
    assertEquals(result.version, MOCK_RATES_VERSION);
    assertEquals(result.timestamp, MOCK_RATES_TIMESTAMP);
  }
});

Deno.test("convertCurrency keeps amount unchanged for same currency", () => {
  const result = convertCurrency(42, "EUR", "EUR");

  assertStrictEquals(result.ok, true);

  if (result.ok) {
    assertEquals(result.rate, 1);
    assertEquals(result.convertedAmount, 42);
  }
});

Deno.test("convertCurrency returns domain error for unsupported currency", () => {
  const result = convertCurrency(10, "ARS", "USD");

  assertStrictEquals(result.ok, false);

  if (!result.ok) {
    assertEquals(result.error, "UNSUPPORTED_CURRENCY");
    assertEquals(result.currency, "ARS");
    assertEquals(result.supportedCurrencies, SUPPORTED_CURRENCIES);
  }
});
