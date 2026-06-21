import { assertEquals, assertThrows } from "@std/assert";

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

Deno.test("roundMoney aplica regra simétrica para valores negativos", () => {
  assertEquals(roundMoney(-0.004), 0);
  assertEquals(roundMoney(-0.005), -0.01);
  assertEquals(roundMoney(-0.015), -0.02);
  assertEquals(roundMoney(-1.005), -1.01);
  assertEquals(roundMoney(-2.675), -2.68);
});

Deno.test("roundMoney mantém previsibilidade com casos típicos de ponto flutuante", () => {
  assertEquals(roundMoney(0.1 + 0.2), 0.3);
  assertEquals(roundMoney(1.335), 1.34);
  assertEquals(roundMoney(2.005), 2.01);
});

Deno.test("roundMoney estabiliza limites críticos gerados por operações IEEE-754", () => {
  assertEquals(roundMoney(0.3 - 0.2), 0.1);
  assertEquals(roundMoney(0.1 + 0.2 + 0.705), 1.01);
  assertEquals(roundMoney(1.02 - 0.015), 1.01);
});

Deno.test("roundMoney rejeita entradas não finitas", () => {
  assertThrows(() => roundMoney(Number.NaN), RangeError, "value must be a finite number");
  assertThrows(() => roundMoney(Infinity), RangeError, "value must be a finite number");
  assertThrows(() => roundMoney(-Infinity), RangeError, "value must be a finite number");
});

Deno.test("toCents converte valores positivos usados em cronogramas para centavos", () => {
  assertEquals(toCents(123.45), 12345);
  assertEquals(toCents(199.994), 19999);
  assertEquals(toCents(199.995), 20000);
  assertEquals(toCents(1500.1), 150010);
});

Deno.test("toCents converte valores negativos de forma simétrica e previsível", () => {
  assertEquals(toCents(-123.45), -12345);
  assertEquals(toCents(-199.994), -19999);
  assertEquals(toCents(-199.995), -20000);
  assertEquals(toCents(-1500.1), -150010);
});

Deno.test("toCents mantém previsibilidade com casos típicos de ponto flutuante", () => {
  assertEquals(toCents(0.1 + 0.2), 30);
  assertEquals(toCents(1.335), 134);
  assertEquals(toCents(2.005), 201);
});

Deno.test("toCents estabiliza limites críticos gerados por operações IEEE-754", () => {
  assertEquals(toCents(1.02 - 0.015), 101);
  assertEquals(toCents(0.1 + 0.2 + 0.705), 101);
});

Deno.test("toCents rejeita entradas não finitas", () => {
  assertThrows(() => toCents(Number.NaN), RangeError, "value must be a finite number");
  assertThrows(() => toCents(Infinity), RangeError, "value must be a finite number");
  assertThrows(() => toCents(-Infinity), RangeError, "value must be a finite number");
});

Deno.test("fromCents converte centavos para duas casas decimais", () => {
  assertEquals(fromCents(0), 0);
  assertEquals(fromCents(1), 0.01);
  assertEquals(fromCents(1050), 10.5);
  assertEquals(fromCents(12345), 123.45);
  assertEquals(fromCents(-12345), -123.45);
});

Deno.test("fromCents rejeita entradas fracionárias", () => {
  assertThrows(() => fromCents(10.5), RangeError, "cents must be an integer");
});

Deno.test("fromCents rejeita entradas não finitas", () => {
  assertThrows(() => fromCents(Number.NaN), RangeError, "cents must be a finite number");
  assertThrows(() => fromCents(Infinity), RangeError, "cents must be a finite number");
  assertThrows(() => fromCents(-Infinity), RangeError, "cents must be a finite number");
});

Deno.test("toCents e fromCents mantêm consistência para parcelas, juros e saldo", () => {
  const parcela: number = 1234.567;
  const juros: number = 98.765;
  const saldo: number = 10000.555;

  assertEquals(fromCents(toCents(parcela)), 1234.57);
  assertEquals(fromCents(toCents(juros)), 98.77);
  assertEquals(fromCents(toCents(saldo)), 10000.56);
});

Deno.test("toCents e fromCents mantêm consistência para estornos e ajustes", () => {
  const estorno: number = -1234.567;
  const ajuste: number = -98.765;
  const saldo: number = -10000.555;

  assertEquals(fromCents(toCents(estorno)), -1234.57);
  assertEquals(fromCents(toCents(ajuste)), -98.77);
  assertEquals(fromCents(toCents(saldo)), -10000.56);
});
