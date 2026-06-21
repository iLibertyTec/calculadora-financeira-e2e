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

const PERIOD_EPSILON: number = 1e-10;

export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  validateInput(input);

  const { principal, annualRate, years, compoundsPerYear } = input;
  const totalPeriodsExact: number = years * compoundsPerYear;
  const totalPeriodsRounded: number = Math.round(totalPeriodsExact);

  if (Math.abs(totalPeriodsExact - totalPeriodsRounded) > PERIOD_EPSILON) {
    throw new RangeError(
      "years must align with whole compounding periods for discrete compounding",
    );
  }

  const totalPeriods: number = totalPeriodsRounded;
  const ratePerPeriod: number = annualRate / compoundsPerYear;
  const growthFactor: number = 1 + ratePerPeriod;
  const series: CompoundInterestPoint[] = [];

  for (let period = 0; period <= totalPeriods; period += 1) {
    const amount: number = principal * Math.pow(growthFactor, period);
    series.push({
      period,
      year: period / compoundsPerYear,
      amount,
      accruedInterest: amount - principal,
    });
  }

  const finalAmount: number = principal * Math.pow(growthFactor, totalPeriods);

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
}
