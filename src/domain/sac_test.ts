import {
  assertEquals,
  assertGreater,
  assertThrows,
} from "@std/assert";
import { calculateSac } from "./sac.ts";

Deno.test("calculateSac returns decreasing installments for positive rate", () => {
  const input = {
    principal: 1000,
    monthlyRate: 0.01,
    termMonths: 4,
  };

  const result = calculateSac(input);

  assertEquals(result.amortization, 250);
  assertEquals(result.firstInstallment, 260);
  assertEquals(result.lastInstallment, 252.5);
  assertEquals(result.totalPaid, 1025);
  assertEquals(result.totalInterest, 25);
  assertGreater(result.firstInstallment, result.lastInstallment);

  const installments: number[] = [];
  let remainingPrincipal: number = input.principal;

  for (let month: number = 1; month <= input.termMonths; month += 1) {
    const interest: number = Math.round(
      (remainingPrincipal * input.monthlyRate + Number.EPSILON) * 100,
    ) / 100;
    const amortization: number = month === input.termMonths
      ? Math.round((remainingPrincipal + Number.EPSILON) * 100) / 100
      : result.amortization;
    const installment: number = Math.round(
      (amortization + interest + Number.EPSILON) * 100,
    ) / 100;

    installments.push(installment);
    remainingPrincipal = Math.round(
      ((remainingPrincipal - amortization) + Number.EPSILON) * 100,
    ) / 100;
  }

  assertEquals(installments, [260, 257.5, 255, 252.5]);
  assertEquals(remainingPrincipal, 0);
});

Deno.test("calculateSac handles zero rate with equal installments to principal divided by term", () => {
  const result = calculateSac({
    principal: 1200,
    monthlyRate: 0,
    termMonths: 12,
  });

  assertEquals(result.amortization, 100);
  assertEquals(result.firstInstallment, 100);
  assertEquals(result.lastInstallment, 100);
  assertEquals(result.totalPaid, 1200);
  assertEquals(result.totalInterest, 0);
});

Deno.test("calculateSac adjusts final amortization to close residual cents", () => {
  const result = calculateSac({
    principal: 1000,
    monthlyRate: 0.015,
    termMonths: 3,
  });

  assertEquals(result.amortization, 333.33);
  assertEquals(result.firstInstallment, 348.33);
  assertEquals(result.lastInstallment, 338.35);
  assertEquals(result.totalPaid, 1030.01);
  assertEquals(result.totalInterest, 30.01);
});

Deno.test("calculateSac rejects invalid parameters", () => {
  assertThrows(
    () => calculateSac({ principal: 0, monthlyRate: 0.01, termMonths: 12 }),
    RangeError,
  );

  assertThrows(
    () => calculateSac({ principal: 1000, monthlyRate: -0.01, termMonths: 12 }),
    RangeError,
  );

  assertThrows(
    () => calculateSac({ principal: 1000, monthlyRate: 0.01, termMonths: 0 }),
    RangeError,
  );
});
