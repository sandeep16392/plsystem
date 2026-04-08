import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import type { Expense, BalanceEntry, DebtEntry, Group } from "../types";
import { formatCurrency } from "../utils/currency";

export default function GroupDetail({ groupId, onBack }: { groupId: string; onBack: () => void }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<BalanceEntry[]>([]);
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [tab, setTab] = useState<"expenses" | "balances">("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Add expense form state
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCurrency, setExpCurrency] = useState("USD");
  const [addError, setAddError] = useState("");

  useEffect(() => { loadAll(); }, [groupId]);

  const loadAll = async () => {
    const [g, e, b, d] = await Promise.all([
      apiRequest<Group>(`/groups/${groupId}`),
      apiRequest<Expense[]>(`/groups/${groupId}/expenses`),
      apiRequest<BalanceEntry[]>(`/groups/${groupId}/balances`),
      apiRequest<DebtEntry[]>(`/groups/${groupId}/debts`),
    ]);
    setGroup(g);
    setExpenses(e);
    setBalances(b);
    setDebts(d);
    setExpCurrency(g.target_currency);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    try {
      await apiRequest(`/groups/${groupId}/expenses`, {
        method: "POST",
        body: { description: expDesc, amount: expAmount, currency: expCurrency },
      });
      setExpDesc("");
      setExpAmount("");
      setShowAddExpense(false);
      await loadAll();
    } catch (err: unknown) {
      setAddError((err as Error).message);
    }
  };

  const handleSettle = async (debt: DebtEntry) => {
    await apiRequest(`/groups/${groupId}/settle`, {
      method: "POST",
      body: { to_user_id: debt.to_user, amount: debt.amount, currency: debt.currency },
    });
    await loadAll();
  };

  if (!group) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <button data-testid="back-to-groups" onClick={onBack} className="text-primary-600 mb-2">← Groups</button>
      <div className="mb-4">
        <h1 className="text-xl font-bold" data-testid="group-detail-name">{group.name}</h1>
        <p className="text-sm text-gray-500" data-testid="group-detail-info">
          {group.group_type} · Target: {group.target_currency} · {group.members.length} members
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button data-testid="tab-expenses" className={`px-4 py-2 font-medium ${tab === "expenses" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"}`} onClick={() => setTab("expenses")}>Expenses</button>
        <button data-testid="tab-balances" className={`px-4 py-2 font-medium ${tab === "balances" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"}`} onClick={() => setTab("balances")}>Balances</button>
      </div>

      {tab === "expenses" && (
        <div>
          <button data-testid="add-expense-btn" onClick={() => setShowAddExpense(true)} className="w-full py-2 mb-3 bg-primary-600 text-white rounded-lg text-sm font-medium">+ Add Expense</button>

          {showAddExpense && (
            <form onSubmit={handleAddExpense} className="bg-white p-4 rounded-lg shadow mb-4 space-y-3" data-testid="add-expense-form">
              <input data-testid="expense-desc" type="text" placeholder="Description" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              <div className="flex gap-2">
                <input data-testid="expense-amount" type="number" step="0.01" placeholder="Amount" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="flex-1 px-3 py-2 border rounded" required />
                <select data-testid="expense-currency" value={expCurrency} onChange={(e) => setExpCurrency(e.target.value)} className="px-3 py-2 border rounded">
                  <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option><option value="INR">INR</option>
                </select>
              </div>
              {addError && <p data-testid="add-expense-error" className="text-red-500 text-sm">{addError}</p>}
              <div className="flex gap-2">
                <button data-testid="expense-submit" type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded font-medium">Save</button>
                <button type="button" onClick={() => setShowAddExpense(false)} className="flex-1 py-2 bg-gray-200 rounded font-medium">Cancel</button>
              </div>
            </form>
          )}

          <div data-testid="expense-list" className="space-y-2">
            {expenses.length === 0 ? (
              <p data-testid="no-expenses" className="text-gray-500 text-center">No expenses yet</p>
            ) : expenses.map((exp) => (
              <div key={exp.id} data-testid={`expense-${exp.id}`} className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="flex justify-between">
                  <span className="font-medium" data-testid="expense-description">{exp.description}</span>
                  <span className="font-bold" data-testid="expense-amount-display">
                    {formatCurrency(exp.amount, exp.currency)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{exp.expense_date} · {exp.split_method} split{exp.is_settlement ? " · Settlement" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "balances" && (
        <div>
          <h3 className="font-semibold mb-2">Member Balances</h3>
          <div data-testid="balance-list" className="space-y-2 mb-4">
            {balances.map((b) => (
              <div key={b.user_id} data-testid={`balance-${b.user_id}`} className="flex justify-between p-2 bg-white rounded border">
                <span className="text-sm">{b.user_id.slice(0, 8)}...</span>
                <span className={`font-bold ${parseFloat(b.balance) >= 0 ? "text-green-600" : "text-red-600"}`} data-testid="balance-amount">
                  {formatCurrency(b.balance, group.target_currency)}
                </span>
              </div>
            ))}
          </div>
          <h3 className="font-semibold mb-2">Simplified Debts</h3>
          <div data-testid="debt-list" className="space-y-2">
            {debts.length === 0 ? (
              <p data-testid="no-debts" className="text-green-600 text-center">All settled up!</p>
            ) : debts.map((d, i) => (
              <div key={i} data-testid={`debt-${i}`} className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="text-sm">{d.from_user.slice(0, 8)}... → {d.to_user.slice(0, 8)}...</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600" data-testid="debt-amount">{formatCurrency(d.amount, d.currency)}</span>
                  <button data-testid={`settle-btn-${i}`} onClick={() => handleSettle(d)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Settle</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
