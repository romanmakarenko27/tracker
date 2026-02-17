"use client";

import { ExportSchedule } from "@/types/export";
import { getFrequencyLabel, formatScheduleTime } from "@/lib/export-scheduling";
import { Button } from "@/components/ui/Button";
import { DestinationIcon } from "../common/DestinationIcon";

interface ScheduleCardProps {
  schedule: ExportSchedule;
  onToggle: () => void;
  onDelete: () => void;
}

export function ScheduleCard({ schedule, onToggle, onDelete }: ScheduleCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 transition-all ${
        schedule.enabled
          ? "border-primary-200 shadow-sm"
          : "border-gray-200 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <DestinationIcon destination={schedule.destination} className="w-5 h-5 text-primary-500" />
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{schedule.name}</h4>
            <p className="text-xs text-gray-500">
              {getFrequencyLabel(schedule.frequency)} &middot; {schedule.format.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            schedule.enabled ? "bg-primary-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              schedule.enabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Next: {formatScheduleTime(schedule.nextRunAt)}</span>
        </div>
        {schedule.lastRunAt && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Last: {formatScheduleTime(schedule.lastRunAt)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-500 hover:text-red-700">
          Delete
        </Button>
      </div>
    </div>
  );
}
