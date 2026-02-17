"use client";

import { useMemo } from "react";
import { ExportHistoryEntry } from "@/types/export";
import { deriveAnalytics } from "@/lib/export-analytics";
import { generateSuggestions } from "@/lib/export-suggestions";

export function useExportAnalytics(history: ExportHistoryEntry[]) {
  const analytics = useMemo(() => deriveAnalytics(history), [history]);
  const suggestions = useMemo(() => generateSuggestions(analytics), [analytics]);

  return { analytics, suggestions };
}
