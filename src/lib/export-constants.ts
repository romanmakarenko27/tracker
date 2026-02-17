import { CloudProvider, ExportTabId, ScheduleFrequency } from "@/types/export";

// Storage keys
export const EXPORT_HISTORY_KEY = "export-hub-history";
export const CLOUD_CONNECTIONS_KEY = "export-hub-cloud-connections";
export const EXPORT_SCHEDULES_KEY = "export-hub-schedules";
export const SHARED_EXPORTS_KEY = "export-hub-shared-exports";
export const GOOGLE_SHEETS_KEY = "export-hub-google-sheets";

export const MAX_HISTORY_ENTRIES = 200;

// Cloud provider metadata
export const CLOUD_PROVIDERS: Record<
  CloudProvider,
  { name: string; color: string; bgColor: string; storageTotal: number }
> = {
  dropbox: {
    name: "Dropbox",
    color: "#0061FF",
    bgColor: "bg-blue-50",
    storageTotal: 2048, // 2GB
  },
  onedrive: {
    name: "OneDrive",
    color: "#0078D4",
    bgColor: "bg-sky-50",
    storageTotal: 5120, // 5GB
  },
  "google-drive": {
    name: "Google Drive",
    color: "#4285F4",
    bgColor: "bg-indigo-50",
    storageTotal: 15360, // 15GB
  },
};

// Schedule frequency options
export const SCHEDULE_FREQUENCIES: {
  value: ScheduleFrequency;
  label: string;
  description: string;
}[] = [
  { value: "daily", label: "Daily", description: "Every day at midnight" },
  { value: "weekly", label: "Weekly", description: "Every Monday at 9:00 AM" },
  { value: "biweekly", label: "Bi-weekly", description: "Every other Monday at 9:00 AM" },
  { value: "monthly", label: "Monthly", description: "First of every month at 9:00 AM" },
];

// Tab definitions
export const EXPORT_TABS: { id: ExportTabId; label: string; icon: string }[] = [
  { id: "quick-export", label: "Quick Export", icon: "download" },
  { id: "email", label: "Email", icon: "email" },
  { id: "cloud-storage", label: "Cloud Storage", icon: "cloud" },
  { id: "google-sheets", label: "Google Sheets", icon: "sheets" },
  { id: "schedules", label: "Schedules", icon: "clock" },
  { id: "templates", label: "Templates", icon: "template" },
  { id: "history", label: "History", icon: "history" },
  { id: "sharing", label: "Sharing", icon: "share" },
  { id: "analytics", label: "Analytics", icon: "chart" },
];

// Format metadata
export const FORMAT_OPTIONS: { value: "csv" | "json" | "pdf"; label: string; extension: string }[] = [
  { value: "csv", label: "CSV", extension: ".csv" },
  { value: "json", label: "JSON", extension: ".json" },
  { value: "pdf", label: "PDF", extension: ".pdf" },
];
