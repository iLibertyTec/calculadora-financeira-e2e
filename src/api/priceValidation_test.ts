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
        monthlyRatePercent: 2.5,
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
      "Payload inválido: esperado objeto JSON com amount, monthlyRatePercent, termMonths. Tipo recebido: null.",
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
      "monthlyRatePercent deve ser um número JSON em percentual, não uma string. A conversão para taxa decimal acontece internamente.",
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
    errors: ["termMonths deve ser um inteiro positivo. Valor recebido: 12.5."],
  });
});

Deno.test("validatePricePayload retorna erro para campos extras desconhecidos", () => {
  const result = validatePricePayload({
    amount: 1000,
    monthlyRatePercent: 2,
    termMonths: 12,
    extra: true,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      "Campos desconhecidos no payload: extra. Apenas amount, monthlyRatePercent, termMonths são aceitos.",
    ],
  });
});

Deno.test("validatePricePayload retorna erro para payload array", () => {
  const result = validatePricePayload([]);

  assertEquals(result, {
    ok: false,
    errors: [
      "Payload inválido: esperado objeto JSON com amount, monthlyRatePercent, termMonths. Tipo recebido: array.",
    ],
  });
});

Deno.test("validatePricePayload aceita payload com prototype nulo", () => {
  const payload = Object.create(null) as Record<string, unknown>;
  payload.amount = 1000;
  payload.monthlyRatePercent = 2;
  payload.termMonths = 12;

  const result = validatePricePayload(payload);

  assertEquals(result.ok, true);
  if (result.ok) {
    assertObjectMatch(result, {
      data: {
        amount: 1000,
        monthlyRatePercent: 2,
        monthlyRate: 0.02,
        termMonths: 12,
      },
    });
  }
});

Deno.test("validatePricePayload retorna erro para limites máximos excedidos", () => {
  const result = validatePricePayload({
    amount: 1_000_000_000_001,
    monthlyRatePercent: 10_001,
    termMonths: 1_201,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      "amount deve ser menor ou igual a 1000000000000.",
      "monthlyRatePercent deve ser menor ou igual a 10000.",
      "termMonths deve ser menor ou igual a 1200.",
    ],
  });
});

Deno.test("validatePricePayload retorna erro para valores não finitos", () => {
  const result = validatePricePayload({
    amount: Number.POSITIVE_INFINITY,
    monthlyRatePercent: Number.NaN,
    termMonths: Number.NEGATIVE_INFINITY,
  });

  assertEquals(result, {
    ok: false,
    errors: [
      "amount deve ser um número finito maior que zero.",
      "monthlyRatePercent deve ser um número finito em percentual maior ou igual a zero. A conversão para taxa decimal acontece internamente.",
      "termMonths deve ser um número inteiro positivo.",
    ],
  });
});
