"use client";

import { useEffect, useState } from "react";

interface AnimatedProgressProps {
  isActive: boolean;
  duration?: number; // ms
  label?: string;
}

export function AnimatedProgress({
  isActive,
  duration = 2500,
  label = "Processing...",
}: AnimatedProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const interval = 50;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const p = Math.min((current / steps) * 100, 95);
      setProgress(p);
      if (current >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, duration]);

  if (!isActive) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
