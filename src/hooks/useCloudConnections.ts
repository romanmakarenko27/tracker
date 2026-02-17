"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { CloudConnection, CloudProvider } from "@/types/export";
import { CLOUD_CONNECTIONS_KEY, CLOUD_PROVIDERS } from "@/lib/export-constants";
import {
  simulateCloudConnect,
  simulateCloudDisconnect,
  simulateCloudSync,
  generateRandomStorageUsed,
} from "@/lib/export-simulation";

export function useCloudConnections() {
  const [connections, setConnections, isLoaded] = useLocalStorage<
    Record<CloudProvider, CloudConnection | null>
  >(CLOUD_CONNECTIONS_KEY, {
    dropbox: null,
    onedrive: null,
    "google-drive": null,
  });

  const connect = useCallback(
    async (provider: CloudProvider, email: string) => {
      await simulateCloudConnect();
      const meta = CLOUD_PROVIDERS[provider];
      const connection: CloudConnection = {
        provider,
        status: "connected",
        email,
        connectedAt: new Date().toISOString(),
        lastSyncAt: null,
        storageUsed: generateRandomStorageUsed(meta.storageTotal),
        storageTotal: meta.storageTotal,
      };
      setConnections((prev) => ({ ...prev, [provider]: connection }));
      return connection;
    },
    [setConnections]
  );

  const disconnect = useCallback(
    async (provider: CloudProvider) => {
      await simulateCloudDisconnect();
      setConnections((prev) => ({ ...prev, [provider]: null }));
    },
    [setConnections]
  );

  const sync = useCallback(
    async (provider: CloudProvider) => {
      setConnections((prev) => ({
        ...prev,
        [provider]: prev[provider]
          ? { ...prev[provider]!, status: "syncing" as const }
          : null,
      }));

      await simulateCloudSync();

      setConnections((prev) => ({
        ...prev,
        [provider]: prev[provider]
          ? {
              ...prev[provider]!,
              status: "connected" as const,
              lastSyncAt: new Date().toISOString(),
            }
          : null,
      }));
    },
    [setConnections]
  );

  const getConnection = useCallback(
    (provider: CloudProvider) => connections[provider],
    [connections]
  );

  return {
    connections,
    isLoaded,
    connect,
    disconnect,
    sync,
    getConnection,
  };
}
