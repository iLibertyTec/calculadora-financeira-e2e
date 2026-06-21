export interface PriceCalculationInput {
  amount: number;
  monthlyRatePercent: number;
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

const MAX_AMOUNT: number = 1_000_000_000_000;
const MAX_MONTHLY_RATE_PERCENT: number = 10_000;
const MAX_TERM_MONTHS: number = 1_200;

export function validatePricePayload(
  payload: unknown,
): PricePayloadValidationResult {
  if (!isPlainRecord(payload)) {
    return {
      ok: false,
      errors: [
        "Payload inválido: envie um objeto JSON simples com amount, monthlyRatePercent e termMonths.",
      ],
    };
  }

  const errors: string[] = [];

  const amount: unknown = readOwnProperty(payload, "amount");
  const monthlyRatePercent: unknown = readOwnProperty(
    payload,
    "monthlyRatePercent",
  );
  const termMonths: unknown = readOwnProperty(payload, "termMonths");

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
      monthlyRatePercent: monthlyRatePercent as number,
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
    return;
  }

  if (value > MAX_AMOUNT) {
    errors.push(`amount deve ser menor ou igual a ${MAX_AMOUNT}.`);
  }
}

function validateMonthlyRatePercent(value: unknown, errors: string[]): void {
  if (value === undefined) {
    errors.push("monthlyRatePercent é obrigatório.");
    return;
  }

  if (typeof value === "string") {
    errors.push(
      "monthlyRatePercent deve ser um número JSON em percentual, não uma string. A conversão para taxa decimal acontece internamente.",
    );
    return;
  }

  if (!isFiniteNumber(value)) {
    errors.push(
      "monthlyRatePercent deve ser um número finito em percentual maior ou igual a zero. A conversão para taxa decimal acontece internamente.",
    );
    return;
  }

  if (value < 0) {
    errors.push("monthlyRatePercent deve ser maior ou igual a zero.");
    return;
  }

  if (value > MAX_MONTHLY_RATE_PERCENT) {
    errors.push(
      `monthlyRatePercent deve ser menor ou igual a ${MAX_MONTHLY_RATE_PERCENT}.`,
    );
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
    errors.push(
      `termMonths deve ser um inteiro positivo. Valor recebido: ${String(value)}.`,
    );
    return;
  }

  if (value <= 0) {
    errors.push("termMonths deve ser maior que zero.");
    return;
  }

  if (value > MAX_TERM_MONTHS) {
    errors.push(`termMonths deve ser menor ou igual a ${MAX_TERM_MONTHS}.`);
  }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype: object | null = Object.getPrototypeOf(value);
  return prototype === Object.prototype;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function readOwnProperty(
  record: Record<string, unknown>,
  key: string,
): unknown {
  if (!Object.hasOwn(record, key)) {
    return undefined;
  }

  const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(
    record,
    key,
  );

  if (descriptor?.get !== undefined || descriptor?.set !== undefined) {
    return undefined;
  }

  return descriptor?.value;
}
