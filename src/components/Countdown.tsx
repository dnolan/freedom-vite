import { daysUntil } from "../specialdays";

export function Countdown({ label, date, schoolDays }: { label: string; date: Date; schoolDays: number }) {
  const days = daysUntil(date);

  if (days < 0) return null;

  return (
    <div className="countdown">
      <span className="countdown-days">{schoolDays}</span>
      <span className="countdown-label">school day{schoolDays === 1 ? "" : "s"} until {label}</span>
    </div>
  );
}
