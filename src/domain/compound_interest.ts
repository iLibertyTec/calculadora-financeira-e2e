export interface CompoundInterestInput {
  principal: number;
  /**
   * Taxa nominal anual em formato decimal.
   * Ex.: 0.12 representa 12% ao ano com capitalização discreta
   * conforme compoundsPerYear.
   */
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
  const ratePerPeriod: number = annualRate / compoundsPerYear;
  const totalPeriods: number = years * compoundsPerYear;
  const growthFactor: number = 1 + ratePerPeriod;
  const series: CompoundInterestPoint[] = [];
  const wholePeriods: number = Math.floor(totalPeriods);
  const fractionalPeriod: number = totalPeriods - wholePeriods;

  for (let period = 0; period <= wholePeriods; period += 1) {
    const amount: number = principal * Math.pow(growthFactor, period);
    series.push({
      period,
      year: period / compoundsPerYear,
      amount,
      accruedInterest: amount - principal,
    });
  }

  const finalAmount: number = principal * Math.pow(growthFactor, totalPeriods);
  const finalPointYear: number = years;

  if (fractionalPeriod > 0) {
    series.push({
      period: wholePeriods + 1,
      year: finalPointYear,
      amount: finalAmount,
      accruedInterest: finalAmount - principal,
    });
  } else if (series.length > 0) {
    const lastIndex: number = series.length - 1;
    series[lastIndex] = {
      ...series[lastIndex],
      year: finalPointYear,
      amount: finalAmount,
      accruedInterest: finalAmount - principal,
    };
  }

  return {
    principal,
    finalAmount,
    accruedInterest: finalAmount - principal,
    series,
  };
}

function validateInput(input: CompoundInterestInput): void {
  if (!Number.isFinite(input.principal) || input.principal < 0) {
    throw new RangeError(
      "principal must be a finite number greater than or equal to zero",
    );
  }

  if (!Number.isFinite(input.annualRate)) {
    throw new RangeError("annualRate must be a finite number");
  }

  if (input.annualRate <= -1) {
    throw new RangeError("annualRate must be greater than -1");
  }

  if (!Number.isFinite(input.years) || input.years < 0) {
    throw new RangeError(
      "years must be a finite number greater than or equal to zero",
    );
  }

  if (
    !Number.isFinite(input.compoundsPerYear) ||
    !Number.isInteger(input.compoundsPerYear) ||
    input.compoundsPerYear <= 0
  ) {
    throw new RangeError("compoundsPerYear must be a positive integer");
  }

  const totalPeriods: number = input.years * input.compoundsPerYear;
  if (!Number.isFinite(totalPeriods)) {
    throw new RangeError("years * compoundsPerYear must be a finite number");
  }
}
