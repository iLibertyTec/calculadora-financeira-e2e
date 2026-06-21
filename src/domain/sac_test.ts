import {
  assert,
  assertEquals,
  assertObjectMatch,
  assertThrows,
} from "@std/assert";
import { generateSacSchedule } from "./sac.ts";

Deno.test("generateSacSchedule cria cronograma SAC conhecido", () => {
  const schedule = generateSacSchedule(12000, 0.01, 12);

  assertEquals(schedule.installments.length, 12);
  assertObjectMatch(schedule.installments[0], {
    number: 1,
    amortization: 1000,
    interest: 120,
    payment: 1120,
    remainingBalance: 11000,
  });
  assertObjectMatch(schedule.installments[11], {
    number: 12,
    amortization: 1000,
    interest: 10,
    payment: 1010,
    remainingBalance: 0,
  });
  assertObjectMatch(schedule.summary, {
    firstPayment: 1120,
    lastPayment: 1010,
    totalPaid: 12780,
    totalInterest: 780,
  });
  assertEquals(schedule.installments[11]?.remainingBalance, 0);
});

Deno.test("generateSacSchedule ajusta saldo residual na última parcela", () => {
  const schedule = generateSacSchedule(1000, 0.01, 3);

  assertObjectMatch(schedule.installments[0], {
    amortization: 333.33,
    interest: 10,
    payment: 343.33,
    remainingBalance: 666.67,
  });
  assertObjectMatch(schedule.installments[1], {
    amortization: 333.33,
    interest: 6.67,
    payment: 340,
    remainingBalance: 333.34,
  });
  assertObjectMatch(schedule.installments[2], {
    amortization: 333.34,
    interest: 3.33,
    payment: 336.67,
    remainingBalance: 0,
  });
});

Deno.test("generateSacSchedule fecha soma das amortizações e totais", () => {
  const schedule = generateSacSchedule(1000, 0.01, 3);
  const totalAmortization: number = schedule.installments.reduce(
    (sum: number, installment) => sum + installment.amortization,
    0,
  );

  assertEquals(Number(totalAmortization.toFixed(2)), 1000);
  assertEquals(
    Number((schedule.principal + schedule.summary.totalInterest).toFixed(2)),
    schedule.summary.totalPaid,
  );
  assertEquals(
    schedule.installments[schedule.installments.length - 1]?.remainingBalance,
    0,
  );
});

Deno.test("generateSacSchedule suporta taxa zero", () => {
  const schedule = generateSacSchedule(1000, 0, 3);

  assertObjectMatch(schedule.installments[0], {
    amortization: 333.33,
    interest: 0,
    payment: 333.33,
    remainingBalance: 666.67,
  });
  assertObjectMatch(schedule.installments[2], {
    amortization: 333.34,
    interest: 0,
    payment: 333.34,
    remainingBalance: 0,
  });
  assertObjectMatch(schedule.summary, {
    firstPayment: 333.33,
    lastPayment: 333.34,
    totalPaid: 1000,
    totalInterest: 0,
  });
});

Deno.test("generateSacSchedule mantém soma das amortizações em múltiplos prazos", () => {
  const terms: number[] = [2, 6, 24];

  for (const term of terms) {
    const schedule = generateSacSchedule(12345.67, 0.015, term);
    const totalAmortization: number = Number(
      schedule.installments.reduce(
        (sum: number, installment) => sum + installment.amortization,
        0,
      ).toFixed(2),
    );

    assertEquals(totalAmortization, 12345.67);
    assertEquals(schedule.installments[schedule.installments.length - 1]?.remainingBalance, 0);
  }
});

Deno.test("generateSacSchedule mantém saldo devedor decrescente até zero", () => {
  const schedule = generateSacSchedule(5000, 0.02, 6);

  let previousBalance: number = schedule.principal;

  for (const installment of schedule.installments) {
    assert(installment.remainingBalance <= previousBalance);
    previousBalance = installment.remainingBalance;
  }

  assertEquals(schedule.installments[schedule.installments.length - 1]?.remainingBalance, 0);
});

Deno.test("generateSacSchedule rejeita prazo inválido", () => {
  assertThrows(
    () => generateSacSchedule(12000, 0.01, 0),
    Error,
    "termMonths must be a positive integer",
  );
});

Deno.test("generateSacSchedule rejeita valor financiado inválido", () => {
  assertThrows(
    () => generateSacSchedule(0, 0.01, 12),
    Error,
    "principal must be greater than zero",
  );
});

Deno.test("generateSacSchedule rejeita taxa inválida", () => {
  assertThrows(
    () => generateSacSchedule(12000, -0.01, 12),
    Error,
    "monthlyRate must be zero or greater",
  );
});

Deno.test("generateSacSchedule rejeita entradas não finitas", () => {
  assertThrows(
    () => generateSacSchedule(Number.NaN, 0.01, 12),
    Error,
    "principal must be greater than zero",
  );
  assertThrows(
    () => generateSacSchedule(12000, Number.POSITIVE_INFINITY, 12),
    Error,
    "monthlyRate must be zero or greater",
  );
  assertThrows(
    () => generateSacSchedule(12000, 0.01, Number.NaN),
    Error,
    "termMonths must be a positive integer",
  );
});

Deno.test("generateSacSchedule rejeita valores monetários fora da faixa segura", () => {
  assertThrows(
    () => generateSacSchedule(Number.MAX_SAFE_INTEGER / 100, 0.01, 12),
    Error,
    "money value is outside supported range",
  );
});

Deno.test("generateSacSchedule retorna estruturas imutáveis", () => {
  const schedule = generateSacSchedule(12000, 0.01, 12);

  assert(Object.isFrozen(schedule));
  assert(Object.isFrozen(schedule.installments));
  assert(Object.isFrozen(schedule.summary));
  assert(Object.isFrozen(schedule.installments[0]));
});
