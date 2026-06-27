export const SUPPORTED_CURRENCIES = ["BRL", "USD", "EUR", "GBP"] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const MOCK_RATES_VERSION = "mock-2024-01";
export const MOCK_RATES_TIMESTAMP = "2024-01-01T00:00:00.000Z";
export const MOCK_RATES_BASE_CURRENCY: SupportedCurrency = "USD";

const MOCK_RATES_TO_BASE: Record<SupportedCurrency, number> = {
  BRL: 5,
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

export type CurrencyConversionSuccess = {
  ok: true;
  rate: number;
  convertedAmount: number;
  sourceCurrency: SupportedCurrency;
  targetCurrency: SupportedCurrency;
  version: string;
  timestamp: string;
};

export type CurrencyConversionError = {
  ok: false;
  error: "UNSUPPORTED_CURRENCY";
  currency: string;
  supportedCurrencies: readonly SupportedCurrency[];
};

export type CurrencyConversionResult = CurrencyConversionSuccess | CurrencyConversionError;

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(value as SupportedCurrency);
}

export function convertCurrency(
  amount: number,
  sourceCurrency: string,
  targetCurrency: string,
): CurrencyConversionResult {
  if (!isSupportedCurrency(sourceCurrency)) {
    return {
      ok: false,
      error: "UNSUPPORTED_CURRENCY",
      currency: sourceCurrency,
      supportedCurrencies: SUPPORTED_CURRENCIES,
    };
  }

  if (!isSupportedCurrency(targetCurrency)) {
    return {
      ok: false,
      error: "UNSUPPORTED_CURRENCY",
      currency: targetCurrency,
      supportedCurrencies: SUPPORTED_CURRENCIES,
    };
  }

  const sourceRateToBase = MOCK_RATES_TO_BASE[sourceCurrency];
  const targetRateToBase = MOCK_RATES_TO_BASE[targetCurrency];
  const conversionRate = targetRateToBase / sourceRateToBase;

  return {
    ok: true,
    rate: conversionRate,
    convertedAmount: amount * conversionRate,
    sourceCurrency,
    targetCurrency,
    version: MOCK_RATES_VERSION,
    timestamp: MOCK_RATES_TIMESTAMP,
  };
}
