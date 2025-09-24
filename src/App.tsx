'use client';

import './App.css'
import clsx from "clsx";
import type { Term, Calendar, Week, Day } from "./types";
import { terms } from "./terms";
import { useEffect, useState } from 'react';
import { fetchBankHolidays } from './bankholidays';
import type { BankHoliday } from './bankholidays';
import { getEndOfWeek, getStartOfWeek, renderMonthNames } from './datehelpers';
import { TermStatus } from './TermStatus';

export default function App() {
  const [bankHolidays, setBankHolidays] = useState<BankHoliday[] | null>(null);

  useEffect(() => {
      const fetchData = async () => {
        const data = await fetchBankHolidays();
        setBankHolidays(data["england-and-wales"].events);
      };
      fetchData();
  }, []);

  // Build each term into an array of weeks
  function buildTerms(terms: Term[]) {
      
      return terms.map((t: Term, index: number) => {
        const weeks = [...buildWeeks(t), ...buildHolidayWeeks(t, index)] ;

        const totals = weeks.reduce((acc, week) => {
          acc.schoolDays += week.days.filter(d => !d.holiday).length;
          acc.completedDays += week.days.filter(d => d.completed).length;
          acc.holidayDays += week.days.filter(d => d.holiday).length;
          return acc;
        }, {schoolDays: 0, completedDays: 0, holidayDays: 0});

        const holidayDays = totals.holidayDays;
        const schoolDays = totals.schoolDays;
        const completedDays = totals.completedDays;

        const percentDone = Math.round((completedDays / schoolDays) * 100);
        const totalDays = schoolDays + holidayDays;

        const calendar: Calendar = {
          weeks: weeks,
          count: weeks.length,
          stats: {
            holidayDays: holidayDays,
            schoolDays: schoolDays,
            completedDays: completedDays,
            percentDone: percentDone,
            totalDays: totalDays
          }
        };

        return { ...t, calendar };
      })
  };

  function buildWeeks(t: Term, holiday: boolean = false) : Week[] {
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
  function buildHolidayWeeks(t: Term, index: number) : Week[] {

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

  function weekDays(start: Date, end: Date, allHoliday: boolean = false) : Day[] {
    const weekdays = [];
    const currentDate = getStartOfWeek(start); //new Date(start);
    const now = new Date();

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {

        const cutOff = new Date(currentDate);
        cutOff.setHours(14, 30, 0, 0);

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

        const day = {
          date: new Date(currentDate),
          completed,
          holiday,
          title: title
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


  function renderWeeks(weeks: Week[]) {
    return weeks.map((w: Week, index: number) => {

      const daysClass = clsx("days",
        w.holiday && "holiday",
      );

      return (
        <div className="week" key={w.start.toLocaleDateString()}>
          <span className="title">
            { w.holiday != true ? <span className="weekName">Week {index + 1}</span> : <span className="weekName">Holiday</span> } 
            {renderMonthNames(w.start, w.end)}
          </span>
          <div className={daysClass}>
            {renderDaysOfWeek(w)}
          </div>
        </div>
      )
    })
  }

  const renderTermWeeks = function (calendar: Calendar) {
    return (
      <div className="term">
        {renderWeeks(calendar.weeks)}
        <TermStatus calendar={calendar} />
      </div>
    );
  }

  const renderCalendar = function () {
    return buildTerms(terms).map(t => {

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


