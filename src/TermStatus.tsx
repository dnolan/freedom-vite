  import type { Calendar } from "./types";

  export function TermStatus({calendar}: {calendar: Calendar}) {

    const stats = calendar.stats;

    if (!stats) return null;

    return (
      <>
        <div className="break"></div>
        <div className="term-status">
          <div>Done <span className="value">{stats.completedDays} of <span className="value">{stats.totalDays}</span></span></div>
          <div>Holidays <span className="value">{stats.holidayDays}</span></div>
          <div>Remaining <span className="value">{stats.schoolDays - stats.completedDays}</span></div>
          <div>Completed <span className="value">{stats.percentDone}%</span></div>
        </div>
      </>
    );
  }