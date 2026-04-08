import Dexie, { Table } from "dexie";

export interface LocalGroup {
  local_id: string;
  server_id?: string;
  name: string;
  group_type: string;
  target_currency: string;
  created_by: string;
  trip_start_date?: string;
  trip_end_date?: string;
  simplify_debts: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalExpense {
  local_id: string;
  server_id?: string;
  group_local_id: string;
  paid_by: string;
  description: string;
  amount: string;
  currency: string;
  converted_amount?: string;
  exchange_rate?: string;
  category: string;
  split_method: string;
  expense_date: string;
  notes?: string;
  is_settlement: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalExpenseSplit {
  local_id: string;
  expense_local_id: string;
  user_id: string;
  owed_amount: string;
  converted_owed_amount?: string;
}

export interface LocalSyncQueueItem {
  id?: number;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  payload: Record<string, unknown>;
  local_id: string;
  timestamp: string;
  retries: number;
}

export interface LocalExchangeRate {
  key: string; // "USD:EUR:2024-01-15"
  base_currency: string;
  target_currency: string;
  rate: string;
  rate_date: string;
  fetched_at: string;
}

export class SplitwiseDB extends Dexie {
  groups!: Table<LocalGroup, string>;
  expenses!: Table<LocalExpense, string>;
  expense_splits!: Table<LocalExpenseSplit, string>;
  sync_queue!: Table<LocalSyncQueueItem, number>;
  exchange_rates!: Table<LocalExchangeRate, string>;

  constructor() {
    super("splitwise_db");
    this.version(1).stores({
      groups: "local_id, server_id, name",
      expenses: "local_id, server_id, group_local_id, expense_date",
      expense_splits: "local_id, expense_local_id, user_id",
      sync_queue: "++id, entity, local_id, timestamp",
      exchange_rates: "key, base_currency, target_currency, rate_date",
    });
  }
}

export const db = new SplitwiseDB();
