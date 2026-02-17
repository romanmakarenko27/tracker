"use client";

import { SharedExport } from "@/types/export";
import { getShareUrl } from "@/lib/export-sharing";
import { Button } from "@/components/ui/Button";
import { ExportStatusBadge } from "../common/ExportStatusBadge";
import toast from "react-hot-toast";

interface ShareLinkCardProps {
  share: SharedExport;
  onRevoke: () => void;
  onDelete: () => void;
  onShowQR: () => void;
}

export function ShareLinkCard({ share, onRevoke, onDelete, onShowQR }: ShareLinkCardProps) {
  const url = getShareUrl(share.linkId);
  const isExpired = new Date(share.expiresAt) < new Date();
  const isActive = share.isActive && !isExpired;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-float-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{share.filename}</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {share.format.toUpperCase()} &middot; {share.recordCount} records
          </p>
        </div>
        <ExportStatusBadge status={isActive ? "connected" : "disconnected"} />
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
        <button
          onClick={copyLink}
          className="text-primary-600 hover:text-primary-700 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>{share.accessCount} view(s)</span>
        <span>
          {isExpired
            ? "Expired"
            : `Expires ${new Date(share.expiresAt).toLocaleDateString()}`}
        </span>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onShowQR}>
          QR Code
        </Button>
        {isActive && (
          <Button size="sm" variant="ghost" onClick={onRevoke} className="text-amber-600">
            Revoke
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-500">
          Delete
        </Button>
      </div>
    </div>
  );
}
