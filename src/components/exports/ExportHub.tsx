"use client";

import { Expense } from "@/types/expense";
import { useExportHub } from "@/hooks/useExportHub";
import { ExportHubTabs } from "./ExportHubTabs";
import { QuickExportTab } from "./tabs/QuickExportTab";
import { EmailExportTab } from "./tabs/EmailExportTab";
import { CloudStorageTab } from "./tabs/CloudStorageTab";
import { GoogleSheetsTab } from "./tabs/GoogleSheetsTab";
import { SchedulesTab } from "./tabs/SchedulesTab";
import { TemplatesTab } from "./tabs/TemplatesTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { SharingTab } from "./tabs/SharingTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";

interface ExportHubProps {
  expenses: Expense[];
}

export function ExportHub({ expenses }: ExportHubProps) {
  const { activeTab, setActiveTab } = useExportHub();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "quick-export":
        return <QuickExportTab expenses={expenses} />;
      case "email":
        return <EmailExportTab expenses={expenses} />;
      case "cloud-storage":
        return <CloudStorageTab expenses={expenses} />;
      case "google-sheets":
        return <GoogleSheetsTab expenses={expenses} />;
      case "schedules":
        return <SchedulesTab />;
      case "templates":
        return <TemplatesTab expenses={expenses} />;
      case "history":
        return <HistoryTab />;
      case "sharing":
        return <SharingTab expenses={expenses} />;
      case "analytics":
        return <AnalyticsTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Export Hub</h1>
            <p className="text-white/80 text-sm">
              Export, sync, and share your expense data
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <ExportHubTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Active Tab Content */}
      <div key={activeTab}>{renderActiveTab()}</div>
    </div>
  );
}
