"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { SharedExport, ExportFormat } from "@/types/export";
import { SHARED_EXPORTS_KEY } from "@/lib/export-constants";
import { createShareLink } from "@/lib/export-sharing";
import { simulateShareLinkGeneration } from "@/lib/export-simulation";

export function useSharedExports() {
  const [sharedExports, setSharedExports, isLoaded] = useLocalStorage<SharedExport[]>(
    SHARED_EXPORTS_KEY,
    []
  );

  const createShare = useCallback(
    async (params: {
      filename: string;
      format: ExportFormat;
      recordCount: number;
      expiresInDays?: number;
    }) => {
      await simulateShareLinkGeneration();
      const share = createShareLink(params);
      setSharedExports((prev) => [share, ...prev]);
      return share;
    },
    [setSharedExports]
  );

  const revokeShare = useCallback(
    (id: string) => {
      setSharedExports((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: false } : s))
      );
    },
    [setSharedExports]
  );

  const deleteShare = useCallback(
    (id: string) => {
      setSharedExports((prev) => prev.filter((s) => s.id !== id));
    },
    [setSharedExports]
  );

  return {
    sharedExports,
    isLoaded,
    createShare,
    revokeShare,
    deleteShare,
  };
}
