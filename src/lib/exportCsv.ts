import { Expense } from "@/types/expense";
import { centsToDollars, formatDate } from "@/lib/formatters";

export function exportExpensesToCsv(expenses: Expense[]): void {
  const headers = ["Date", "Category", "Amount", "Description"];

  const rows = expenses
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [
      formatDate(e.date),
      e.category,
      centsToDollars(e.amount),
      `"${e.description.replace(/"/g, '""')}"`,
    ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
