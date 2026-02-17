"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Expense } from "@/types/expense";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ExportFormat } from "@/lib/export";
import { useExportConfig } from "@/hooks/useExportConfig";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
  { value: "pdf", label: "PDF" },
];

const FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  csv: ".csv",
  json: ".json",
  pdf: ".pdf",
};

export function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const config = useExportConfig(expenses);

  useEffect(() => {
    if (isOpen) {
      config.resetConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onExport = async () => {
    const success = await config.handleExport();
    if (success) {
      toast.success(`Exported ${config.filteredExpenses.length} expense(s) as ${config.format.toUpperCase()}`);
      onClose();
    } else {
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Export Expenses</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose format, filters, and download your data
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[60vh] space-y-5 pr-1">
          {/* Format selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => config.setFormat(opt.value)}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    config.format === opt.value
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="From"
                value={config.dateFrom}
                onChange={(e) => config.setDateFrom(e.target.value)}
              />
              <Input
                type="date"
                label="To"
                value={config.dateTo}
                onChange={(e) => config.setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Category checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Categories</label>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={config.selectAllCategories}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={config.deselectAllCategories}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.name}
                  className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={config.selectedCategories.includes(cat.name)}
                    onChange={() => config.toggleCategory(cat.name)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
            <div className="flex items-center gap-0">
              <input
                type="text"
                value={config.filename}
                onChange={(e) => config.setFilename(e.target.value)}
                className="block w-full rounded-l-lg border border-r-0 border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {FORMAT_EXTENSIONS[config.format]}
              </span>
            </div>
          </div>

          {/* Summary bar */}
          <div
            className={`rounded-lg p-3 text-sm ${
              config.filteredExpenses.length === 0
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            {config.filteredExpenses.length === 0 ? (
              <span className="font-medium">No records match your filters</span>
            ) : (
              <span>
                <span className="font-medium">{config.filteredExpenses.length}</span> record(s)
                {" \u00B7 "}
                Total: <span className="font-medium">{formatCurrency(config.totalAmount)}</span>
              </span>
            )}
          </div>

          {/* Preview table */}
          {config.previewExpenses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {config.previewExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-3 py-2">
                          <Badge category={expense.category} />
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900 whitespace-nowrap">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-3 py-2 text-gray-600 truncate max-w-[150px] hidden sm:table-cell">
                          {expense.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {config.hasMore && (
                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                    and {config.remainingCount} more...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onExport}
            disabled={config.filteredExpenses.length === 0 || config.isExporting}
          >
            {config.isExporting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Exporting...
              </span>
            ) : (
              `Export ${config.format.toUpperCase()}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
