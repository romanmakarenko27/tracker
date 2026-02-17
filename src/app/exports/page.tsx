"use client";

import { useExpenses } from "@/hooks/useExpenses";
import { ExportHub } from "@/components/exports/ExportHub";

export default function ExportsPage() {
  const { expenses } = useExpenses();

  return <ExportHub expenses={expenses} />;
}
