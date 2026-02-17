"use client";

import { CloudConnection, CloudProvider } from "@/types/export";
import { CLOUD_PROVIDERS } from "@/lib/export-constants";
import { CloudIcon } from "../common/CloudIcon";
import { ExportStatusBadge } from "../common/ExportStatusBadge";
import { Button } from "@/components/ui/Button";

interface CloudProviderCardProps {
  provider: CloudProvider;
  connection: CloudConnection | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  isLoading: boolean;
}

export function CloudProviderCard({
  provider,
  connection,
  onConnect,
  onDisconnect,
  onSync,
  isLoading,
}: CloudProviderCardProps) {
  const meta = CLOUD_PROVIDERS[provider];
  const isConnected = connection?.status === "connected" || connection?.status === "syncing";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <CloudIcon provider={provider} />
          <div>
            <h3 className="font-medium text-gray-900">{meta.name}</h3>
            {connection && (
              <p className="text-xs text-gray-500">{connection.email}</p>
            )}
          </div>
        </div>
        <ExportStatusBadge status={connection?.status || "disconnected"} />
      </div>

      {isConnected && connection && (
        <div className="mb-4">
          <CloudStorageMeter
            used={connection.storageUsed}
            total={connection.storageTotal}
          />
          {connection.lastSyncAt && (
            <p className="text-xs text-gray-400 mt-2">
              Last sync: {new Date(connection.lastSyncAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {isConnected ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={onSync}
              disabled={isLoading || connection?.status === "syncing"}
            >
              {connection?.status === "syncing" ? "Syncing..." : "Sync Now"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDisconnect}
              disabled={isLoading}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={onConnect} disabled={isLoading}>
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        )}
      </div>
    </div>
  );
}

function CloudStorageMeter({ used, total }: { used: number; total: number }) {
  const percentage = Math.min((used / total) * 100, 100);
  const usedLabel = used >= 1024 ? `${(used / 1024).toFixed(1)} GB` : `${used} MB`;
  const totalLabel = total >= 1024 ? `${(total / 1024).toFixed(0)} GB` : `${total} MB`;

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{usedLabel} used</span>
        <span>{totalLabel} total</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-amber-500" : "bg-primary-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
