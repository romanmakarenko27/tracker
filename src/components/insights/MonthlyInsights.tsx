"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/Card";
import { Expense } from "@/types/expense";
import { getCategoryDef } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const CATEGORY_EMOJIS: Record<string, string> = {
  Food: "\u{1F354}",
  Transportation: "\u{1F697}",
  Entertainment: "\u{1F3AC}",
  Shopping: "\u{1F6CD}\uFE0F",
  Bills: "\u{1F4C4}",
  Other: "\u{1F4E6}",
};

interface MonthlyInsightsProps {
  expenses: Expense[];
  isLoaded: boolean;
}

export function MonthlyInsights({ expenses, isLoaded }: MonthlyInsightsProps) {
  const { monthLabel, chartData, topThree, totalSpent, budgetStreak } = useMemo(() => {
    const now = new Date();
    const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
    const label = format(now, "MMMM yyyy");

    // Filter to current month
    const monthly = expenses.filter((e) => e.date >= monthStart && e.date <= monthEnd);

    // Category totals
    const categoryTotals: Record<string, number> = {};
    for (const e of monthly) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }

    const total = monthly.reduce((sum, e) => sum + e.amount, 0);

    // Chart data sorted by value desc
    const chart = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top = chart.slice(0, 3);

    // Budget streak: consecutive days from today going back that have at least one expense
    const expenseDates = new Set(expenses.map((e) => e.date));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const day = format(subDays(now, i), "yyyy-MM-dd");
      if (expenseDates.has(day)) {
        streak++;
      } else {
        break;
      }
    }

    return {
      monthLabel: label,
      chartData: chart,
      topThree: top,
      totalSpent: total,
      budgetStreak: streak,
    };
  }, [expenses]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  const hasData = chartData.length > 0;

  return (
    <div className="space-y-6">
      {/* Month label */}
      <p className="text-sm text-gray-500 font-medium">{monthLabel}</p>

      {/* Donut Chart */}
      <Card>
        <CardContent className="pt-6">
          {hasData ? (
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={getCategoryDef(entry.name).color} />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any) => formatCurrency(Number(value))) as any}
                    contentStyle={{ borderRadius: "0.75rem", fontSize: "0.875rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-medium">Spending</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-gray-500">
              No expenses this month
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 3 Categories */}
      {topThree.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Top {topThree.length} Categories
          </h3>
          <div className="space-y-3">
            {topThree.map((cat) => {
              const def = getCategoryDef(cat.name);
              const emoji = CATEGORY_EMOJIS[cat.name] || "\u{1F4E6}";
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-1 h-10 rounded-full" style={{ backgroundColor: def.color }} />
                  <span className="text-xl">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(cat.value)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget Streak */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="py-6 text-center">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Budget Streak</h3>
          <p className="text-4xl font-bold text-emerald-500">{budgetStreak}</p>
          <p className="text-sm text-gray-500 mt-1">
            {budgetStreak === 1 ? "day" : "days"}!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
