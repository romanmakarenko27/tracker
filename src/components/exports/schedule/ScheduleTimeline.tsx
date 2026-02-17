"use client";

import { ExportSchedule } from "@/types/export";
import { getUpcomingRuns, formatScheduleTime } from "@/lib/export-scheduling";

interface ScheduleTimelineProps {
  schedules: ExportSchedule[];
}

export function ScheduleTimeline({ schedules }: ScheduleTimelineProps) {
  const activeSchedules = schedules.filter((s) => s.enabled);

  if (activeSchedules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No active schedules</p>
      </div>
    );
  }

  // Collect upcoming runs from all active schedules
  const allRuns: { schedule: ExportSchedule; runTime: string }[] = [];
  for (const schedule of activeSchedules) {
    const runs = getUpcomingRuns(schedule.frequency, 3);
    for (const run of runs) {
      allRuns.push({ schedule, runTime: run });
    }
  }

  // Sort by time
  allRuns.sort(
    (a, b) => new Date(a.runTime).getTime() - new Date(b.runTime).getTime()
  );

  // Show first 8
  const visibleRuns = allRuns.slice(0, 8);

  return (
    <div className="space-y-0">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming Runs</h4>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-3">
          {visibleRuns.map((run, i) => (
            <div key={`${run.schedule.id}-${i}`} className="flex items-center gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-primary-100 border-2 border-primary-400 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-gray-700">{run.schedule.name}</p>
                <p className="text-xs text-gray-400">
                  {formatScheduleTime(run.runTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
