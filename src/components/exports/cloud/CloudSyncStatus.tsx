"use client";

import { CloudConnection } from "@/types/export";

interface CloudSyncStatusProps {
  connection: CloudConnection;
}

export function CloudSyncStatus({ connection }: CloudSyncStatusProps) {
  const statusColors: Record<string, string> = {
    connected: "text-green-600",
    syncing: "text-yellow-600",
    error: "text-red-600",
    disconnected: "text-gray-400",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${statusColors[connection.status] || "text-gray-400"}`}>
        {connection.status === "syncing" ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
          </svg>
        )}
      </div>
      <span className="text-xs text-gray-500 capitalize">{connection.status}</span>
    </div>
  );
}
