"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SpendingByCategory } from "@/components/dashboard/SpendingByCategory";
import { SpendingOverTime } from "@/components/dashboard/SpendingOverTime";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { useExpenses } from "@/hooks/useExpenses";
import { calculateSummary } from "@/lib/analytics";
import { ExportModal } from "@/components/expenses/ExportModal";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { expenses, isLoaded } = useExpenses();
  const summary = useMemo(() => calculateSummary(expenses), [expenses]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div>
      <Header title="Dashboard">
        <Button
          variant="secondary"
          onClick={() => setIsExportModalOpen(true)}
          disabled={expenses.length === 0}
        >
          Export Data
        </Button>
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

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}
