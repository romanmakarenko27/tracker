"use client";

import { useState } from "react";
import { Expense } from "@/types/expense";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { useExportHistory } from "@/hooks/useExportHistory";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ExportStatusBadge } from "../common/ExportStatusBadge";
import { AnimatedProgress } from "../common/AnimatedProgress";
import toast from "react-hot-toast";

interface GoogleSheetsTabProps {
  expenses: Expense[];
}

export function GoogleSheetsTab({ expenses }: GoogleSheetsTabProps) {
  const { sheets, connect, disconnect, createSheet, syncToSheet, toggleAutoSync } =
    useGoogleSheets();
  const { addEntry } = useExportHistory();
  const [email, setEmail] = useState("");
  const [sheetName, setSheetName] = useState("Expense Tracker Export");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleConnect = async () => {
    if (!email.trim()) return;
    setIsConnecting(true);
    try {
      await connect(email.trim());
      toast.success("Connected to Google Sheets");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateSheet = async () => {
    if (!sheetName.trim()) return;
    setIsCreating(true);
    try {
      await createSheet(sheetName.trim());
      toast.success(`Sheet "${sheetName}" created`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const start = Date.now();
    try {
      await syncToSheet(expenses.length);
      const duration = Date.now() - start;

      addEntry({
        format: "csv",
        destination: "google-sheets",
        filename: sheets.sheetName,
        recordCount: expenses.length,
        categories: [],
        dateRange: null,
        duration,
      });

      toast.success(`Synced ${expenses.length} records to Google Sheets`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Not connected
  if (!sheets.connected) {
    return (
      <div className="animate-float-up">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Google Sheets</h3>
          <p className="text-sm text-gray-500 mb-6">
            Connect to sync your expenses directly to a Google Sheet
          </p>

          <div className="max-w-sm mx-auto space-y-4">
            <Input
              label="Google Account Email"
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />

            {isConnecting && (
              <AnimatedProgress isActive={true} duration={2000} label="Connecting..." />
            )}

            <Button
              onClick={handleConnect}
              disabled={!email.trim() || isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Google Account"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Connected
  return (
    <div className="animate-float-up space-y-6">
      {/* Connection Info */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-700 font-bold text-sm">GS</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Google Sheets</h3>
              <p className="text-xs text-gray-500">{sheets.email}</p>
            </div>
          </div>
          <ExportStatusBadge status="connected" />
        </div>
        <Button size="sm" variant="ghost" onClick={disconnect}>
          Disconnect
        </Button>
      </div>

      {/* Sheet Management */}
      {!sheets.sheetId ? (
        <div className="bg-gray-50 rounded-xl p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Create a Sheet</h4>
          <div className="flex gap-3">
            <Input
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Sheet name"
              className="flex-1"
            />
            <Button onClick={handleCreateSheet} disabled={isCreating || !sheetName.trim()}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{sheets.sheetName}</h4>
              <p className="text-xs text-gray-500">
                {sheets.rowCount} rows &middot;{" "}
                {sheets.lastSyncAt
                  ? `Last sync: ${new Date(sheets.lastSyncAt).toLocaleString()}`
                  : "Never synced"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sheets.autoSync}
                  onChange={toggleAutoSync}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Auto-sync
              </label>
            </div>
          </div>

          {isSyncing && (
            <AnimatedProgress isActive={true} duration={2500} label="Syncing to sheet..." />
          )}

          <Button
            onClick={handleSync}
            disabled={isSyncing || expenses.length === 0}
            className="w-full"
          >
            {isSyncing ? "Syncing..." : `Sync ${expenses.length} Records`}
          </Button>
        </div>
      )}
    </div>
  );
}
