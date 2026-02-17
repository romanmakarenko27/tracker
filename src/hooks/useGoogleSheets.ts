"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { GoogleSheetsConnection } from "@/types/export";
import { GOOGLE_SHEETS_KEY } from "@/lib/export-constants";
import { simulateCloudConnect, simulateGoogleSheetsSync } from "@/lib/export-simulation";

const DEFAULT_STATE: GoogleSheetsConnection = {
  connected: false,
  email: "",
  sheetId: null,
  sheetName: "Expense Tracker Export",
  lastSyncAt: null,
  autoSync: false,
  rowCount: 0,
};

export function useGoogleSheets() {
  const [sheets, setSheets, isLoaded] = useLocalStorage<GoogleSheetsConnection>(
    GOOGLE_SHEETS_KEY,
    DEFAULT_STATE
  );

  const connect = useCallback(
    async (email: string) => {
      await simulateCloudConnect();
      setSheets((prev) => ({
        ...prev,
        connected: true,
        email,
      }));
    },
    [setSheets]
  );

  const disconnect = useCallback(async () => {
    setSheets(DEFAULT_STATE);
  }, [setSheets]);

  const createSheet = useCallback(
    async (name: string) => {
      await simulateCloudConnect();
      const sheetId = `sheet_${Date.now()}`;
      setSheets((prev) => ({
        ...prev,
        sheetId,
        sheetName: name,
      }));
      return sheetId;
    },
    [setSheets]
  );

  const syncToSheet = useCallback(
    async (recordCount: number) => {
      await simulateGoogleSheetsSync();
      setSheets((prev) => ({
        ...prev,
        lastSyncAt: new Date().toISOString(),
        rowCount: recordCount,
      }));
    },
    [setSheets]
  );

  const toggleAutoSync = useCallback(() => {
    setSheets((prev) => ({ ...prev, autoSync: !prev.autoSync }));
  }, [setSheets]);

  return {
    sheets,
    isLoaded,
    connect,
    disconnect,
    createSheet,
    syncToSheet,
    toggleAutoSync,
  };
}
