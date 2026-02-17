import { ExportTemplate } from "@/types/export";
import { CATEGORY_NAMES } from "@/lib/constants";

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: "tax-report",
    name: "Tax Report",
    description: "Complete annual expense report formatted for tax filing. Includes all categories sorted by date.",
    icon: "receipt",
    format: "pdf",
    categories: [...CATEGORY_NAMES],
    dateRangeType: "last-365",
    sortBy: "date",
    sortOrder: "asc",
    includeCharts: false,
    color: "bg-emerald-500",
  },
  {
    id: "monthly-summary",
    name: "Monthly Summary",
    description: "Last 30 days of spending with category breakdowns. Perfect for monthly budget reviews.",
    icon: "calendar",
    format: "csv",
    categories: [...CATEGORY_NAMES],
    dateRangeType: "last-30",
    sortBy: "category",
    sortOrder: "asc",
    includeCharts: false,
    color: "bg-blue-500",
  },
  {
    id: "category-analysis",
    name: "Category Analysis",
    description: "Detailed breakdown by spending category for the last 90 days. Great for identifying trends.",
    icon: "chart",
    format: "json",
    categories: [...CATEGORY_NAMES],
    dateRangeType: "last-90",
    sortBy: "category",
    sortOrder: "desc",
    includeCharts: true,
    color: "bg-violet-500",
  },
  {
    id: "annual-overview",
    name: "Annual Overview",
    description: "Year-to-date comprehensive export with all expenses sorted by amount. Ideal for annual planning.",
    icon: "globe",
    format: "pdf",
    categories: [...CATEGORY_NAMES],
    dateRangeType: "ytd",
    sortBy: "amount",
    sortOrder: "desc",
    includeCharts: true,
    color: "bg-amber-500",
  },
];

export function getTemplateDateRange(
  type: ExportTemplate["dateRangeType"]
): { from: string; to: string } {
  const today = new Date();
  const to = today.toISOString().slice(0, 10);

  switch (type) {
    case "last-30": {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString().slice(0, 10), to };
    }
    case "last-90": {
      const from = new Date(today);
      from.setDate(from.getDate() - 90);
      return { from: from.toISOString().slice(0, 10), to };
    }
    case "last-365": {
      const from = new Date(today);
      from.setFullYear(from.getFullYear() - 1);
      return { from: from.toISOString().slice(0, 10), to };
    }
    case "ytd": {
      return { from: `${today.getFullYear()}-01-01`, to };
    }
    default:
      return { from: "", to };
  }
}
