"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatters";
import { getCategoryDef } from "@/lib/constants";

interface CategoryTotal {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export default function TopCategoriesPage() {
  const { expenses, isLoaded } = useExpenses();

  const categoryTotals = useMemo(() => {
    if (expenses.length === 0) return [];

    const totalsMap: Record<string, { total: number; count: number }> = {};

    for (const expense of expenses) {
      if (!totalsMap[expense.category]) {
        totalsMap[expense.category] = { total: 0, count: 0 };
      }
      totalsMap[expense.category].total += expense.amount;
      totalsMap[expense.category].count += 1;
    }

    const grandTotal = Object.values(totalsMap).reduce(
      (sum, cat) => sum + cat.total,
      0
    );

    const ranked: CategoryTotal[] = Object.entries(totalsMap)
      .map(([category, { total, count }]) => ({
        category,
        total,
        count,
        percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return ranked;
  }, [expenses]);

  const grandTotal = useMemo(
    () => categoryTotals.reduce((sum, cat) => sum + cat.total, 0),
    [categoryTotals]
  );

  if (!isLoaded) {
    return (
      <div>
        <Header title="Top Categories" />
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header title="Top Categories">
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </Header>

      {expenses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">
                No expenses yet
              </p>
              <p className="text-gray-400 mb-6">
                Add some expenses to see your top spending categories.
              </p>
              <Link href="/expenses/new">
                <Button>Add Your First Expense</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Spending by Category
              </h2>
              <p className="text-sm text-gray-500">
                Total: {formatCurrency(grandTotal)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {categoryTotals.map((cat, index) => {
                const def = getCategoryDef(cat.category);
                return (
                  <div
                    key={cat.category}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-gray-400 w-8 text-center">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge category={cat.category} />
                        <span className="text-sm text-gray-500">
                          {cat.count}{" "}
                          {cat.count === 1 ? "expense" : "expenses"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: def.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-semibold text-gray-900">
                        {formatCurrency(cat.total)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cat.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
