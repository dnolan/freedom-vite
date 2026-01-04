
import type { Term, Calendar, Week, Day, SchoolYear } from "../types";
import { years as data } from "../terms";
import { useEffect, useState } from 'react';
import { fetchBankHolidays } from '../bankholidays';
import type { BankHoliday } from '../bankholidays';
import { getEndOfWeek, getStartOfWeek } from '../datehelpers';
import { TermView } from './TermView';
import { CalendarStats } from './CalendarStats';
import { clsx } from "clsx";

export function Calendar() {

    const dayFinishHour = 14;
    const dayFinishMinute = 30;

    const [bankHolidays, setBankHolidays] = useState<BankHoliday[] | null>(null);
    const [selectedYear, setSelectedYear] = useState<SchoolYear | null>(getCurrentYear());

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchBankHolidays();
            setBankHolidays(data["england-and-wales"].events);
        };
        fetchData();
    }, []);

    // Build each term into an array of weeks
    function buildYear(year: SchoolYear) : Term[] {

        return year.terms.map((t: Term, index: number) => {
            const weeks = [...buildWeeks(t), ...buildHolidayWeeks(t, year.terms, index)];

            const calendar: Calendar = {
                weeks: weeks,
                count: weeks.length,
                stats: buildStats(weeks)
            };

            t.calendar = calendar;
            return t;
        })
    };

    function buildStats(weeks: Week[]) {
        const totals = weeks.reduce((acc, week) => {
            acc.schoolDays += week.days.filter(d => !d.holiday).length;
            acc.completedDays += week.days.filter(d => d.completed).length;
            acc.holidayDays += week.days.filter(d => d.holiday).length;
            return acc;
        }, { schoolDays: 0, completedDays: 0, holidayDays: 0 });

        const holidayDays = totals.holidayDays;
        const schoolDays = totals.schoolDays;
        const completedDays = totals.completedDays;

        const percentDone = Math.round((completedDays / schoolDays) * 100);
        const totalDays = schoolDays + holidayDays;
        return { holidayDays, schoolDays, completedDays, percentDone, totalDays };
    }

    function buildWeeks(t: Term, holiday: boolean = false): Week[] {
        const weeks: Week[] = [];
        const weekStart = new Date(t.start);
        const end = new Date(t.end);

        while (weekStart <= end) {
            const weekEnd = getEndOfWeek(weekStart);

            weeks.push({
                start: new Date(weekStart),
                end: new Date(weekEnd),
                days: weekDays(weekStart, weekEnd, holiday),
                holiday: holiday
            });

            if (weekStart.getDay() !== 1) {
                const diff = (1 - weekStart.getDay() + 7) % 7;
                weekStart.setDate(weekStart.getDate() + diff);
            } else {
                weekStart.setDate(weekStart.getDate() + 7);
            }
        }

        return weeks;
    }

    // Build holiday weeks between terms
    function buildHolidayWeeks(t: Term, terms: Term[], index: number): Week[] {

        if (terms.length > index + 1) {
            // This is janky, if the first day is not a monday
            const nextTerm = terms[index + 1];
            const start = new Date(t.end);
            start.setDate(start.getDate() + 3);
            const end = new Date(nextTerm.start);
            end.setDate(end.getDate() - 3);
            return buildWeeks({ start, end } as Term, true);
        }

        return [];
    }
    
    function isWeekend(dayOfWeek: number) {
        return dayOfWeek === 0 || dayOfWeek === 6;
    }

    function weekDays(start: Date, end: Date, allHoliday: boolean = false): Day[] {
        const weekdays: Day[] = [];
        const currentDate = getStartOfWeek(start);
        const now = new Date();

        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();

            if (isWeekend(dayOfWeek)) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }

            const day = BuildDay(currentDate, allHoliday, start, now);

            weekdays.push(day); // Add a copy of the date        

            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        return weekdays;
    }

    function BuildDay(currentDate: Date, allHoliday: boolean, start: Date, now: Date) : Day {
        const cutOff = new Date(currentDate);
        cutOff.setHours(dayFinishHour, dayFinishMinute, 0, 0);

        let holiday: boolean = allHoliday || currentDate < start;
        let title: string | undefined = undefined;

        let bankHoliday: BankHoliday | undefined = bankHolidays?.find((h: BankHoliday) => {
            const holidayDate = new Date(h.date);
            return holidayDate.toDateString() === currentDate.toDateString();
        });

        if (bankHoliday) {
            holiday = true;
            title = bankHoliday.title;
        }

        const completed = (cutOff < now) && !holiday;

        const day: Day = {
            date: new Date(currentDate),
            completed,
            holiday,
            title: title,
            today: currentDate.toDateString() === now.toDateString()
        };
        
        return day;
    }

    function renderYear(year: SchoolYear) {


        return year.terms.map(t => {

            const className = clsx("term-section", {
                "completed": t.calendar!.stats.percentDone === 100
            });

            return (
                <section key={t.name} className={className}>
                    <div className="title">
                        <h2>{t.name}</h2>
                        <div>{t.start.toLocaleDateString("en-GB")} to {t.end.toLocaleDateString("en-GB")}</div>
                    </div>
                    <TermView calendar={t.calendar!} />
                </section>
            )
        });
    }    

    function getCurrentYear() : SchoolYear | null {
        const now = new Date();
        const currentYear = data.find(year => now >= year.start && now <= year.end);
        return currentYear || null;
    }

    function renderSchoolYear(year: SchoolYear) {
        buildYear(year);

        return (<>
            <CalendarStats year={year} />
            {renderYear(year)}
        </>);
    }

    function onYearSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        const foundYear = data.find(year => year.start.toISOString() === event.target.value);
        setSelectedYear(foundYear || null);
    }

    function renderYearSelector() {
        return (
            <select onChange={onYearSelected} value={selectedYear ? selectedYear.start.toISOString() : ""}>
                {data.map(year => (
                    <option key={year.start.toISOString()} value={year.start.toISOString()}>
                        {year.start.getFullYear()} / {year.end.getFullYear()}
                    </option>
                ))}
            </select>
        )
    }

    return (
        <>
            <h1>School Countdown</h1>
            {renderYearSelector()}
            {selectedYear && renderSchoolYear(selectedYear)}
        </>
    )
}


