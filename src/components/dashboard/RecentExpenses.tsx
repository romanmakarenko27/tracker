"use client";

import Link from "next/link";
import { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recent = [...expenses]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Recent Expenses</h2>
        <Link href="/expenses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">No expenses yet</div>
        ) : (
          <div className="space-y-3">
            {recent.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
                    <Badge category={expense.category} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(expense.date)}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-4">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
