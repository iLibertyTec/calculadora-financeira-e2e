function roundToIntegerAwayFromZero(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

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

function toRoundedCents(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  return roundToIntegerAwayFromZero(value * 100);
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  return toRoundedCents(value) / 100;
}

export function toCents(value: number): number {
  return toRoundedCents(value);
}

export function fromCents(cents: number): number {
  if (!Number.isFinite(cents)) {
    return cents;
  }

  if (!Number.isInteger(cents)) {
    throw new RangeError("cents must be an integer");
  }

  return cents / 100;
}
