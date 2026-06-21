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

const MAX_SAFE_MONEY_VALUE: number = (Number.MAX_SAFE_INTEGER - 1) / 100;
const MAX_SUPPORTED_MONTHLY_RATE: number = 1_000_000;

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
  const baseAmortizationCents: number = Math.floor(principalCents / termMonths);
  const installments: SacInstallment[] = [];
  let remainingBalanceCents: number = principalCents;
  let totalPaidCents: number = 0;
  let totalInterestCents: number = 0;
  let totalAmortizationCents: number = 0;

  for (let index = 1; index <= termMonths; index += 1) {
    const amortizationCents: number = index === termMonths
      ? remainingBalanceCents
      : baseAmortizationCents;
    const interestCents: number = calculateInterestCents(
      remainingBalanceCents,
      normalizedMonthlyRate,
    );
    const paymentCents: number = sumMoneyCents(amortizationCents, interestCents);
    const nextBalanceCents: number = subtractMoneyCents(
      remainingBalanceCents,
      amortizationCents,
    );

    installments.push(Object.freeze({
      number: index,
      amortization: fromMoneyCents(amortizationCents),
      interest: fromMoneyCents(interestCents),
      payment: fromMoneyCents(paymentCents),
      remainingBalance: fromMoneyCents(nextBalanceCents),
    }));

    totalAmortizationCents = sumMoneyCents(
      totalAmortizationCents,
      amortizationCents,
    );
    totalPaidCents = sumMoneyCents(totalPaidCents, paymentCents);
    totalInterestCents = sumMoneyCents(totalInterestCents, interestCents);
    remainingBalanceCents = nextBalanceCents;
  }

  if (totalAmortizationCents !== principalCents) {
    throw new Error("schedule amortization must match principal");
  }

  if (remainingBalanceCents !== 0) {
    throw new Error("schedule remaining balance must be zero");
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

  if (principal > MAX_SAFE_MONEY_VALUE) {
    throw new Error("money value is outside supported range");
  }
}

function validateMonthlyRate(monthlyRate: number): void {
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
    throw new Error("monthlyRate must be zero or greater");
  }

  if (monthlyRate > MAX_SUPPORTED_MONTHLY_RATE) {
    throw new Error("monthlyRate is outside supported range");
  }
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
  return Number(value.toFixed(12));
}

function toMoneyCents(value: number): number {
  if (!Number.isFinite(value) || Math.abs(value) > MAX_SAFE_MONEY_VALUE) {
    throw new Error("money value is outside supported range");
  }

  const cents: number = Math.round(value * 100);

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

function calculateInterestCents(
  balanceCents: number,
  monthlyRate: number,
): number {
  const interestCents: number = Math.round(balanceCents * monthlyRate);

  if (!Number.isSafeInteger(interestCents)) {
    throw new Error("interest value is outside supported range");
  }

  return interestCents;
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
