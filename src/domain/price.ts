export interface PriceInstallment {
  period: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface PriceScheduleSummary {
  principal: number;
  monthlyRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
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

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
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

  const rawPayment = monthlyRate === 0
    ? principal / termMonths
    : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
  const monthlyPayment = roundCurrency(rawPayment);

  const installments: PriceInstallment[] = [];
  let remainingBalance: number = principal;

  for (let period = 1; period <= termMonths; period += 1) {
    const roundedBalance: number = roundCurrency(remainingBalance);
    const interest: number = roundCurrency(remainingBalance * monthlyRate);
    let payment: number = monthlyPayment;
    let amortization: number = roundCurrency(payment - interest);
    let balance: number = roundCurrency(roundedBalance - amortization);

    if (period === termMonths) {
      amortization = roundedBalance;
      payment = roundCurrency(amortization + interest);
      balance = 0;
    } else if (amortization > roundedBalance) {
      amortization = roundedBalance;
      payment = roundCurrency(amortization + interest);
      balance = 0;
    }

    installments.push({
      period,
      payment,
      interest,
      amortization,
      balance,
    });

    remainingBalance = remainingBalance - amortization;
  }

  const totalPaid: number = roundCurrency(
    installments.reduce((sum: number, installment: PriceInstallment) => {
      return sum + installment.payment;
    }, 0),
  );
  const totalInterest: number = roundCurrency(
    installments.reduce((sum: number, installment: PriceInstallment) => {
      return sum + installment.interest;
    }, 0),
  );

  return {
    summary: {
      principal: roundCurrency(principal),
      monthlyRate,
      termMonths,
      monthlyPayment,
      totalPaid,
      totalInterest,
    },
    installments,
  };
}
