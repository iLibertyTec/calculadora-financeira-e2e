export interface CompoundInterestInput {
  principal: number;
  /**
   * Taxa nominal anual em formato decimal.
   * Ex.: 0.12 representa 12% ao ano com capitalização conforme compoundsPerYear.
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

const PERIOD_EPSILON: number = 1e-10;

export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  validateInput(input);

  const { principal, annualRate, years, compoundsPerYear } = input;
  const totalPeriodsExact: number = years * compoundsPerYear;
  const wholePeriods: number = Math.floor(totalPeriodsExact + PERIOD_EPSILON);
  const fractionalPeriod: number = Math.max(0, totalPeriodsExact - wholePeriods);
  const ratePerPeriod: number = annualRate / compoundsPerYear;
  const series: CompoundInterestPoint[] = [];

  for (let period = 0; period <= wholePeriods; period += 1) {
    const amount: number = principal * Math.pow(1 + ratePerPeriod, period);
    series.push({
      period,
      year: period / compoundsPerYear,
      amount,
      accruedInterest: amount - principal,
    });
  }

  if (fractionalPeriod > PERIOD_EPSILON) {
    const finalExponent: number = wholePeriods + fractionalPeriod;
    const finalAmount: number = principal * Math.pow(
      1 + ratePerPeriod,
      finalExponent,
    );
    series.push({
      period: wholePeriods + 1,
      year: years,
      amount: finalAmount,
      accruedInterest: finalAmount - principal,
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
    throw new RangeError(
      "principal must be a finite number greater than or equal to zero",
    );
  }

  if (!Number.isFinite(input.annualRate)) {
    throw new RangeError("annualRate must be a finite number");
  }

  if (!Number.isFinite(input.years) || input.years < 0) {
    throw new RangeError(
      "years must be a finite number greater than or equal to zero",
    );
  }

  if (
    !Number.isFinite(input.compoundsPerYear) || input.compoundsPerYear <= 0
  ) {
    throw new RangeError("compoundsPerYear must be a positive number");
  }
}
