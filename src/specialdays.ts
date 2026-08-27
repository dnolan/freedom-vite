import type { Day } from "./types";

export type SpecialDay = {
  name: string;
  date: Date;
};

export const specialDays: SpecialDay[] = [
  { name: "Graduation", date: new Date("2027-06-04") },
  { name: "Prom", date: new Date("2027-06-24") },
];

export function findSpecialDay(date: Date, days: SpecialDay[] = specialDays): SpecialDay | undefined {
  return days.find(d => d.date.toDateString() === date.toDateString());
}

export function daysUntil(date: Date, now: Date = new Date()): number {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function countSchoolDays(days: Day[], from: Date, to: Date): number {
  const fromMid = atMidnight(from);
  const toMid = atMidnight(to);

  if (fromMid > toMid) return 0;

  return days.filter(d => {
    if (d.holiday) return false;
    const dm = atMidnight(d.date);
    return dm >= fromMid && dm <= toMid;
  }).length;
}
