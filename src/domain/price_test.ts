import {
  assertEquals,
  assertThrows,
} from "@std/assert";
import { calculatePriceSchedule, type PriceInstallment } from "./price.ts";

Deno.test("calculatePriceSchedule generates Price schedule with known payment", () => {
  const result = calculatePriceSchedule({
    principal: 1000,
    monthlyRate: 0.01,
    termMonths: 12,
  });

  assertEquals(result.summary.principal, 1000);
  assertEquals(result.summary.monthlyRate, 0.01);
  assertEquals(result.summary.termMonths, 12);
  assertEquals(result.summary.monthlyPayment, 88.85);
  assertEquals(result.installments.length, 12);

  assertEquals(result.installments[0], {
    period: 1,
    payment: 88.85,
    interest: 10,
    amortization: 78.85,
    balance: 921.15,
  });

  assertEquals(result.installments[11], {
    period: 12,
    payment: 88.84,
    interest: 0.88,
    amortization: 87.96,
    balance: 0,
  });

  assertEquals(result.summary.totalPaid, 1066.19);
  assertEquals(result.summary.totalInterest, 66.19);
});

Deno.test("calculatePriceSchedule supports zero rate", () => {
  const result = calculatePriceSchedule({
    principal: 1200,
    monthlyRate: 0,
    termMonths: 12,
  });

  assertEquals(result.summary.monthlyPayment, 100);
  assertEquals(result.summary.totalPaid, 1200);
  assertEquals(result.summary.totalInterest, 0);
  assertEquals(result.installments[0], {
    period: 1,
    payment: 100,
    interest: 0,
    amortization: 100,
    balance: 1100,
  });
  assertEquals(result.installments[11], {
    period: 12,
    payment: 100,
    interest: 0,
    amortization: 100,
    balance: 0,
  });
});

Deno.test("calculatePriceSchedule closes totals from final installments in longer term", () => {
  const result = calculatePriceSchedule({
    principal: 250000.37,
    monthlyRate: 0.0137,
    termMonths: 360,
  });

  const totalPaid: number = Number(
    result.installments.reduce(
      (sum: number, installment: PriceInstallment) => sum + installment.payment,
      0,
    ).toFixed(2),
  );
  const totalInterest: number = Number(
    result.installments.reduce(
      (sum: number, installment: PriceInstallment) => sum + installment.interest,
      0,
    ).toFixed(2),
  );

  assertEquals(result.installments.length, 360);
  assertEquals(result.installments[359]?.balance, 0);
  assertEquals(result.summary.totalPaid, totalPaid);
  assertEquals(result.summary.totalInterest, totalInterest);
  assertEquals(
    result.installments[359]?.payment,
    Number(
      (
        (result.installments[359]?.amortization ?? 0) +
        (result.installments[359]?.interest ?? 0)
      ).toFixed(2),
    ),
  );
});

Deno.test("calculatePriceSchedule handles very small non-zero rate and finishes at zero balance", () => {
  const result = calculatePriceSchedule({
    principal: 1000,
    monthlyRate: 0.0001,
    termMonths: 24,
  });

  const totalPaid: number = Number(
    result.installments.reduce(
      (sum: number, installment: PriceInstallment) => sum + installment.payment,
      0,
    ).toFixed(2),
  );

  assertEquals(result.installments.length, 24);
  assertEquals(result.installments[23]?.balance, 0);
  assertEquals(result.summary.totalPaid, totalPaid);
  assertEquals(result.installments[0]?.payment, 41.72);
  assertEquals(result.installments[23]?.payment, 41.65);
});

Deno.test("calculatePriceSchedule validates input", () => {
  assertThrows(
    () =>
      calculatePriceSchedule({
        principal: 0,
        monthlyRate: 0.01,
        termMonths: 12,
      }),
    Error,
    "principal must be a positive number",
  );

  assertThrows(
    () =>
      calculatePriceSchedule({
        principal: 1000,
        monthlyRate: -0.01,
        termMonths: 12,
      }),
    Error,
    "monthlyRate must be a non-negative number",
  );

  assertThrows(
    () =>
      calculatePriceSchedule({
        principal: 1000,
        monthlyRate: 0.01,
        termMonths: 0,
      }),
    Error,
    "termMonths must be a positive integer",
  );
});
