"use client";

import { CloudProvider } from "@/types/export";
import { CLOUD_PROVIDERS } from "@/lib/export-constants";

interface CloudIconProps {
  provider: CloudProvider;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export function CloudIcon({ provider, size = "md" }: CloudIconProps) {
  const meta = CLOUD_PROVIDERS[provider];

  const initials: Record<CloudProvider, string> = {
    dropbox: "DB",
    onedrive: "OD",
    "google-drive": "GD",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl flex items-center justify-center font-bold text-white`}
      style={{ backgroundColor: meta.color }}
    >
      {initials[provider]}
    </div>
  );
}
