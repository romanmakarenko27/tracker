export interface Expense {
  id: string;
  amount: number; // stored in cents
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  amount: string; // user input as dollars string
  category: string;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  dateFrom: string;
  dateTo: string;
  category: string; // "All" or a specific category
}

export interface ExpenseSummary {
  totalSpent: number; // cents
  expenseCount: number;
  averageExpense: number; // cents
  topCategory: string;
  categoryTotals: Record<string, number>;
  dailyTotals: { date: string; total: number }[];
}
