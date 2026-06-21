import { assertEquals, assertObjectMatch } from "@std/assert";
import { validatePricePayload } from "./priceValidation.ts";

Deno.test("validatePricePayload retorna dados normalizados para payload válido", () => {
  const result = validatePricePayload({
    amount: 1000,
    monthlyRatePercent: 2.5,
    termMonths: 12,
  });

  assertEquals(result.ok, true);
  if (result.ok) {
    assertEquals(result.errors, []);
    assertObjectMatch(result, {
      data: {
        amount: 1000,
        monthlyRate: 0.025,
        termMonths: 12,
      },
    });
  }
});

Deno.test("validatePricePayload retorna erro para payload ausente ou inválido", () => {
  const result = validatePricePayload(null);

  assertEquals(result, {
    ok: false,
    errors: [
      "Payload inválido: envie um objeto JSON com amount, monthlyRatePercent e termMonths.",
    ],
  });
});

Deno.test("validatePricePayload retorna erros para campos obrigatórios ausentes", () => {
  const result = validatePricePayload({});

  assertEquals(result, {
    ok: false,
    errors: [
      "amount é obrigatório.",
      "monthlyRatePercent é obrigatório.",
      "termMonths é obrigatório.",
    ],
  });
});

Deno.test("validatePricePayload retorna erros para campos em string", () => {
  const result = validatePricePayload({
    amount: "1000",
    monthlyRatePercent: "2",
    termMonths: "12",
  });

  assertEquals(result, {
    ok: false,
    errors: [
      "amount deve ser um número JSON, não uma string.",
      "monthlyRatePercent deve ser um número JSON, não uma string.",
      "termMonths deve ser um número JSON, não uma string.",
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
    ok: false,
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
    ok: false,
    errors: ["termMonths deve ser um inteiro positivo."],
  });
});

Deno.test("validatePricePayload retorna erro para campos extras", () => {
  const result = validatePricePayload({
    amount: 1000,
    monthlyRatePercent: 2,
    termMonths: 12,
    extra: true,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      "Payload contém campos não permitidos: extra. Use apenas amount, monthlyRatePercent e termMonths.",
    ],
  });
});

Deno.test("validatePricePayload retorna erro para payload array", () => {
  const result = validatePricePayload([]);

  assertEquals(result, {
    ok: false,
    errors: [
      "Payload inválido: envie um objeto JSON com amount, monthlyRatePercent e termMonths.",
    ],
  });
});
