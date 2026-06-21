import { assertEquals } from "@std/assert";

import { fromCents, roundMoney, toCents } from "./money.ts";

Deno.test("roundMoney arredonda valores monetários para duas casas decimais", () => {
  assertEquals(roundMoney(100), 100);
  assertEquals(roundMoney(10.1), 10.1);
  assertEquals(roundMoney(10.12), 10.12);
  assertEquals(roundMoney(10.123), 10.12);
  assertEquals(roundMoney(10.125), 10.13);
  assertEquals(roundMoney(10.129), 10.13);
});

Deno.test("roundMoney trata frações de centavo de forma previsível", () => {
  assertEquals(roundMoney(0.004), 0);
  assertEquals(roundMoney(0.005), 0.01);
  assertEquals(roundMoney(0.014), 0.01);
  assertEquals(roundMoney(0.015), 0.02);
  assertEquals(roundMoney(1.005), 1.01);
  assertEquals(roundMoney(2.675), 2.68);
});

Deno.test("toCents converte valores positivos usados em cronogramas para centavos", () => {
  assertEquals(toCents(123.45), 12345);
  assertEquals(toCents(199.994), 19999);
  assertEquals(toCents(199.995), 20000);
  assertEquals(toCents(1500.1), 150010);
});

Deno.test("fromCents converte centavos para duas casas decimais", () => {
  assertEquals(fromCents(0), 0);
  assertEquals(fromCents(1), 0.01);
  assertEquals(fromCents(1050), 10.5);
  assertEquals(fromCents(12345), 123.45);
});

Deno.test("toCents e fromCents mantêm consistência para parcelas, juros e saldo", () => {
  const parcela: number = 1234.567;
  const juros: number = 98.765;
  const saldo: number = 10000.555;

  assertEquals(fromCents(toCents(parcela)), 1234.57);
  assertEquals(fromCents(toCents(juros)), 98.77);
  assertEquals(fromCents(toCents(saldo)), 10000.56);
});
