export interface FinancingParams {
  principal: number;
  monthlyRate: number;
  termMonths: number;
}

export function validateFinancingParams(
  params: FinancingParams,
): FinancingParams {
  if (params.principal <= 0) {
    throw new RangeError("principal must be greater than zero");
  }

  if (params.monthlyRate < 0) {
    throw new RangeError("monthlyRate must be greater than or equal to zero");
  }

  if (params.termMonths <= 0) {
    throw new RangeError("termMonths must be greater than zero");
  }

  return params;
}

export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
