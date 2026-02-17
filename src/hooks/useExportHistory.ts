"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ExportHistoryEntry, ExportFormat, ExportDestination } from "@/types/export";
import { EXPORT_HISTORY_KEY } from "@/lib/export-constants";
import { createHistoryEntry, trimHistory } from "@/lib/export-history";

export function useExportHistory() {
  const [history, setHistory, isLoaded] = useLocalStorage<ExportHistoryEntry[]>(
    EXPORT_HISTORY_KEY,
    []
  );

  const addEntry = useCallback(
    (params: {
      format: ExportFormat;
      destination: ExportDestination;
      filename: string;
      recordCount: number;
      categories: string[];
      dateRange: { from: string; to: string } | null;
      duration: number;
      status?: "completed" | "failed" | "pending";
    }) => {
      const entry = createHistoryEntry(params);
      setHistory((prev) => trimHistory([entry, ...prev]));
      return entry;
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeEntry = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((e) => e.id !== id));
    },
    [setHistory]
  );

  return {
    history,
    isLoaded,
    addEntry,
    clearHistory,
    removeEntry,
  };
}
