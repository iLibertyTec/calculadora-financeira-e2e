export interface PriceCalculationInput {
  amount: number;
  monthlyRate: number;
  termMonths: number;
}

export type PricePayloadValidationResult =
  | {
    ok: true;
    data: PriceCalculationInput;
    errors: [];
  }
  | {
    ok: false;
    errors: string[];
  };

const EXPECTED_KEYS: readonly string[] = [
  "amount",
  "monthlyRatePercent",
  "termMonths",
];

export function validatePricePayload(
  payload: unknown,
): PricePayloadValidationResult {
  if (!isPlainRecord(payload)) {
    return {
      ok: false,
      errors: [
        "Payload inválido: envie um objeto JSON com amount, monthlyRatePercent e termMonths.",
      ],
    };
  }

  const errors: string[] = [];

  const extraKeys: string[] = Object.keys(payload).filter((key: string) => {
    return !EXPECTED_KEYS.includes(key);
  });

  if (extraKeys.length > 0) {
    errors.push(
      `Payload contém campos não permitidos: ${extraKeys.join(", ")}. Use apenas amount, monthlyRatePercent e termMonths.`,
    );
  }

  const amount: unknown = payload.amount;
  const monthlyRatePercent: unknown = payload.monthlyRatePercent;
  const termMonths: unknown = payload.termMonths;

  validateAmount(amount, errors);
  validateMonthlyRatePercent(monthlyRatePercent, errors);
  validateTermMonths(termMonths, errors);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      amount: amount as number,
      monthlyRate: (monthlyRatePercent as number) / 100,
      termMonths: termMonths as number,
    },
    errors: [],
  };
}

function validateAmount(value: unknown, errors: string[]): void {
  if (value === undefined) {
    errors.push("amount é obrigatório.");
    return;
  }

  if (typeof value === "string") {
    errors.push("amount deve ser um número JSON, não uma string.");
    return;
  }

  if (!isFiniteNumber(value)) {
    errors.push("amount deve ser um número finito maior que zero.");
    return;
  }

  if (value <= 0) {
    errors.push("amount deve ser maior que zero.");
  }
}

function validateMonthlyRatePercent(value: unknown, errors: string[]): void {
  if (value === undefined) {
    errors.push("monthlyRatePercent é obrigatório.");
    return;
  }

  if (typeof value === "string") {
    errors.push(
      "monthlyRatePercent deve ser um número JSON, não uma string.",
    );
    return;
  }

  if (!isFiniteNumber(value)) {
    errors.push(
      "monthlyRatePercent deve ser um número finito maior ou igual a zero.",
    );
    return;
  }

  if (value < 0) {
    errors.push("monthlyRatePercent deve ser maior ou igual a zero.");
  }
}

function validateTermMonths(value: unknown, errors: string[]): void {
  if (value === undefined) {
    errors.push("termMonths é obrigatório.");
    return;
  }

  if (typeof value === "string") {
    errors.push("termMonths deve ser um número JSON, não uma string.");
    return;
  }

  if (!isFiniteNumber(value)) {
    errors.push("termMonths deve ser um número inteiro positivo.");
    return;
  }

  if (!Number.isInteger(value)) {
    errors.push("termMonths deve ser um inteiro positivo.");
    return;
  }

  if (value <= 0) {
    errors.push("termMonths deve ser maior que zero.");
  }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype: object | null = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
