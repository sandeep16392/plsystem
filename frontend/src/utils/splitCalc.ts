import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_EVEN });

export interface SplitResult {
  userId: string;
  amount: Decimal;
}

export function calculateEqualSplit(
  total: Decimal,
  memberIds: string[]
): SplitResult[] {
  const n = memberIds.length;
  if (n === 0) throw new Error("No members to split with");

  const perPerson = total.div(n).toDecimalPlaces(4, Decimal.ROUND_HALF_EVEN);
  const remainder = total.minus(perPerson.mul(n));

  return memberIds.map((userId, i) => ({
    userId,
    amount: i === 0 ? perPerson.plus(remainder) : perPerson,
  }));
}

export function calculateExactSplit(
  total: Decimal,
  splits: { userId: string; amount: Decimal }[]
): SplitResult[] {
  const splitTotal = splits.reduce(
    (sum, s) => sum.plus(s.amount),
    new Decimal(0)
  );
  if (!splitTotal.eq(total)) {
    throw new Error(
      `Split amounts (${splitTotal}) do not match total (${total})`
    );
  }
  return splits.map((s) => ({ userId: s.userId, amount: s.amount }));
}

export function calculatePercentageSplit(
  total: Decimal,
  splits: { userId: string; percentage: Decimal }[]
): SplitResult[] {
  const pctTotal = splits.reduce(
    (sum, s) => sum.plus(s.percentage),
    new Decimal(0)
  );
  if (!pctTotal.eq(100)) {
    throw new Error(`Percentages (${pctTotal}%) do not sum to 100%`);
  }

  let runningTotal = new Decimal(0);
  return splits.map((s, i) => {
    let amount: Decimal;
    if (i === splits.length - 1) {
      amount = total.minus(runningTotal);
    } else {
      amount = total
        .mul(s.percentage)
        .div(100)
        .toDecimalPlaces(4, Decimal.ROUND_HALF_EVEN);
      runningTotal = runningTotal.plus(amount);
    }
    return { userId: s.userId, amount };
  });
}

export function calculateSharesSplit(
  total: Decimal,
  splits: { userId: string; shares: number }[]
): SplitResult[] {
  const totalShares = splits.reduce((sum, s) => sum + s.shares, 0);
  if (totalShares === 0) throw new Error("Total shares cannot be zero");

  let runningTotal = new Decimal(0);
  return splits.map((s, i) => {
    let amount: Decimal;
    if (i === splits.length - 1) {
      amount = total.minus(runningTotal);
    } else {
      amount = total
        .mul(s.shares)
        .div(totalShares)
        .toDecimalPlaces(4, Decimal.ROUND_HALF_EVEN);
      runningTotal = runningTotal.plus(amount);
    }
    return { userId: s.userId, amount };
  });
}
