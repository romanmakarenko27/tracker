"use client";

import { useState } from "react";
import { Expense } from "@/types/expense";
import { useSharedExports } from "@/hooks/useSharedExports";
import { useExportConfig } from "@/hooks/useExportConfig";
import { useExportHistory } from "@/hooks/useExportHistory";
import { getShareUrl } from "@/lib/export-sharing";
import { FORMAT_OPTIONS } from "@/lib/export-constants";
import { ShareLinkCard } from "../sharing/ShareLinkCard";
import { QRCodeDisplay } from "../sharing/QRCodeDisplay";
import { AnimatedProgress } from "../common/AnimatedProgress";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

interface SharingTabProps {
  expenses: Expense[];
}

export function SharingTab({ expenses }: SharingTabProps) {
  const config = useExportConfig(expenses);
  const { sharedExports, createShare, revokeShare, deleteShare } = useSharedExports();
  const { addEntry } = useExportHistory();
  const [isCreating, setIsCreating] = useState(false);
  const [qrModal, setQrModal] = useState<{ url: string; filename: string } | null>(null);

  const handleCreateShare = async () => {
    if (config.filteredExpenses.length === 0) {
      toast.error("No records to share");
      return;
    }

    setIsCreating(true);
    const start = Date.now();
    try {
      const share = await createShare({
        filename: `${config.filename}.${config.format}`,
        format: config.format,
        recordCount: config.filteredExpenses.length,
      });
      const duration = Date.now() - start;

      addEntry({
        format: config.format,
        destination: "download",
        filename: share.filename,
        recordCount: share.recordCount,
        categories: config.selectedCategories,
        dateRange: null,
        duration,
      });

      toast.success("Share link created");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = (id: string) => {
    revokeShare(id);
    toast.success("Link revoked");
  };

  const handleDelete = (id: string) => {
    deleteShare(id);
    toast.success("Link deleted");
  };

  return (
    <div className="animate-float-up space-y-6">
      {/* Create Share */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Create Share Link</h3>

        <div className="flex gap-3 mb-4">
          <Input
            value={config.filename}
            onChange={(e) => config.setFilename(e.target.value)}
            placeholder="Filename"
            className="flex-1"
          />
          <div className="flex gap-1">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => config.setFormat(opt.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  config.format === opt.value
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isCreating && (
          <div className="mb-4">
            <AnimatedProgress isActive={true} duration={1500} label="Generating link..." />
          </div>
        )}

        <Button
          onClick={handleCreateShare}
          disabled={isCreating || config.filteredExpenses.length === 0}
          className="w-full"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {isCreating ? "Creating..." : `Share ${config.filteredExpenses.length} Record(s)`}
          </span>
        </Button>
      </div>

      {/* Shared Links */}
      {sharedExports.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600">Shared Links</h4>
          {sharedExports.map((share) => (
            <ShareLinkCard
              key={share.id}
              share={share}
              onRevoke={() => handleRevoke(share.id)}
              onDelete={() => handleDelete(share.id)}
              onShowQR={() =>
                setQrModal({
                  url: getShareUrl(share.linkId),
                  filename: share.filename,
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm">No shared links yet</p>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal && (
        <QRCodeDisplay
          isOpen={true}
          onClose={() => setQrModal(null)}
          url={qrModal.url}
          filename={qrModal.filename}
        />
      )}
    </div>
  );
}
