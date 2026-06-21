export interface PricePayload {
  amount: number;
  monthlyRate: number;
  termMonths: number;
}

export interface PricePayloadValidationResult {
  data?: PricePayload;
  errors: string[];
}

export function validatePricePayload(
  payload: unknown,
): PricePayloadValidationResult {
  if (!isRecord(payload)) {
    return {
      errors: [
        "Payload inválido: envie um objeto JSON com amount, monthlyRatePercent e termMonths.",
      ],
    };
  }

  const errors: string[] = [];

  const amount: unknown = payload.amount;
  const monthlyRatePercent: unknown = payload.monthlyRatePercent;
  const termMonths: unknown = payload.termMonths;

  if (!isFiniteNumber(amount)) {
    errors.push("amount deve ser um número finito maior que zero.");
  } else if (amount <= 0) {
    errors.push("amount deve ser maior que zero.");
  }

  if (!isFiniteNumber(monthlyRatePercent)) {
    errors.push(
      "monthlyRatePercent deve ser um número finito maior ou igual a zero.",
    );
  } else if (monthlyRatePercent < 0) {
    errors.push("monthlyRatePercent deve ser maior ou igual a zero.");
  }

  if (!isFiniteNumber(termMonths)) {
    errors.push("termMonths deve ser um número inteiro positivo.");
  } else if (!Number.isInteger(termMonths)) {
    errors.push("termMonths deve ser um inteiro positivo.");
  } else if (termMonths <= 0) {
    errors.push("termMonths deve ser maior que zero.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      amount,
      monthlyRate: monthlyRatePercent / 100,
      termMonths,
    },
    errors: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
