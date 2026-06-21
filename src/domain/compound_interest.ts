export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  years: number;
  compoundsPerYear: number;
}

export interface CompoundInterestPoint {
  period: number;
  year: number;
  amount: number;
  accruedInterest: number;
}

export interface CompoundInterestResult {
  principal: number;
  finalAmount: number;
  accruedInterest: number;
  series: CompoundInterestPoint[];
}

export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  validateInput(input);

  const { principal, annualRate, years, compoundsPerYear } = input;
  const totalPeriods: number = Math.round(years * compoundsPerYear);
  const ratePerPeriod: number = annualRate / compoundsPerYear;
  const series: CompoundInterestPoint[] = [];

  for (let period = 0; period <= totalPeriods; period += 1) {
    const amount: number = principal * Math.pow(1 + ratePerPeriod, period);
    series.push({
      period,
      year: period / compoundsPerYear,
      amount,
      accruedInterest: amount - principal,
    });
  }

  const finalAmount: number = series[series.length - 1]?.amount ?? principal;

  return {
    principal,
    finalAmount,
    accruedInterest: finalAmount - principal,
    series,
  };
}

function validateInput(input: CompoundInterestInput): void {
  if (!Number.isFinite(input.principal) || input.principal < 0) {
    throw new RangeError("principal must be a finite number greater than or equal to zero");
  }

  if (!Number.isFinite(input.annualRate)) {
    throw new RangeError("annualRate must be a finite number");
  }

  if (!Number.isFinite(input.years) || input.years < 0) {
    throw new RangeError("years must be a finite number greater than or equal to zero");
  }

  if (!Number.isInteger(input.compoundsPerYear) || input.compoundsPerYear <= 0) {
    throw new RangeError("compoundsPerYear must be a positive integer");
  }

  const expectedPeriods: number = input.years * input.compoundsPerYear;
  if (!Number.isInteger(expectedPeriods)) {
    throw new RangeError(
      "years must produce a whole number of compounding periods for the selected frequency",
    );
  }
}
