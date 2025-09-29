import type { Stats } from '../types';

export  function CalendarStats({ stats }: { stats: Stats }) {
    return (
        <div className="year-stats">
            <ul>
                <li>School: {stats.schoolDays}</li>
                <li>Completed: {stats.completedDays}</li>
                <li>Overall: {stats.percentDone}%</li>
                <li>Holidays: {stats.holidayDays}</li>
            </ul>
        </div>
    );
}
