"use client";

interface ExportStatusBadgeProps {
  status: "completed" | "failed" | "pending" | "connected" | "disconnected" | "syncing" | "error";
}

const statusConfig: Record<
  string,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  completed: {
    label: "Completed",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  failed: {
    label: "Failed",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  pending: {
    label: "Pending",
    dotColor: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
  connected: {
    label: "Connected",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  disconnected: {
    label: "Disconnected",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-50",
    textColor: "text-gray-600",
  },
  syncing: {
    label: "Syncing",
    dotColor: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
  error: {
    label: "Error",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
};

export function ExportStatusBadge({ status }: ExportStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${
          status === "syncing" ? "animate-pulse" : ""
        }`}
      />
      {config.label}
    </span>
  );
}
