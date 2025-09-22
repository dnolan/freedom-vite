'use client';

import './App.css'
import clsx from "clsx";
import type { Term, Calendar, Week, Day, Holiday } from "./types";
import { terms } from "./terms";
import { useEffect, useState } from 'react';

export default function App() {

  type BankHoliday = {
    id: string;
    title: string;
    date: string;
    notes: string;
  };

  const [bankHolidays, setBankHolidays] = useState<BankHoliday[] | null>(null);

  async function fetchBankHolidays() {
    const response = await fetch("https://www.gov.uk/bank-holidays.json");
    const data = await response.json();
    return data;
  }

  useEffect(() => {
      const fetchData = async () => {
        const data = await fetchBankHolidays();
        setBankHolidays(data["england-and-wales"].events);
      };
      fetchData();
  }, []);

  function getEndOfWeek(date: Date): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + (5 - next.getDay() + 7) % 7);
    return next;
  }

  function getStartOfWeek(date: Date): Date {
    const prev = new Date(date);
    const offset = prev.getDay();
    if (offset == 1) {
      return prev;
    } else if (offset == 0) {
      prev.setDate(prev.getDate() - 1);
    } else {
      prev.setDate(prev.getDate() - (offset + 1));
    }
    return prev;
  }

  // Build each term into an array of weeks
  const termWeeks = terms.map((t: Term, index: number) => {
    const weeks = buildWeeks(t);

    const holidays = endOfTermHolidays(t, index)

    let holidayDays =holidays.reduce((acc, holiday) => acc + holiday.days.length, 0);
    let schoolDays = 0;
    let completedDays = 0;

    for (const w of weeks) {
      schoolDays += w.days.filter(d => !d.holiday).length;
      completedDays += w.days.filter(d => d.completed).length;
      holidayDays += w.days.filter(d => d.holiday).length;
    }

    const percentDone = Math.round((completedDays / schoolDays) * 100);
    const totalDays = schoolDays + holidayDays;

    const calendar: Calendar = {
      weeks: weeks,
      count: weeks.length,
      holidays: holidays,
      stats: {
        holidayDays: holidayDays,
        schoolDays: schoolDays,
        completedDays: completedDays,
        percentDone: percentDone,
        totalDays: totalDays
      }
    };

    return { ...t, calendar };
  });

  function buildWeeks(t: Term) {
    const weeks: Week[] = [];
    const weekStart = new Date(t.start);
    const end = new Date(t.end);

    while (weekStart <= end) {
      const weekEnd = getEndOfWeek(weekStart);

      weeks.push({
        start: new Date(weekStart),
        end: new Date(weekEnd),
        days: weekDays(weekStart, weekEnd)
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

  function endOfTermHolidays(t: Term, index: number) {

    if (terms.length > index + 1) {
      // This is janky, if the first day is not a monday
      const nextTerm = terms[index + 1];
      const start = new Date(t.end);
      start.setDate(start.getDate() + 3);
      const end = new Date(nextTerm.start);
      end.setDate(end.getDate() - 3);
      return buildWeeks({ start, end } as Term);
    }

    return [];
  }

  function weekDays(start: Date, end: Date) {
    const weekdays = [];
    const currentDate = getStartOfWeek(start); //new Date(start);
    const now = new Date();

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {

        const cutOff = new Date(currentDate);
        cutOff.setHours(14, 30, 0, 0);

        let holiday: boolean = currentDate < start;
        let holidayTitle: string | undefined = undefined;

        let bankHoliday: BankHoliday | undefined = bankHolidays?.find((h: BankHoliday) => {
          const holidayDate = new Date(h.date);
          return holidayDate.toDateString() === currentDate.toDateString();
        });

        if (bankHoliday) {
          holiday = true;
          holidayTitle = bankHoliday.title;
          console.log("Bank holiday on " + bankHoliday.date + " : " + bankHoliday.title);
        }


        const completed = (cutOff < now) && !holiday;

        const day = {
          date: new Date(currentDate),
          completed,
          holiday,
          title: holidayTitle
        };
        weekdays.push(day); // Add a copy of the date
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return weekdays;
  }

  function renderDaysOfWeek(week: Week) {
    return week.days.map((d: Day) => {

      const className = clsx("day",
        d.completed && "completed",
        d.holiday && "holiday",
      );

      return (
        <span className={className} key={d.date.toLocaleDateString()} title={d.title}>{d.date.getDate()}</span>
      )
    })
  }

  function renderMonthNames(start: Date, end: Date) {
    const months = [];
    const current = new Date(start.getFullYear(), start.getMonth());

    while (current <= end) {
      months.push(current.toLocaleString('en-GB', { month: 'short', year: '2-digit' }));
      current.setMonth(current.getMonth() + 1);
    }

    return months.map(m => <span key={m} className="month">{m}</span>);
  }

  function renderWeeks(weeks: Week[]) {
    return weeks.map((w: Week, index: number) => {
      return (
        <div className="week" key={w.start.toLocaleDateString()}>
          <span className="title">
            <span className="weekName">Week {index + 1}</span>
            {renderMonthNames(w.start, w.end)}
          </span>
          <div className="days">
            {renderDaysOfWeek(w)}
          </div>
        </div>
      )
    })
  }

  function renderHoliday(holidays: Holiday[]) {
    return holidays.map((h: Holiday) => {
      return (
        <div className="week" key={h.start.toLocaleDateString()}>
          <span className="title">
            {renderMonthNames(h.start, h.end)}
          </span>
          <div className="days holiday">
            {renderDaysOfWeek(h)}
          </div>
        </div>
      )
    })
  }

  function renderTermStatus(calendar: Calendar) {

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

  const renderTermWeeks = function (calendar: Calendar) {
    return (
      <div className="term">
        {renderWeeks(calendar.weeks)}
        {renderHoliday(calendar.holidays)}
        {renderTermStatus(calendar)}
      </div>
    );
  }

  const renderCalendar = function () {
    return termWeeks.map(t => {

      return (
        <section key={t.name} className="term-section">
          <div className="title">
            <h1>{t.name}</h1>
            <div>{t.start.toLocaleDateString("en-GB")} until {t.end.toLocaleDateString("en-GB")}</div>
          </div>
          {renderTermWeeks(t.calendar!)}
        </section>
      )
    })
  }

  return (
    <div className="App">
      {renderCalendar()}

      <div className="key">
        <h2>Key</h2>
        <section className="days">
          <div className="key-entry">
            <div className="day">1</div>
            <span>School Day</span>
          </div>
          <div className="key-entry">
            <div className="day completed">1</div>
            <span>Completed Day</span>
          </div>
          <div className="key-entry">
            <div className="day holiday">1</div>
            <span>Holiday</span>
          </div>
        </section>
      </div>
    </div>
  );
}


