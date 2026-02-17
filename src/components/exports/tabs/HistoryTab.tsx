"use client";

import { useState, useMemo } from "react";
import { useExportHistory } from "@/hooks/useExportHistory";
import { filterHistory } from "@/lib/export-history";
import { formatBytes } from "@/lib/export-analytics";
import { ExportFormat, ExportDestination } from "@/types/export";
import { ExportStatusBadge } from "../common/ExportStatusBadge";
import { DestinationIcon } from "../common/DestinationIcon";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export function HistoryTab() {
  const { history, clearHistory, removeEntry } = useExportHistory();
  const [formatFilter, setFormatFilter] = useState<string>("");
  const [destFilter, setDestFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      filterHistory(history, {
        format: formatFilter ? (formatFilter as ExportFormat) : undefined,
        destination: destFilter ? (destFilter as ExportDestination) : undefined,
        search: search || undefined,
      }),
    [history, formatFilter, destFilter, search]
  );

  const handleClear = () => {
    clearHistory();
    toast.success("History cleared");
  };

  return (
    <div className="animate-float-up space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Export History</h3>
          <p className="text-xs text-gray-500">
            {history.length} total export(s)
          </p>
        </div>
        {history.length > 0 && (
          <Button size="sm" variant="ghost" onClick={handleClear} className="text-red-500">
            Clear All
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="w-32">
          <Select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            options={[
              { value: "", label: "All Formats" },
              { value: "csv", label: "CSV" },
              { value: "json", label: "JSON" },
              { value: "pdf", label: "PDF" },
            ]}
          />
        </div>
        <div className="w-40">
          <Select
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            options={[
              { value: "", label: "All Destinations" },
              { value: "download", label: "Download" },
              { value: "email", label: "Email" },
              { value: "dropbox", label: "Dropbox" },
              { value: "onedrive", label: "OneDrive" },
              { value: "google-drive", label: "Google Drive" },
              { value: "google-sheets", label: "Google Sheets" },
            ]}
          />
        </div>
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
      </div>

      {/* History Table */}
      {filtered.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">File</th>
                <th className="text-left px-4 py-2.5 hidden sm:table-cell">Destination</th>
                <th className="text-left px-4 py-2.5 hidden md:table-cell">Size</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="text-left px-4 py-2.5 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-xs truncate max-w-[200px]">
                        {entry.filename}
                      </p>
                      <p className="text-xs text-gray-400">
                        {entry.format.toUpperCase()} &middot; {entry.recordCount} records
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <DestinationIcon destination={entry.destination} className="w-3.5 h-3.5" />
                      <span className="text-xs capitalize">
                        {entry.destination.replace("-", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                    {formatBytes(entry.fileSize)}
                  </td>
                  <td className="px-4 py-3">
                    <ExportStatusBadge status={entry.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">
            {history.length === 0 ? "No export history yet" : "No matching records"}
          </p>
        </div>
      )}
    </div>
  );
}
