const MAX_SAFE_CENTS: number = Number.MAX_SAFE_INTEGER;

function assertFiniteNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number`);
  }
}

function assertSafeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${name} must be a safe integer`);
  }
}

function decimalPlaces(value: number): number {
  const normalized: string = value.toString().toLowerCase();

  if (normalized.includes("e")) {
    const [coefficient, exponentPart] = normalized.split("e");
    const exponent: number = Number(exponentPart);
    const fractionalDigits: number = (coefficient.split(".")[1] ?? "").length;
    return Math.max(0, fractionalDigits - exponent);
  }

  return (normalized.split(".")[1] ?? "").length;
}

function shiftDecimal(value: number, places: number): number {
  assertFiniteNumber(value, "value");

  if (!Number.isInteger(places)) {
    throw new RangeError("places must be an integer");
  }

  if (value === 0 || places === 0) {
    return value;
  }

  const [coefficient, exponentPart = "0"] = value.toString().split("e");
  const exponent: number = Number(exponentPart);
  const shiftedExponent: number = exponent + places;
  return Number(`${coefficient}e${shiftedExponent}`);
}

export function roundToMoneyCents(value: number): number {
  assertFiniteNumber(value, "value");

  const centsValue: number = shiftDecimal(value, 2);
  const roundedCents: number = centsValue < 0
    ? Math.ceil(centsValue - 0.5)
    : Math.floor(centsValue + 0.5);

  assertSafeInteger(roundedCents, "cents");

  if (Math.abs(roundedCents) > MAX_SAFE_CENTS) {
    throw new RangeError("cents must be a safe integer");
  }

  return roundedCents;
}

export function roundMoney(value: number): number {
  return fromCents(roundToMoneyCents(value));
}

export function toCents(value: number): number {
  return roundToMoneyCents(value);
}

export function fromCents(cents: number): number {
  assertFiniteNumber(cents, "cents");

  if (!Number.isInteger(cents)) {
    throw new RangeError("cents must be an integer");
  }

  assertSafeInteger(cents, "cents");

  const money: number = cents / 100;

  if (decimalPlaces(money) > 2) {
    throw new RangeError("cents could not be represented with two decimal places");
  }

  return money;
}
