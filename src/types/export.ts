export type ExportFormat = "csv" | "json" | "pdf";

export type CloudProvider = "dropbox" | "onedrive" | "google-drive";

export type ConnectionStatus = "connected" | "disconnected" | "syncing" | "error";

export type ScheduleFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export type ExportDestination =
  | "download"
  | "email"
  | "dropbox"
  | "onedrive"
  | "google-drive"
  | "google-sheets";

export interface CloudConnection {
  provider: CloudProvider;
  status: ConnectionStatus;
  email: string;
  connectedAt: string;
  lastSyncAt: string | null;
  storageUsed: number; // MB
  storageTotal: number; // MB
}

export interface ExportHistoryEntry {
  id: string;
  timestamp: string;
  format: ExportFormat;
  destination: ExportDestination;
  filename: string;
  recordCount: number;
  fileSize: number; // bytes
  status: "completed" | "failed" | "pending";
  duration: number; // ms
  categories: string[];
  dateRange: { from: string; to: string } | null;
}

export interface ExportSchedule {
  id: string;
  name: string;
  frequency: ScheduleFrequency;
  format: ExportFormat;
  destination: ExportDestination;
  categories: string[];
  enabled: boolean;
  createdAt: string;
  lastRunAt: string | null;
  nextRunAt: string;
  email?: string;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  format: ExportFormat;
  categories: string[];
  dateRangeType: "all" | "last-30" | "last-90" | "last-365" | "ytd" | "custom";
  sortBy: "date" | "amount" | "category";
  sortOrder: "asc" | "desc";
  includeCharts: boolean;
  color: string;
}

export interface SharedExport {
  id: string;
  linkId: string;
  filename: string;
  format: ExportFormat;
  recordCount: number;
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "viewer" | "editor" | "admin";
  avatarColor: string;
}

export interface ExportAnalytics {
  totalExports: number;
  totalRecordsExported: number;
  favoriteFormat: ExportFormat | null;
  favoriteDestination: ExportDestination | null;
  exportsByFormat: Record<ExportFormat, number>;
  exportsByDestination: Record<string, number>;
  exportsByMonth: { month: string; count: number }[];
  averageRecordsPerExport: number;
  totalDataExported: number; // bytes
  exportStreak: number; // consecutive days with exports
  lastExportAt: string | null;
}

export interface ExportSuggestion {
  id: string;
  type: "schedule" | "format" | "backup" | "share" | "template";
  title: string;
  description: string;
  icon: string;
  priority: "low" | "medium" | "high";
  actionLabel: string;
}

export interface GoogleSheetsConnection {
  connected: boolean;
  email: string;
  sheetId: string | null;
  sheetName: string;
  lastSyncAt: string | null;
  autoSync: boolean;
  rowCount: number;
}

export type ExportTabId =
  | "quick-export"
  | "email"
  | "cloud-storage"
  | "google-sheets"
  | "schedules"
  | "templates"
  | "history"
  | "sharing"
  | "analytics";
