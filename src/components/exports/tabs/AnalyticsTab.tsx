"use client";

import { useExportHistory } from "@/hooks/useExportHistory";
import { useExportAnalytics } from "@/hooks/useExportAnalytics";
import { formatBytes } from "@/lib/export-analytics";
import { ExportSuggestion, ExportTabId } from "@/types/export";
import { SuggestionCard } from "../common/SuggestionCard";
import { Card, CardContent } from "@/components/ui/Card";

interface AnalyticsTabProps {
  onNavigate: (tab: ExportTabId) => void;
}

export function AnalyticsTab({ onNavigate }: AnalyticsTabProps) {
  const { history } = useExportHistory();
  const { analytics, suggestions } = useExportAnalytics(history);

  const handleSuggestionAction = (suggestion: ExportSuggestion) => {
    switch (suggestion.type) {
      case "schedule":
        onNavigate("schedules");
        break;
      case "format":
        onNavigate("quick-export");
        break;
      case "backup":
        onNavigate("cloud-storage");
        break;
      case "share":
        onNavigate("sharing");
        break;
      case "template":
        onNavigate("templates");
        break;
    }
  };

  return (
    <div className="animate-float-up space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Exports" value={analytics.totalExports.toString()} />
        <StatCard label="Records Exported" value={analytics.totalRecordsExported.toString()} />
        <StatCard label="Data Exported" value={formatBytes(analytics.totalDataExported)} />
        <StatCard
          label="Export Streak"
          value={`${analytics.exportStreak} day${analytics.exportStreak !== 1 ? "s" : ""}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format Distribution */}
        <Card>
          <CardContent>
            <h4 className="text-sm font-medium text-gray-700 mb-4">By Format</h4>
            <div className="space-y-3">
              {(["csv", "json", "pdf"] as const).map((format) => {
                const count = analytics.exportsByFormat[format] || 0;
                const max = Math.max(...Object.values(analytics.exportsByFormat), 1);
                return (
                  <div key={format} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 w-10 uppercase">
                      {format}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardContent>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Monthly Trend</h4>
            <div className="flex items-end gap-2 h-32">
              {analytics.exportsByMonth.map((m) => {
                const max = Math.max(
                  ...analytics.exportsByMonth.map((x) => x.count),
                  1
                );
                const height = (m.count / max) * 100;
                return (
                  <div
                    key={m.month}
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <span className="text-xs text-gray-500 mb-1">{m.count}</span>
                    <div
                      className="w-full bg-primary-400 rounded-t-md transition-all duration-500 min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <span className="text-[10px] text-gray-400 mt-1 truncate w-full text-center">
                      {m.month.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Favorite Format</p>
          <p className="text-lg font-semibold text-gray-900">
            {analytics.favoriteFormat?.toUpperCase() || "---"}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Avg Records / Export</p>
          <p className="text-lg font-semibold text-gray-900">
            {analytics.averageRecordsPerExport || "---"}
          </p>
        </div>
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Smart Suggestions</h4>
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAction={handleSuggestionAction}
            />
          ))}
        </div>
      )}

      {analytics.totalExports === 0 && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No analytics yet</p>
          <p className="text-xs mt-1">Export some data to see insights</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
