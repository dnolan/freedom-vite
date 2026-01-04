import type { Stats, SchoolYear } from '../types';

export function CalendarStats({ year }: { year: SchoolYear }) {

    const allStats = year.terms.flatMap(t => t.calendar?.stats || []);

    const stats : Stats = allStats.reduce((acc, st) => {
        acc.schoolDays += st.schoolDays;
        acc.completedDays += st.completedDays;
        acc.holidayDays += st.holidayDays;
        acc.totalDays += st.totalDays;
        acc.percentDone = Math.round((acc.completedDays / acc.schoolDays) * 100);
        return acc;
    }, { schoolDays: 0, completedDays: 0, holidayDays: 0, percentDone: 0, totalDays: 0 });

    return (
        <div className="year-stats">
            <ul>                
                <li key={year.start.toISOString()}><span className="title">Year</span> {year.start.getFullYear()} / {year.end.getFullYear()}</li>
                <li><span className="title" title="Days in school">School Days</span> {stats.schoolDays}</li>
                <li><span className="title" title="Completed days">Completed</span> {stats.completedDays}</li>
                <li><span className="title" title="Percentage of days completed">Overall</span> {stats.percentDone}%</li>
                <li><span className="title" title="Holiday days">Holidays</span> {stats.holidayDays}</li>
            </ul>
        </div>
    );
}
