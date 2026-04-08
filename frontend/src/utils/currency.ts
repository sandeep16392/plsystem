const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  JPY: "\u00A5",
  INR: "\u20B9",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "\u00A5",
  SEK: "kr",
  NZD: "NZ$",
  MXN: "MX$",
  SGD: "S$",
  HKD: "HK$",
  NOK: "kr",
  KRW: "\u20A9",
  TRY: "\u20BA",
  BRL: "R$",
  ZAR: "R",
  THB: "\u0E3F",
};

// Currencies with 0 decimal places
const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW", "VND"]);

export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

export function formatCurrency(
  amount: string | number,
  currencyCode: string
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const decimals = ZERO_DECIMAL_CURRENCIES.has(currencyCode) ? 0 : 2;
  const symbol = getCurrencySymbol(currencyCode);

  const formatted = Math.abs(numAmount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const sign = numAmount < 0 ? "-" : "";
  return `${sign}${symbol}${formatted}`;
}

export function formatCurrencyWithCode(
  amount: string | number,
  currencyCode: string
): string {
  return `${formatCurrency(amount, currencyCode)} ${currencyCode}`;
}
