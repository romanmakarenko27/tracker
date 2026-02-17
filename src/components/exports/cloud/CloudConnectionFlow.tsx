"use client";

import { useState } from "react";
import { CloudProvider } from "@/types/export";
import { CLOUD_PROVIDERS } from "@/lib/export-constants";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CloudIcon } from "../common/CloudIcon";

interface CloudConnectionFlowProps {
  provider: CloudProvider | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (provider: CloudProvider, email: string) => Promise<void>;
}

export function CloudConnectionFlow({
  provider,
  isOpen,
  onClose,
  onConnect,
}: CloudConnectionFlowProps) {
  const [email, setEmail] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!provider) return null;
  const meta = CLOUD_PROVIDERS[provider];

  const handleConnect = async () => {
    if (!email.trim()) return;
    setIsConnecting(true);
    try {
      await onConnect(provider, email.trim());
      setEmail("");
      onClose();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <CloudIcon provider={provider} size="lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Connect to {meta.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email to simulate connecting to {meta.name}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConnect()}
        />

        {isConnecting && (
          <div className="flex items-center justify-center gap-2 py-3">
            <div className="animate-pulse-cloud">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Connecting to {meta.name}...</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isConnecting}>
            Cancel
          </Button>
          <Button onClick={handleConnect} className="flex-1" disabled={!email.trim() || isConnecting}>
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
