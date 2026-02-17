"use client";

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./useLocalStorage";
import {
  ExportSchedule,
  ExportFormat,
  ExportDestination,
  ScheduleFrequency,
} from "@/types/export";
import { EXPORT_SCHEDULES_KEY } from "@/lib/export-constants";
import { calculateNextRun } from "@/lib/export-scheduling";

export function useExportSchedules() {
  const [schedules, setSchedules, isLoaded] = useLocalStorage<ExportSchedule[]>(
    EXPORT_SCHEDULES_KEY,
    []
  );

  const addSchedule = useCallback(
    (params: {
      name: string;
      frequency: ScheduleFrequency;
      format: ExportFormat;
      destination: ExportDestination;
      categories: string[];
      email?: string;
    }) => {
      const schedule: ExportSchedule = {
        id: uuidv4(),
        name: params.name,
        frequency: params.frequency,
        format: params.format,
        destination: params.destination,
        categories: params.categories,
        enabled: true,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: calculateNextRun(params.frequency),
        email: params.email,
      };
      setSchedules((prev) => [schedule, ...prev]);
      return schedule;
    },
    [setSchedules]
  );

  const removeSchedule = useCallback(
    (id: string) => {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    },
    [setSchedules]
  );

  const toggleSchedule = useCallback(
    (id: string) => {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, enabled: !s.enabled } : s
        )
      );
    },
    [setSchedules]
  );

  return {
    schedules,
    isLoaded,
    addSchedule,
    removeSchedule,
    toggleSchedule,
  };
}
