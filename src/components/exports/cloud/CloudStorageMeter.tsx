"use client";

interface CloudStorageMeterProps {
  used: number; // MB
  total: number; // MB
}

export function CloudStorageMeter({ used, total }: CloudStorageMeterProps) {
  const percentage = Math.min((used / total) * 100, 100);
  const usedLabel = used >= 1024 ? `${(used / 1024).toFixed(1)} GB` : `${Math.round(used)} MB`;
  const totalLabel = total >= 1024 ? `${(total / 1024).toFixed(0)} GB` : `${total} MB`;

  let barColor = "bg-primary-500";
  if (percentage > 80) barColor = "bg-red-500";
  else if (percentage > 50) barColor = "bg-amber-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{usedLabel} used</span>
        <span>{totalLabel}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
