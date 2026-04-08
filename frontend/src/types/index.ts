// User
export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  default_currency: string;
  avatar_url: string | null;
  created_at: string;
}

// Auth
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// Group
export interface Group {
  id: string;
  name: string;
  group_type: "trip" | "home" | "couple" | "other";
  target_currency: string;
  created_by: string;
  trip_start_date: string | null;
  trip_end_date: string | null;
  simplify_debts: boolean;
  created_at: string;
  updated_at: string;
  members: GroupMember[];
}

export interface GroupMember {
  id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
}

export interface GroupCreate {
  name: string;
  group_type: string;
  target_currency: string;
  trip_start_date?: string;
  trip_end_date?: string;
  simplify_debts?: boolean;
}

// Expense
export interface Expense {
  id: string;
  group_id: string;
  paid_by: string;
  description: string;
  amount: string;
  currency: string;
  converted_amount: string | null;
  exchange_rate: string | null;
  rate_date: string | null;
  category: string;
  split_method: "equal" | "exact" | "percentage" | "shares";
  expense_date: string;
  receipt_url: string | null;
  notes: string | null;
  is_settlement: boolean;
  created_at: string;
  updated_at: string;
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  owed_amount: string;
  converted_owed_amount: string | null;
  paid_amount: string;
}

export interface ExpenseCreate {
  description: string;
  amount: string;
  currency: string;
  category?: string;
  split_method: string;
  expense_date?: string;
  notes?: string;
  splits?: SplitInput[];
  is_settlement?: boolean;
}

export interface SplitInput {
  user_id: string;
  owed_amount?: string;
  percentage?: string;
  shares?: number;
}

// Balance & Debt
export interface BalanceEntry {
  user_id: string;
  balance: string;
}

export interface DebtEntry {
  from_user: string;
  to_user: string;
  amount: string;
  currency: string;
}

// Sync
export interface SyncOperation {
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  payload: Record<string, unknown>;
  local_id: string;
  timestamp: string;
}

export type SyncStatus = "synced" | "syncing" | "offline" | "error";
