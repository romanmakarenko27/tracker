"use client";

import { useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SpendingByCategory } from "@/components/dashboard/SpendingByCategory";
import { SpendingOverTime } from "@/components/dashboard/SpendingOverTime";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { useExpenses } from "@/hooks/useExpenses";
import { calculateSummary } from "@/lib/analytics";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { expenses, isLoaded } = useExpenses();
  const summary = useMemo(() => calculateSummary(expenses), [expenses]);

  return (
    <div>
      <Header title="Dashboard">
        <Link href="/exports">
          <Button variant="secondary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Export Hub
            </span>
          </Button>
        </Link>
        <Link href="/expenses/new">
          <Button>Add Expense</Button>
        </Link>
      </Header>

      <SummaryCards summary={summary} isLoaded={isLoaded} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SpendingByCategory categoryTotals={summary.categoryTotals} />
        <SpendingOverTime dailyTotals={summary.dailyTotals} />
      </div>

      <RecentExpenses expenses={expenses} />
    </div>
  );
}
