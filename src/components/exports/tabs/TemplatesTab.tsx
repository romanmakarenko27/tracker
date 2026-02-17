"use client";

import { Expense } from "@/types/expense";
import { useExportHistory } from "@/hooks/useExportHistory";
import { EXPORT_TEMPLATES, getTemplateDateRange } from "@/lib/export-templates";
import { filterExpenses, executeExport } from "@/lib/export";
import { CATEGORY_NAMES } from "@/lib/constants";
import { ExportTemplate } from "@/types/export";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface TemplatesTabProps {
  expenses: Expense[];
}

const templateIcons: Record<string, JSX.Element> = {
  receipt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  globe: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function TemplatesTab({ expenses }: TemplatesTabProps) {
  const { addEntry } = useExportHistory();

  const handleUseTemplate = async (template: ExportTemplate) => {
    const dateRange = getTemplateDateRange(template.dateRangeType);
    const filtered = filterExpenses(
      expenses,
      dateRange.from,
      dateRange.to,
      template.categories.length > 0 ? template.categories : CATEGORY_NAMES
    );

    if (filtered.length === 0) {
      toast.error("No records match this template's criteria");
      return;
    }

    const filename = `${template.id}-${new Date().toISOString().slice(0, 10)}`;
    const start = Date.now();

    try {
      await executeExport({
        expenses,
        format: template.format,
        filename,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
        categories: template.categories,
      });

      const duration = Date.now() - start;

      addEntry({
        format: template.format,
        destination: "download",
        filename: `${filename}.${template.format}`,
        recordCount: filtered.length,
        categories: template.categories,
        dateRange: dateRange.from ? dateRange : null,
        duration,
      });

      toast.success(`"${template.name}" exported (${filtered.length} records)`);
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="animate-float-up space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700">Export Templates</h3>
        <p className="text-xs text-gray-500">
          Pre-configured templates for common export scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`${template.color} px-5 py-4`}>
              <div className="text-white">
                {templateIcons[template.icon] || templateIcons.receipt}
              </div>
              <h4 className="text-white font-semibold mt-2">{template.name}</h4>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {template.format.toUpperCase()} &middot;{" "}
                  {template.dateRangeType === "all"
                    ? "All time"
                    : template.dateRangeType === "ytd"
                    ? "Year to date"
                    : template.dateRangeType.replace("last-", "Last ") + " days"}
                </span>
                <Button size="sm" onClick={() => handleUseTemplate(template)}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
