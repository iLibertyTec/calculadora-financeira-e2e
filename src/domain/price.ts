export type Money = number;

export interface PriceInstallment {
  period: number;
  payment: Money;
  interest: Money;
  amortization: Money;
  balance: Money;
}

export interface PriceScheduleSummary {
  principal: Money;
  monthlyRate: number;
  termMonths: number;
  monthlyPayment: Money;
  totalPaid: Money;
  totalInterest: Money;
}

export interface PriceSchedule {
  summary: PriceScheduleSummary;
  installments: PriceInstallment[];
}

export interface CalculatePriceScheduleInput {
  principal: number;
  monthlyRate: number;
  termMonths: number;
}

function roundCurrency(value: number): Money {
  const rounded: number = Math.round((value + Number.EPSILON) * 100) / 100;

  if (!Number.isFinite(rounded)) {
    throw new Error("calculation produced a non-finite monetary value");
  }

  return rounded;
}

export function calculatePriceSchedule(
  input: CalculatePriceScheduleInput,
): PriceSchedule {
  const { principal, monthlyRate, termMonths } = input;

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("principal must be a positive number");
  }

  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
    throw new Error("monthlyRate must be a non-negative number");
  }

  if (!Number.isInteger(termMonths) || termMonths <= 0) {
    throw new Error("termMonths must be a positive integer");
  }

  const roundedPrincipal: Money = roundCurrency(principal);
  const rawPayment: number = monthlyRate === 0
    ? roundedPrincipal / termMonths
    : roundedPrincipal * monthlyRate /
      (1 - Math.pow(1 + monthlyRate, -termMonths));
  const monthlyPayment: Money = roundCurrency(rawPayment);

  const installments: PriceInstallment[] = [];
  let remainingBalance: Money = roundedPrincipal;

  for (let period = 1; period <= termMonths; period += 1) {
    const interest: Money = roundCurrency(remainingBalance * monthlyRate);
    let payment: Money = monthlyPayment;
    let amortization: Money = roundCurrency(payment - interest);
    let nextBalance: Money = roundCurrency(remainingBalance - amortization);

    if (nextBalance < 0 || period === termMonths) {
      amortization = remainingBalance;
      payment = roundCurrency(interest + amortization);
      nextBalance = 0;
    }

    installments.push({
      period,
      payment,
      interest,
      amortization,
      balance: nextBalance,
    });

    remainingBalance = nextBalance;
  }

  const totalPaid: Money = roundCurrency(
    installments.reduce((sum: number, installment: PriceInstallment) => {
      return sum + installment.payment;
    }, 0),
  );
  const totalInterest: Money = roundCurrency(
    installments.reduce((sum: number, installment: PriceInstallment) => {
      return sum + installment.interest;
    }, 0),
  );

  return {
    summary: {
      principal: roundedPrincipal,
      monthlyRate,
      termMonths,
      monthlyPayment,
      totalPaid,
      totalInterest,
    },
    installments,
  };
}
