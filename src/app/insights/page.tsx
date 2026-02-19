"use client";

import { Header } from "@/components/layout/Header";
import { MonthlyInsights } from "@/components/insights/MonthlyInsights";
import { useExpenses } from "@/hooks/useExpenses";

export default function InsightsPage() {
  const { expenses, isLoaded } = useExpenses();

  return (
    <div>
      <Header title="Monthly Insights" />
      <MonthlyInsights expenses={expenses} isLoaded={isLoaded} />
    </div>
  );
}
