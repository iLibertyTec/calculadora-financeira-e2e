import {
  assert,
  assertEquals,
} from "@std/assert";
import {
  calculatePriceSchedule,
  type Money,
  type PriceInstallment,
  type PriceSchedule,
} from "./price.ts";

function roundCurrency(value: number): Money {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertScheduleInvariants(
  schedule: PriceSchedule,
): void {
  const { installments, summary } = schedule;
  let previousBalance: number = summary.principal;

  for (const installment of installments) {
    assert(Number.isFinite(installment.payment));
    assert(Number.isFinite(installment.interest));
    assert(Number.isFinite(installment.amortization));
    assert(Number.isFinite(installment.balance));
    assertEquals(
      installment.payment,
      roundCurrency(installment.interest + installment.amortization),
    );
    assert(installment.balance >= 0);
    assertEquals(
      roundCurrency(installment.amortization + installment.balance),
      roundCurrency(previousBalance),
    );
    previousBalance = installment.balance;
  }

  const totalAmortization: number = roundCurrency(
    installments.reduce(
      (sum: number, installment: PriceInstallment) => {
        return sum + installment.amortization;
      },
      0,
    ),
  );
  const totalPaid: number = roundCurrency(
    installments.reduce(
      (sum: number, installment: PriceInstallment) => {
        return sum + installment.payment;
      },
      0,
    ),
  );
  const totalInterest: number = roundCurrency(
    installments.reduce(
      (sum: number, installment: PriceInstallment) => {
        return sum + installment.interest;
      },
      0,
    ),
  );

  assertEquals(totalAmortization, summary.principal);
  assertEquals(totalPaid, summary.totalPaid);
  assertEquals(totalInterest, summary.totalInterest);
  assertEquals(summary.totalPaid, roundCurrency(summary.principal + summary.totalInterest));
  assertEquals(installments.at(-1)?.balance, 0);
  assert(Number.isFinite(summary.monthlyPayment));
  assert(Number.isFinite(summary.totalPaid));
  assert(Number.isFinite(summary.totalInterest));
}

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
  assertScheduleInvariants(result);
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
  assertScheduleInvariants(result);
});

Deno.test("calculatePriceSchedule rounds principal before zero-rate payment calculation", () => {
  const result = calculatePriceSchedule({
    principal: 1000.015,
    monthlyRate: 0,
    termMonths: 3,
  });

  assertEquals(result.summary.principal, 1000.02);
  assertEquals(result.summary.monthlyPayment, 333.34);
  assertEquals(result.installments[0], {
    period: 1,
    payment: 333.34,
    interest: 0,
    amortization: 333.34,
    balance: 666.68,
  });
  assertEquals(result.installments[2], {
    period: 3,
    payment: 333.34,
    interest: 0,
    amortization: 333.34,
    balance: 0,
  });
  assertEquals(result.summary.totalPaid, 1000.02);
  assertScheduleInvariants(result);
});

Deno.test("calculatePriceSchedule keeps summary monthlyPayment as theoretical fixed installment and may adjust last payment", () => {
  const result = calculatePriceSchedule({
    principal: 1000,
    monthlyRate: 0.01,
    termMonths: 12,
  });

  const nonFinalPayments: number[] = result.installments.slice(0, -1).map((
    installment: PriceInstallment,
  ) => installment.payment);

  assert(nonFinalPayments.every((payment: number) => payment === 88.85));
  assertEquals(result.summary.monthlyPayment, 88.85);
  assertEquals(result.installments[11]?.payment, 88.84);
  assert(result.installments[11]!.payment <= result.summary.monthlyPayment);
  assertScheduleInvariants(result);
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
  assertScheduleInvariants(result);
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
  assertScheduleInvariants(result);
});
