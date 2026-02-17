import { Expense, ExpenseSummary } from "@/types/expense";
import { format, subDays } from "date-fns";

export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? Math.round(totalSpent / expenseCount) : 0;

  // Category totals
  const categoryTotals: Record<string, number> = {};
  for (const e of expenses) {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  }

  // Top category
  let topCategory = "N/A";
  let maxAmount = 0;
  for (const [cat, total] of Object.entries(categoryTotals)) {
    if (total > maxAmount) {
      maxAmount = total;
      topCategory = cat;
    }
  }

  // Daily totals for last 30 days
  const dailyTotals = getDailyTotals(expenses, 30);

  return {
    totalSpent,
    expenseCount,
    averageExpense,
    topCategory,
    categoryTotals,
    dailyTotals,
  };
}

function getDailyTotals(expenses: Expense[], days: number): { date: string; total: number }[] {
  const today = new Date();
  const dateMap: Record<string, number> = {};

  // Initialize all days with 0
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(today, i), "yyyy-MM-dd");
    dateMap[d] = 0;
  }

  // Sum expenses per day
  for (const e of expenses) {
    if (dateMap[e.date] !== undefined) {
      dateMap[e.date] += e.amount;
    }
  }

  return Object.entries(dateMap).map(([date, total]) => ({ date, total }));
}

export function getCategoryData(categoryTotals: Record<string, number>) {
  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
