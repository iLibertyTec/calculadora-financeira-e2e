export interface CompoundInterestSeriesEntry {
  period: number;
  principal: number;
  interest: number;
  accumulatedInterest: number;
  balance: number;
}

export interface CompoundInterestSeriesInput {
  principal: number;
  rate: number;
  periods: number;
  startPeriod?: number;
}

export function buildCompoundInterestSeries(
  input: CompoundInterestSeriesInput,
): CompoundInterestSeriesEntry[] {
  const startPeriod: number = input.startPeriod ?? 1;
  const series: CompoundInterestSeriesEntry[] = [];

  let balance: number = input.principal;
  let accumulatedInterest: number = 0;

  for (let index = 0; index < input.periods; index += 1) {
    const period: number = startPeriod + index;
    const principal: number = balance;
    const interest: number = principal * input.rate;

    accumulatedInterest += interest;
    balance = principal + interest;

    series.push({
      period,
      principal,
      interest,
      accumulatedInterest,
      balance,
    });
  }

  return series;
}
