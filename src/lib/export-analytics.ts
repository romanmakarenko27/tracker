import { format, parseISO, differenceInDays } from "date-fns";
import {
  ExportHistoryEntry,
  ExportAnalytics,
  ExportFormat,
  ExportDestination,
} from "@/types/export";

export function deriveAnalytics(history: ExportHistoryEntry[]): ExportAnalytics {
  const completed = history.filter((h) => h.status === "completed");

  const totalExports = completed.length;
  const totalRecordsExported = completed.reduce((sum, h) => sum + h.recordCount, 0);
  const totalDataExported = completed.reduce((sum, h) => sum + h.fileSize, 0);

  // Favorite format
  const formatCounts: Record<string, number> = {};
  for (const h of completed) {
    formatCounts[h.format] = (formatCounts[h.format] || 0) + 1;
  }
  const favoriteFormat = (Object.entries(formatCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] as ExportFormat) || null;

  // Favorite destination
  const destCounts: Record<string, number> = {};
  for (const h of completed) {
    destCounts[h.destination] = (destCounts[h.destination] || 0) + 1;
  }
  const favoriteDestination = (Object.entries(destCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] as ExportDestination) || null;

  // Exports by format
  const exportsByFormat: Record<ExportFormat, number> = { csv: 0, json: 0, pdf: 0 };
  for (const h of completed) {
    exportsByFormat[h.format]++;
  }

  // Exports by month (last 6 months)
  const monthCounts: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = format(d, "MMM yyyy");
    monthCounts[key] = 0;
  }
  for (const h of completed) {
    const key = format(parseISO(h.timestamp), "MMM yyyy");
    if (monthCounts[key] !== undefined) {
      monthCounts[key]++;
    }
  }
  const exportsByMonth = Object.entries(monthCounts).map(([month, count]) => ({
    month,
    count,
  }));

  // Export streak
  const exportStreak = calculateExportStreak(completed);

  // Average records per export
  const averageRecordsPerExport =
    totalExports > 0 ? Math.round(totalRecordsExported / totalExports) : 0;

  const lastExportAt =
    completed.length > 0
      ? completed.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0].timestamp
      : null;

  return {
    totalExports,
    totalRecordsExported,
    favoriteFormat,
    favoriteDestination,
    exportsByFormat,
    exportsByDestination: destCounts,
    exportsByMonth,
    averageRecordsPerExport,
    totalDataExported,
    exportStreak,
    lastExportAt,
  };
}

function calculateExportStreak(entries: ExportHistoryEntry[]): number {
  if (entries.length === 0) return 0;

  const dates = Array.from(new Set(
    entries.map((e) => format(parseISO(e.timestamp), "yyyy-MM-dd"))
  )).sort().reverse();

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = differenceInDays(parseISO(dates[i]), parseISO(dates[i + 1]));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
