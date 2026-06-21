export interface CompoundInterestPayload {
  principal: number;
  annualRate: number;
  years: number;
  compoundsPerYear: number;
}

export type CompoundInterestValidationField =
  | keyof CompoundInterestPayload
  | "payload";

export interface CompoundInterestValidationError {
  field: CompoundInterestValidationField;
  message: string;
}

export interface CompoundInterestValidationSuccess {
  ok: true;
  data: CompoundInterestPayload;
}

export interface CompoundInterestValidationFailure {
  ok: false;
  errors: CompoundInterestValidationError[];
}

export type CompoundInterestValidationResult =
  | CompoundInterestValidationSuccess
  | CompoundInterestValidationFailure;

const REQUIRED_FIELD_MESSAGES: Record<keyof CompoundInterestPayload, string> = {
  principal: "principal is required",
  annualRate: "annualRate is required",
  years: "years is required",
  compoundsPerYear: "compoundsPerYear is required",
};

const TYPE_FIELD_MESSAGES: Record<keyof CompoundInterestPayload, string> = {
  principal: "principal must be a finite number",
  annualRate: "annualRate must be a finite number",
  years: "years must be a finite number",
  compoundsPerYear: "compoundsPerYear must be a finite number",
};

const MIN_ANNUAL_RATE: number = -1;
const MAX_ANNUAL_RATE: number = 1000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateCompoundInterestPayload(
  payload: unknown,
): CompoundInterestValidationResult {
  if (!isPlainObject(payload)) {
    return {
      ok: false,
      errors: [
        {
          field: "payload",
          message: "payload must be a JSON object",
        },
      ],
    };
  }

  const errors: CompoundInterestValidationError[] = [];

  const principalValue: unknown = payload.principal;
  const annualRateValue: unknown = payload.annualRate;
  const yearsValue: unknown = payload.years;
  const compoundsPerYearValue: unknown = payload.compoundsPerYear;

  if (principalValue === undefined) {
    errors.push({
      field: "principal",
      message: REQUIRED_FIELD_MESSAGES.principal,
    });
  }

  if (annualRateValue === undefined) {
    errors.push({
      field: "annualRate",
      message: REQUIRED_FIELD_MESSAGES.annualRate,
    });
  }

  if (yearsValue === undefined) {
    errors.push({
      field: "years",
      message: REQUIRED_FIELD_MESSAGES.years,
    });
  }

  if (compoundsPerYearValue === undefined) {
    errors.push({
      field: "compoundsPerYear",
      message: REQUIRED_FIELD_MESSAGES.compoundsPerYear,
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (typeof principalValue !== "number" || !Number.isFinite(principalValue)) {
    errors.push({
      field: "principal",
      message: TYPE_FIELD_MESSAGES.principal,
    });
  } else if (principalValue < 0) {
    errors.push({
      field: "principal",
      message: "principal must be greater than or equal to 0",
    });
  }

  if (typeof annualRateValue !== "number" || !Number.isFinite(annualRateValue)) {
    errors.push({
      field: "annualRate",
      message: TYPE_FIELD_MESSAGES.annualRate,
    });
  } else if (
    annualRateValue <= MIN_ANNUAL_RATE || annualRateValue > MAX_ANNUAL_RATE
  ) {
    errors.push({
      field: "annualRate",
      message:
        `annualRate must be greater than ${MIN_ANNUAL_RATE} and less than or equal to ${MAX_ANNUAL_RATE}`,
    });
  }

  if (typeof yearsValue !== "number" || !Number.isFinite(yearsValue)) {
    errors.push({
      field: "years",
      message: TYPE_FIELD_MESSAGES.years,
    });
  } else if (yearsValue < 0) {
    errors.push({
      field: "years",
      message: "years must be greater than or equal to 0",
    });
  }

  if (
    typeof compoundsPerYearValue !== "number" ||
    !Number.isFinite(compoundsPerYearValue)
  ) {
    errors.push({
      field: "compoundsPerYear",
      message: TYPE_FIELD_MESSAGES.compoundsPerYear,
    });
  } else if (!Number.isInteger(compoundsPerYearValue)) {
    errors.push({
      field: "compoundsPerYear",
      message: "compoundsPerYear must be an integer",
    });
  } else if (compoundsPerYearValue <= 0) {
    errors.push({
      field: "compoundsPerYear",
      message: "compoundsPerYear must be greater than 0",
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      principal: principalValue,
      annualRate: annualRateValue,
      years: yearsValue,
      compoundsPerYear: compoundsPerYearValue,
    },
  };
}
