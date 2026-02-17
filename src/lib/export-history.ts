import { v4 as uuidv4 } from "uuid";
import {
  ExportHistoryEntry,
  ExportFormat,
  ExportDestination,
} from "@/types/export";
import { estimateFileSize } from "@/lib/export";
import { MAX_HISTORY_ENTRIES } from "@/lib/export-constants";

export function createHistoryEntry(params: {
  format: ExportFormat;
  destination: ExportDestination;
  filename: string;
  recordCount: number;
  categories: string[];
  dateRange: { from: string; to: string } | null;
  duration: number;
  status?: "completed" | "failed" | "pending";
}): ExportHistoryEntry {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    format: params.format,
    destination: params.destination,
    filename: params.filename,
    recordCount: params.recordCount,
    fileSize: estimateFileSize(params.recordCount, params.format),
    status: params.status || "completed",
    duration: params.duration,
    categories: params.categories,
    dateRange: params.dateRange,
  };
}

export function filterHistory(
  entries: ExportHistoryEntry[],
  filters: {
    format?: ExportFormat;
    destination?: ExportDestination;
    status?: "completed" | "failed" | "pending";
    search?: string;
  }
): ExportHistoryEntry[] {
  return entries.filter((entry) => {
    if (filters.format && entry.format !== filters.format) return false;
    if (filters.destination && entry.destination !== filters.destination) return false;
    if (filters.status && entry.status !== filters.status) return false;
    if (
      filters.search &&
      !entry.filename.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });
}

export function trimHistory(entries: ExportHistoryEntry[]): ExportHistoryEntry[] {
  if (entries.length > MAX_HISTORY_ENTRIES) {
    return entries.slice(0, MAX_HISTORY_ENTRIES);
  }
  return entries;
}
