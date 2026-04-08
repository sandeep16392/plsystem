import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { simplifyDebts } from "@/utils/debtSimplify";

describe("simplifyDebts", () => {
  it("handles two people, one owes the other", () => {
    const balances = new Map<string, Decimal>([
      ["a", new Decimal("50")],
      ["b", new Decimal("-50")],
    ]);
    const result = simplifyDebts(balances);
    expect(result.length).toBe(1);
    expect(result[0].fromUser).toBe("b");
    expect(result[0].toUser).toBe("a");
    expect(result[0].amount.eq(50)).toBe(true);
  });

  it("simplifies 3-person circular debts", () => {
    const balances = new Map<string, Decimal>([
      ["a", new Decimal("30")],
      ["b", new Decimal("10")],
      ["c", new Decimal("-40")],
    ]);
    const result = simplifyDebts(balances);
    expect(result.length).toBeLessThanOrEqual(2);
    const totalFromC = result
      .filter((t) => t.fromUser === "c")
      .reduce((s, t) => s.plus(t.amount), new Decimal(0));
    expect(totalFromC.eq(40)).toBe(true);
  });

  it("returns empty for all-zero balances", () => {
    const balances = new Map<string, Decimal>([
      ["a", new Decimal("0")],
      ["b", new Decimal("0")],
    ]);
    const result = simplifyDebts(balances);
    expect(result.length).toBe(0);
  });

  it("verifies net zero for 5-person scenario", () => {
    const balances = new Map<string, Decimal>([
      ["a", new Decimal("100")],
      ["b", new Decimal("-30")],
      ["c", new Decimal("-20")],
      ["d", new Decimal("10")],
      ["e", new Decimal("-60")],
    ]);
    const result = simplifyDebts(balances);

    // Verify net zero
    const net = new Map<string, Decimal>();
    for (const t of result) {
      net.set(t.fromUser, (net.get(t.fromUser) || new Decimal(0)).minus(t.amount));
      net.set(t.toUser, (net.get(t.toUser) || new Decimal(0)).plus(t.amount));
    }
    for (const [uid, balance] of balances) {
      const actual = net.get(uid) || new Decimal(0);
      expect(actual.minus(balance).abs().lt(new Decimal("0.01"))).toBe(true);
    }
  });
});
