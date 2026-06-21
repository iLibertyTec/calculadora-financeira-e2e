function roundHalfAwayFromZero(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  const absolute: number = Math.abs(value);
  const rounded: number = Math.round((absolute + Number.EPSILON) * 100);

  return Math.sign(value) * rounded;
}

export function roundMoney(value: number): number {
  return roundHalfAwayFromZero(value) / 100;
}

export function toCents(value: number): number {
  return roundHalfAwayFromZero(value);
}

export function fromCents(cents: number): number {
  return cents / 100;
}
