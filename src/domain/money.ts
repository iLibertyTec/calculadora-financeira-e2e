const MONEY_EPSILON: number = 1e-10;

function assertFiniteNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number`);
  }
}

function roundToIntegerAwayFromZero(value: number): number {
  if (value === 0) {
    return 0;
  }

  const absolute: number = Math.abs(value);
  const floorValue: number = Math.floor(absolute);
  const fraction: number = absolute - floorValue;
  const roundedAbsolute: number = fraction >= 0.5
    ? floorValue + 1
    : floorValue;

  return value < 0 ? -roundedAbsolute : roundedAbsolute;
}

function normalizeHalfStep(value: number): number {
  if (value === 0) {
    return 0;
  }

  const sign: number = Math.sign(value);
  const absolute: number = Math.abs(value);
  const floorValue: number = Math.floor(absolute);
  const fraction: number = absolute - floorValue;

  if (Math.abs(fraction - 0.5) <= MONEY_EPSILON) {
    return sign * (floorValue + 0.5);
  }

  return value;
}

function toRoundedCents(value: number): number {
  assertFiniteNumber(value, "value");

  return roundToIntegerAwayFromZero(normalizeHalfStep(value * 100));
}

export function roundMoney(value: number): number {
  return toRoundedCents(value) / 100;
}

export function toCents(value: number): number {
  return toRoundedCents(value);
}

export function fromCents(cents: number): number {
  assertFiniteNumber(cents, "cents");

  if (!Number.isInteger(cents)) {
    throw new RangeError("cents must be an integer");
  }

  return cents / 100;
}
