import {
  assertEquals,
  assertObjectMatch,
} from "@std/assert";
import { validatePricePayload } from "./priceValidation.ts";

Deno.test("validatePricePayload retorna dados normalizados para payload válido", () => {
  const result = validatePricePayload({
    amount: 1000,
    monthlyRatePercent: 2.5,
    termMonths: 12,
  });

  assertEquals(result.errors, []);
  assertObjectMatch(result, {
    data: {
      amount: 1000,
      monthlyRate: 0.025,
      termMonths: 12,
    },
  });
});

Deno.test("validatePricePayload retorna erro para payload ausente ou inválido", () => {
  const result = validatePricePayload(null);

  assertEquals(result, {
    errors: [
      "Payload inválido: envie um objeto JSON com amount, monthlyRatePercent e termMonths.",
    ],
  });
});

Deno.test("validatePricePayload retorna erros para campos não numéricos", () => {
  const result = validatePricePayload({
    amount: "1000",
    monthlyRatePercent: "2",
    termMonths: "12",
  });

  assertEquals(result, {
    errors: [
      "amount deve ser um número finito maior que zero.",
      "monthlyRatePercent deve ser um número finito maior ou igual a zero.",
      "termMonths deve ser um número inteiro positivo.",
    ],
  });
});

Deno.test("validatePricePayload retorna erros para valores negativos ou zero inválido", () => {
  const result = validatePricePayload({
    amount: 0,
    monthlyRatePercent: -1,
    termMonths: 0,
  });

  assertEquals(result, {
    errors: [
      "amount deve ser maior que zero.",
      "monthlyRatePercent deve ser maior ou igual a zero.",
      "termMonths deve ser maior que zero.",
    ],
  });
});

Deno.test("validatePricePayload retorna erro para prazo fracionário", () => {
  const result = validatePricePayload({
    amount: 1000,
    monthlyRatePercent: 1.5,
    termMonths: 12.5,
  });

  assertEquals(result, {
    errors: ["termMonths deve ser um inteiro positivo."],
  });
});
