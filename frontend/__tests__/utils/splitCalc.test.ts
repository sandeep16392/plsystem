import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  calculateEqualSplit,
  calculateExactSplit,
  calculatePercentageSplit,
  calculateSharesSplit,
} from "@/utils/splitCalc";

describe("calculateEqualSplit", () => {
  it("splits evenly among 4 people", () => {
    const result = calculateEqualSplit(new Decimal("100"), ["a", "b", "c", "d"]);
    expect(result.length).toBe(4);
    const total = result.reduce((s, r) => s.plus(r.amount), new Decimal(0));
    expect(total.eq(100)).toBe(true);
    expect(result.every((r) => r.amount.eq(25))).toBe(true);
  });

  it("handles uneven split (100 / 3)", () => {
    const result = calculateEqualSplit(new Decimal("100"), ["a", "b", "c"]);
    const total = result.reduce((s, r) => s.plus(r.amount), new Decimal(0));
    expect(total.eq(100)).toBe(true);
  });

  it("single person gets full amount", () => {
    const result = calculateEqualSplit(new Decimal("50"), ["a"]);
    expect(result[0].amount.eq(50)).toBe(true);
  });

  it("throws on empty members", () => {
    expect(() => calculateEqualSplit(new Decimal("100"), [])).toThrow();
  });
});

describe("calculateExactSplit", () => {
  it("accepts matching totals", () => {
    const result = calculateExactSplit(new Decimal("100"), [
      { userId: "a", amount: new Decimal("60") },
      { userId: "b", amount: new Decimal("40") },
    ]);
    expect(result.length).toBe(2);
  });

  it("rejects mismatched totals", () => {
    expect(() =>
      calculateExactSplit(new Decimal("100"), [
        { userId: "a", amount: new Decimal("60") },
        { userId: "b", amount: new Decimal("30") },
      ])
    ).toThrow("do not match");
  });
});

describe("calculatePercentageSplit", () => {
  it("calculates 50/30/20 split of 200", () => {
    const result = calculatePercentageSplit(new Decimal("200"), [
      { userId: "a", percentage: new Decimal("50") },
      { userId: "b", percentage: new Decimal("30") },
      { userId: "c", percentage: new Decimal("20") },
    ]);
    const total = result.reduce((s, r) => s.plus(r.amount), new Decimal(0));
    expect(total.eq(200)).toBe(true);
    expect(result[0].amount.eq(100)).toBe(true);
  });

  it("rejects percentages not summing to 100", () => {
    expect(() =>
      calculatePercentageSplit(new Decimal("200"), [
        { userId: "a", percentage: new Decimal("50") },
        { userId: "b", percentage: new Decimal("30") },
      ])
    ).toThrow("100%");
  });
});

describe("calculateSharesSplit", () => {
  it("splits by shares correctly", () => {
    const result = calculateSharesSplit(new Decimal("400"), [
      { userId: "a", shares: 2 },
      { userId: "b", shares: 1 },
      { userId: "c", shares: 1 },
    ]);
    const total = result.reduce((s, r) => s.plus(r.amount), new Decimal(0));
    expect(total.eq(400)).toBe(true);
    expect(result[0].amount.eq(200)).toBe(true);
  });

  it("throws on zero shares", () => {
    expect(() =>
      calculateSharesSplit(new Decimal("100"), [
        { userId: "a", shares: 0 },
        { userId: "b", shares: 0 },
      ])
    ).toThrow("zero");
  });
});
