import { Expense } from "@/types/expense";
import { centsToDollars, formatDate } from "@/lib/formatters";

export type ExportFormat = "csv" | "json" | "pdf";

export interface ExportOptions {
  expenses: Expense[];
  format: ExportFormat;
  filename: string;
  dateFrom: string;
  dateTo: string;
  categories: string[];
}

export function filterExpenses(
  expenses: Expense[],
  dateFrom: string,
  dateTo: string,
  categories: string[]
): Expense[] {
  return expenses
    .filter((e) => {
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      if (categories.length > 0 && !categories.includes(e.category)) return false;
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function generateDefaultFilename(): string {
  return `expenses-${new Date().toISOString().slice(0, 10)}`;
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(expenses: Expense[], filename: string): void {
  const headers = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    centsToDollars(e.amount),
    `"${e.description.replace(/"/g, '""')}"`,
  ]);

  const bom = "\uFEFF";
  const csvContent = bom + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export function exportJson(expenses: Expense[], filename: string): void {
  const cleanData = expenses.map((e) => ({
    date: e.date,
    category: e.category,
    amount: Number(centsToDollars(e.amount)),
    description: e.description,
  }));

  const jsonContent = JSON.stringify(cleanData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  triggerDownload(blob, `${filename}.json`);
}

export async function exportPdf(expenses: Expense[], filename: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF();
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  doc.setFontSize(18);
  doc.text("Expense Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`Total: $${centsToDollars(totalAmount)} | ${expenses.length} record(s)`, 14, 36);

  doc.autoTable({
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((e) => [
      formatDate(e.date),
      e.category,
      `$${centsToDollars(e.amount)}`,
      e.description,
    ]),
    startY: 42,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 9 },
    margin: { top: 42 },
  });

  doc.save(`${filename}.pdf`);
}

export async function executeExport(options: ExportOptions): Promise<void> {
  const filtered = filterExpenses(
    options.expenses,
    options.dateFrom,
    options.dateTo,
    options.categories
  );

  switch (options.format) {
    case "csv":
      exportCsv(filtered, options.filename);
      break;
    case "json":
      exportJson(filtered, options.filename);
      break;
    case "pdf":
      await exportPdf(filtered, options.filename);
      break;
  }
}
