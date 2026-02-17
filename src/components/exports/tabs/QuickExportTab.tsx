"use client";

import { Expense } from "@/types/expense";
import { useExportConfig } from "@/hooks/useExportConfig";
import { useExportHistory } from "@/hooks/useExportHistory";
import { CATEGORIES } from "@/lib/constants";
import { FORMAT_OPTIONS } from "@/lib/export-constants";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

interface QuickExportTabProps {
  expenses: Expense[];
}

export function QuickExportTab({ expenses }: QuickExportTabProps) {
  const config = useExportConfig(expenses);
  const { addEntry } = useExportHistory();

  const onExport = async () => {
    const start = Date.now();
    const success = await config.handleExport();
    const duration = Date.now() - start;

    if (success) {
      addEntry({
        format: config.format,
        destination: "download",
        filename: config.filename,
        recordCount: config.filteredExpenses.length,
        categories: config.selectedCategories,
        dateRange:
          config.dateFrom || config.dateTo
            ? { from: config.dateFrom, to: config.dateTo }
            : null,
        duration,
      });
      toast.success(
        `Exported ${config.filteredExpenses.length} expense(s) as ${config.format.toUpperCase()}`
      );
    } else {
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <div className="animate-float-up space-y-6">
      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => config.setFormat(opt.value)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                config.format === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="text-lg mb-1">
                {opt.value === "csv" ? "📊" : opt.value === "json" ? "{ }" : "📄"}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="From Date"
          type="date"
          value={config.dateFrom}
          onChange={(e) => config.setDateFrom(e.target.value)}
        />
        <Input
          label="To Date"
          type="date"
          value={config.dateTo}
          onChange={(e) => config.setDateTo(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="flex gap-2">
            <button
              onClick={config.selectAllCategories}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Select All
            </button>
            <button
              onClick={config.deselectAllCategories}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => config.toggleCategory(cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                config.selectedCategories.includes(cat.name)
                  ? `${cat.bgColor} ${cat.textColor} ring-1 ring-inset ring-current/20`
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filename */}
      <Input
        label="Filename"
        value={config.filename}
        onChange={(e) => config.setFilename(e.target.value)}
      />

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {config.filteredExpenses.length} record(s)
          </p>
          <p className="text-xs text-gray-500">
            Total: {formatCurrency(config.totalAmount)}
          </p>
        </div>
        <Button
          onClick={onExport}
          disabled={config.isExporting || config.filteredExpenses.length === 0}
        >
          {config.isExporting ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Exporting...
            </span>
          ) : (
            "Download"
          )}
        </Button>
      </div>

      {/* Preview */}
      {config.filteredExpenses.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-right px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2 hidden sm:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {config.previewExpenses.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-2 text-gray-600">{formatDate(e.date)}</td>
                    <td className="px-4 py-2 text-gray-600">{e.category}</td>
                    <td className="px-4 py-2 text-gray-900 text-right font-medium">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="px-4 py-2 text-gray-500 truncate max-w-[200px] hidden sm:table-cell">
                      {e.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {config.hasMore && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center">
                +{config.remainingCount} more record(s)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
