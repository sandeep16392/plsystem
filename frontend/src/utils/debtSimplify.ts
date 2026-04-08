import Decimal from "decimal.js";

export interface DebtTransaction {
  fromUser: string;
  toUser: string;
  amount: Decimal;
}

const THRESHOLD = new Decimal("0.001");

export function simplifyDebts(
  balances: Map<string, Decimal>
): DebtTransaction[] {
  const creditors: [Decimal, string][] = [];
  const debtors: [Decimal, string][] = [];

  for (const [uid, balance] of balances) {
    if (balance.gt(THRESHOLD)) {
      creditors.push([balance, uid]);
    } else if (balance.lt(THRESHOLD.neg())) {
      debtors.push([balance.abs(), uid]);
    }
  }

  creditors.sort((a, b) => b[0].cmp(a[0]));
  debtors.sort((a, b) => b[0].cmp(a[0]));

  const transactions: DebtTransaction[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const transfer = Decimal.min(creditors[i][0], debtors[j][0]);
    if (transfer.gt(THRESHOLD)) {
      transactions.push({
        fromUser: debtors[j][1],
        toUser: creditors[i][1],
        amount: transfer,
      });
    }
    creditors[i][0] = creditors[i][0].minus(transfer);
    debtors[j][0] = debtors[j][0].minus(transfer);
    if (creditors[i][0].lte(THRESHOLD)) i++;
    if (debtors[j][0].lte(THRESHOLD)) j++;
  }

  return transactions;
}
