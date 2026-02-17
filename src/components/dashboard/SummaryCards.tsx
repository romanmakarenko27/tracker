"use client";

import { ExpenseSummary } from "@/types/expense";
import { formatCurrency } from "@/lib/formatters";
import { Card } from "@/components/ui/Card";

interface SummaryCardsProps {
  summary: ExpenseSummary;
  isLoaded: boolean;
}

const cards = [
  { key: "totalSpent" as const, label: "Total Spent", format: formatCurrency },
  { key: "expenseCount" as const, label: "Expenses", format: (v: number) => v.toString() },
  { key: "averageExpense" as const, label: "Average", format: formatCurrency },
  { key: "topCategory" as const, label: "Top Category", format: (v: string) => v },
];

export function SummaryCards({ summary, isLoaded }: SummaryCardsProps) {
  if (!isLoaded) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5">
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.key} className="p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {card.key === "topCategory"
              ? card.format(summary[card.key] as string)
              : (card.format as (v: number) => string)(summary[card.key] as number)}
          </p>
        </Card>
      ))}
    </div>
  );
}
