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
  const roundedPeriods: number = Math.round(totalPeriodsExact);
  const hasWholePeriodsOnly: boolean =
    Math.abs(totalPeriodsExact - roundedPeriods) <= PERIOD_EPSILON;
  const wholePeriods: number = hasWholePeriodsOnly
    ? roundedPeriods
    : Math.floor(totalPeriodsExact);
  const finalPeriod: number = hasWholePeriodsOnly
    ? wholePeriods
    : totalPeriodsExact;
  const ratePerPeriod: number = annualRate / compoundsPerYear;
  const growthFactor: number = 1 + ratePerPeriod;
  const series: CompoundInterestPoint[] = [];

  for (let period = 0; period <= wholePeriods; period += 1) {
    const amount: number = principal * Math.pow(growthFactor, period);
    series.push({
      period,
      year: period / compoundsPerYear,
      amount,
      accruedInterest: amount - principal,
    });
  }

  if (!hasWholePeriodsOnly) {
    const finalAmount: number = principal * Math.pow(growthFactor, finalPeriod);
    series.push({
      period: finalPeriod,
      year: years,
      amount: finalAmount,
      accruedInterest: finalAmount - principal,
    });
  }

  const finalAmount: number = principal * Math.pow(growthFactor, finalPeriod);

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
    !Number.isFinite(input.compoundsPerYear) || input.compoundsPerYear <= 0
  ) {
    throw new RangeError("compoundsPerYear must be a positive number");
  }
}
