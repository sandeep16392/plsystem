import { describe, it, expect } from "vitest";
import { formatCurrency, getCurrencySymbol, formatCurrencyWithCode } from "@/utils/currency";

describe("getCurrencySymbol", () => {
  it("returns $ for USD", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("returns € for EUR", () => {
    expect(getCurrencySymbol("EUR")).toBe("\u20AC");
  });

  it("returns code for unknown currency", () => {
    expect(getCurrencySymbol("XYZ")).toBe("XYZ");
  });
});

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
  });

  it("formats EUR correctly", () => {
    expect(formatCurrency("99.9", "EUR")).toBe("\u20AC99.90");
  });

  it("formats JPY with zero decimals", () => {
    expect(formatCurrency(5000, "JPY")).toBe("\u00A55,000");
  });

  it("handles negative amounts", () => {
    expect(formatCurrency(-50, "USD")).toBe("-$50.00");
  });

  it("handles zero", () => {
    expect(formatCurrency(0, "USD")).toBe("$0.00");
  });
});

describe("formatCurrencyWithCode", () => {
  it("appends currency code", () => {
    expect(formatCurrencyWithCode(100, "EUR")).toBe("\u20AC100.00 EUR");
  });
});
