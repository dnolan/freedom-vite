import type { Calendar, Week, Day } from "../types";
import clsx from "clsx";
import { renderMonthNames } from "../datehelpers";

export function TermWeeks({ calendar }: { calendar: Calendar }) {

    function renderDaysOfWeek(week: Week) {
        return week.days.map((d: Day) => {

            const className = clsx("day",
                d.completed && "completed",
                d.holiday && "holiday",
                d.today && "today"
            );

            return (
                <span className={className} key={d.date.toLocaleDateString()} title={d.title}>{d.date.getDate()}</span>
            )
        })
    }

    return calendar.weeks.map((w: Week, index: number) => {

        const daysClass = clsx("days",
            w.holiday && "holiday",            
        );

        return (
            <div className="week" key={w.start.toLocaleDateString()}>
                <span className="title">
                    {w.holiday != true ? <span className="weekName">Week {index + 1}</span> : <span className="weekName">Holiday</span>}
                    {renderMonthNames(w.start, w.end)}
                </span>
                <div className={daysClass}>
                    {renderDaysOfWeek(w)}
                </div>
            </div>
        )
    })
}
