"use client";

import { useState } from "react";
import { useExportSchedules } from "@/hooks/useExportSchedules";
import { ScheduleForm } from "../schedule/ScheduleForm";
import { ScheduleCard } from "../schedule/ScheduleCard";
import { ScheduleTimeline } from "../schedule/ScheduleTimeline";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export function SchedulesTab() {
  const { schedules, addSchedule, removeSchedule, toggleSchedule } =
    useExportSchedules();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (params: Parameters<typeof addSchedule>[0]) => {
    addSchedule(params);
    setShowForm(false);
    toast.success("Schedule created");
  };

  const handleDelete = (id: string) => {
    removeSchedule(id);
    toast.success("Schedule deleted");
  };

  return (
    <div className="animate-float-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Export Schedules</h3>
          <p className="text-xs text-gray-500">
            Automate your exports with recurring schedules.
          </p>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Schedule
            </span>
          </Button>
        )}
      </div>

      {showForm && (
        <ScheduleForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {schedules.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-600">Schedules</h4>
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggle={() => toggleSchedule(schedule.id)}
                onDelete={() => handleDelete(schedule.id)}
              />
            ))}
          </div>
          <div>
            <ScheduleTimeline schedules={schedules} />
          </div>
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No schedules yet</p>
            <p className="text-xs mt-1">Create a schedule to automate your exports</p>
          </div>
        )
      )}
    </div>
  );
}
