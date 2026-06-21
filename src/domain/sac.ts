export interface SacInstallment {
  readonly number: number;
  readonly amortization: number;
  readonly interest: number;
  readonly payment: number;
  readonly remainingBalance: number;
}

export interface SacSummary {
  readonly firstPayment: number;
  readonly lastPayment: number;
  readonly totalPaid: number;
  readonly totalInterest: number;
}

export interface SacSchedule {
  readonly principal: number;
  readonly monthlyRate: number;
  readonly termMonths: number;
  readonly installments: readonly SacInstallment[];
  readonly summary: SacSummary;
}

export function generateSacSchedule(
  principal: number,
  monthlyRate: number,
  termMonths: number,
): SacSchedule {
  validatePrincipal(principal);
  validateMonthlyRate(monthlyRate);
  validateTermMonths(termMonths);

  const principalCents: number = toMoneyCents(principal);
  const normalizedMonthlyRate: number = normalizeRate(monthlyRate);
  const baseAmortizationCents: number = divideMoneyCents(principalCents, termMonths);
  const installments: SacInstallment[] = [];
  let remainingBalanceCents: number = principalCents;
  let totalPaidCents: number = 0;
  let totalInterestCents: number = 0;

  for (let index = 1; index <= termMonths; index += 1) {
    const amortizationCents: number = index === termMonths
      ? remainingBalanceCents
      : baseAmortizationCents;
    const interestCents: number = calculateInterestCents(
      remainingBalanceCents,
      normalizedMonthlyRate,
    );
    const paymentCents: number = sumMoneyCents(amortizationCents, interestCents);
    const nextBalanceCents: number = index === termMonths
      ? 0
      : subtractMoneyCents(remainingBalanceCents, amortizationCents);

    installments.push(Object.freeze({
      number: index,
      amortization: fromMoneyCents(amortizationCents),
      interest: fromMoneyCents(interestCents),
      payment: fromMoneyCents(paymentCents),
      remainingBalance: fromMoneyCents(nextBalanceCents),
    }));

    totalPaidCents = sumMoneyCents(totalPaidCents, paymentCents);
    totalInterestCents = sumMoneyCents(totalInterestCents, interestCents);
    remainingBalanceCents = nextBalanceCents;
  }

  const totalAmortizationCents: number = installments.reduce(
    (sum: number, installment: SacInstallment) => {
      return sumMoneyCents(sum, toMoneyCents(installment.amortization));
    },
    0,
  );

  if (totalAmortizationCents !== principalCents) {
    throw new Error("schedule amortization must match principal");
  }

  const firstPayment: number = installments[0]?.payment ?? 0;
  const lastPayment: number = installments[installments.length - 1]?.payment ?? 0;

  return Object.freeze({
    principal: fromMoneyCents(principalCents),
    monthlyRate: normalizedMonthlyRate,
    termMonths,
    installments: Object.freeze([...installments]),
    summary: Object.freeze({
      firstPayment,
      lastPayment,
      totalPaid: fromMoneyCents(totalPaidCents),
      totalInterest: fromMoneyCents(totalInterestCents),
    }),
  });
}

function validatePrincipal(principal: number): void {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("principal must be greater than zero");
  }

  toMoneyCents(principal);
}

function validateMonthlyRate(monthlyRate: number): void {
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
    throw new Error("monthlyRate must be zero or greater");
  }

  normalizeRate(monthlyRate);
}

function validateTermMonths(termMonths: number): void {
  if (
    !Number.isFinite(termMonths) || !Number.isInteger(termMonths) ||
    termMonths <= 0
  ) {
    throw new Error("termMonths must be a positive integer");
  }
}

function normalizeRate(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("monthlyRate must be zero or greater");
  }

  if (!Number.isSafeInteger(Math.round(value * 1_000_000_000_000))) {
    throw new Error("monthlyRate is outside supported range");
  }

  return Number(value.toFixed(12));
}

function toMoneyCents(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("money value must be finite");
  }

  const cents: number = Math.round((value + Number.EPSILON) * 100);

  if (!Number.isSafeInteger(cents)) {
    throw new Error("money value is outside supported range");
  }

  return cents;
}

function fromMoneyCents(value: number): number {
  if (!Number.isSafeInteger(value)) {
    throw new Error("money cents value is outside supported range");
  }

  return value / 100;
}

function divideMoneyCents(totalCents: number, divisor: number): number {
  const quotient: number = Math.round((totalCents / divisor) * 100) / 100;
  const cents: number = Math.round(quotient);

  if (!Number.isSafeInteger(cents)) {
    throw new Error("money division is outside supported range");
  }

  return cents;
}

function calculateInterestCents(
  balanceCents: number,
  monthlyRate: number,
): number {
  const interestValue: number = fromMoneyCents(balanceCents) * monthlyRate;
  return toMoneyCents(interestValue);
}

function sumMoneyCents(left: number, right: number): number {
  const result: number = left + right;

  if (!Number.isSafeInteger(result)) {
    throw new Error("money sum is outside supported range");
  }

  return result;
}

function subtractMoneyCents(left: number, right: number): number {
  const result: number = left - right;

  if (!Number.isSafeInteger(result)) {
    throw new Error("money subtraction is outside supported range");
  }

  return result;
}
