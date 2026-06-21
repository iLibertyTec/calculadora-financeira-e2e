import {
  assertEquals,
  assertObjectMatch,
  assertThrows,
} from "@std/assert";
import { generateSacSchedule } from "./sac.ts";

deno.test("generateSacSchedule cria cronograma SAC conhecido", () => {
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

deno.test("generateSacSchedule ajusta arredondamento na última parcela", () => {
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

deno.test("generateSacSchedule rejeita prazo inválido", () => {
  assertThrows(
    () => generateSacSchedule(12000, 0.01, 0),
    Error,
    "termMonths must be a positive integer",
  );
});

deno.test("generateSacSchedule rejeita valor financiado inválido", () => {
  assertThrows(
    () => generateSacSchedule(0, 0.01, 12),
    Error,
    "principal must be greater than zero",
  );
});

deno.test("generateSacSchedule rejeita taxa inválida", () => {
  assertThrows(
    () => generateSacSchedule(12000, -0.01, 12),
    Error,
    "monthlyRate must be zero or greater",
  );
});
