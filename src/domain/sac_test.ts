import {
  assertEquals,
  assertGreater,
  assertThrows,
} from "@std/assert";
import { roundToCents } from "./financing.ts";
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
});

Deno.test("calculateSac handles zero rate with final cent adjustment", () => {
  const result = calculateSac({
    principal: 1000,
    monthlyRate: 0,
    termMonths: 3,
  });

  assertEquals(result.amortization, 333.33);
  assertEquals(result.firstInstallment, 333.33);
  assertEquals(result.lastInstallment, 333.34);
  assertEquals(result.totalPaid, 1000);
  assertEquals(result.totalInterest, 0);
});

Deno.test("calculateSac adjusts final installment using rounded amortization closing", () => {
  const result = calculateSac({
    principal: 1000,
    monthlyRate: 0.015,
    termMonths: 3,
  });

  assertEquals(result.amortization, 333.33);
  assertEquals(result.firstInstallment, 348.33);
  assertEquals(result.lastInstallment, 338.34);
  assertEquals(result.totalPaid, 1030);
  assertEquals(result.totalInterest, 30);
});

Deno.test("calculateSac keeps first installment greater than or equal to last for positive rate", () => {
  const result = calculateSac({
    principal: 10000,
    monthlyRate: 0.02,
    termMonths: 36,
  });

  assertEquals(result.firstInstallment >= result.lastInstallment, true);
});

Deno.test("calculateSac tolerates last-cent adjustment in positive-rate contracts", () => {
  const result = calculateSac({
    principal: 1000,
    monthlyRate: 0.01,
    termMonths: 3,
  });

  assertEquals(result.firstInstallment, 343.33);
  assertEquals(result.lastInstallment, 336.67);
  assertEquals(result.firstInstallment >= result.lastInstallment, true);
  assertEquals(result.totalPaid, roundToCents(result.totalInterest + 1000));
});

Deno.test("calculateSac closes long contracts consistently in cents", () => {
  const result = calculateSac({
    principal: 250000,
    monthlyRate: 0.0125,
    termMonths: 360,
  });

  assertEquals(result.firstInstallment >= result.lastInstallment, true);
  assertEquals(result.totalPaid, roundToCents(result.totalInterest + 250000));
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

  assertThrows(
    () => calculateSac({ principal: NaN, monthlyRate: 0.01, termMonths: 12 }),
    RangeError,
  );

  assertThrows(
    () =>
      calculateSac({
        principal: 1000,
        monthlyRate: Number.POSITIVE_INFINITY,
        termMonths: 12,
      }),
    RangeError,
  );

  assertThrows(
    () => calculateSac({ principal: 1000, monthlyRate: 0.01, termMonths: 12.5 }),
    RangeError,
  );
});
