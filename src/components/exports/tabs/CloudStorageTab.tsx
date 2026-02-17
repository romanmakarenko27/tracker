"use client";

import { useState } from "react";
import { CloudProvider } from "@/types/export";
import { Expense } from "@/types/expense";
import { useCloudConnections } from "@/hooks/useCloudConnections";
import { useExportHistory } from "@/hooks/useExportHistory";
import { useExportConfig } from "@/hooks/useExportConfig";
import { CloudProviderCard } from "../cloud/CloudProviderCard";
import { CloudConnectionFlow } from "../cloud/CloudConnectionFlow";
import toast from "react-hot-toast";

interface CloudStorageTabProps {
  expenses: Expense[];
}

const PROVIDERS: CloudProvider[] = ["dropbox", "onedrive", "google-drive"];

export function CloudStorageTab({ expenses }: CloudStorageTabProps) {
  const { connections, connect, disconnect, sync } = useCloudConnections();
  const { addEntry } = useExportHistory();
  const config = useExportConfig(expenses);
  const [connectingProvider, setConnectingProvider] = useState<CloudProvider | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<CloudProvider | null>(null);

  const handleConnect = async (provider: CloudProvider, email: string) => {
    await connect(provider, email);
    toast.success(`Connected to ${provider}`);
  };

  const handleDisconnect = async (provider: CloudProvider) => {
    setLoadingProvider(provider);
    try {
      await disconnect(provider);
      toast.success("Disconnected");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSync = async (provider: CloudProvider) => {
    setLoadingProvider(provider);
    const start = Date.now();
    try {
      await sync(provider);
      const duration = Date.now() - start;

      addEntry({
        format: config.format,
        destination: provider,
        filename: `${config.filename}.${config.format}`,
        recordCount: config.filteredExpenses.length,
        categories: config.selectedCategories,
        dateRange: null,
        duration,
      });

      toast.success("Synced to cloud");
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="animate-float-up space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-1">Cloud Storage</h3>
        <p className="text-xs text-gray-500">
          Connect your cloud storage accounts to export directly to the cloud.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROVIDERS.map((provider) => (
          <CloudProviderCard
            key={provider}
            provider={provider}
            connection={connections[provider]}
            onConnect={() => setConnectingProvider(provider)}
            onDisconnect={() => handleDisconnect(provider)}
            onSync={() => handleSync(provider)}
            isLoading={loadingProvider === provider}
          />
        ))}
      </div>

      <CloudConnectionFlow
        provider={connectingProvider}
        isOpen={connectingProvider !== null}
        onClose={() => setConnectingProvider(null)}
        onConnect={handleConnect}
      />
    </div>
  );
}
