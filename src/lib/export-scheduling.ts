import { addDays, addWeeks, addMonths, format } from "date-fns";
import { ScheduleFrequency } from "@/types/export";

export function calculateNextRun(
  frequency: ScheduleFrequency,
  fromDate?: Date
): string {
  const now = fromDate || new Date();
  let next: Date;

  switch (frequency) {
    case "daily":
      next = addDays(now, 1);
      next.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      next = addWeeks(now, 1);
      // Set to next Monday
      next.setDate(next.getDate() - next.getDay() + 1);
      next.setHours(9, 0, 0, 0);
      break;
    case "biweekly":
      next = addWeeks(now, 2);
      next.setDate(next.getDate() - next.getDay() + 1);
      next.setHours(9, 0, 0, 0);
      break;
    case "monthly":
      next = addMonths(now, 1);
      next.setDate(1);
      next.setHours(9, 0, 0, 0);
      break;
  }

  return next.toISOString();
}

export function getUpcomingRuns(
  frequency: ScheduleFrequency,
  count: number = 5
): string[] {
  const runs: string[] = [];
  let current = new Date();

  for (let i = 0; i < count; i++) {
    const nextRun = calculateNextRun(frequency, current);
    runs.push(nextRun);
    current = new Date(nextRun);
  }

  return runs;
}

export function formatScheduleTime(isoString: string): string {
  return format(new Date(isoString), "MMM d, yyyy 'at' h:mm a");
}

export function getFrequencyLabel(frequency: ScheduleFrequency): string {
  switch (frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "biweekly":
      return "Bi-weekly";
    case "monthly":
      return "Monthly";
  }
}
