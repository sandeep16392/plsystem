import uuid
from decimal import Decimal


class DebtService:
    @staticmethod
    def simplify_debts(
        balances: dict[uuid.UUID, Decimal],
    ) -> list[dict]:
        creditors: list[list] = []
        debtors: list[list] = []

        for uid, balance in balances.items():
            if balance > Decimal("0.001"):
                creditors.append([balance, uid])
            elif balance < Decimal("-0.001"):
                debtors.append([-balance, uid])

        creditors.sort(reverse=True, key=lambda x: x[0])
        debtors.sort(reverse=True, key=lambda x: x[0])

        transactions = []
        i, j = 0, 0
        while i < len(creditors) and j < len(debtors):
            transfer = min(creditors[i][0], debtors[j][0])
            if transfer > Decimal("0.001"):
                transactions.append({
                    "from_user": debtors[j][1],
                    "to_user": creditors[i][1],
                    "amount": transfer,
                })
            creditors[i][0] -= transfer
            debtors[j][0] -= transfer
            if creditors[i][0] <= Decimal("0.001"):
                i += 1
            if debtors[j][0] <= Decimal("0.001"):
                j += 1

        return transactions
