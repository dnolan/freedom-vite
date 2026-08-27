import { describe, expect, test } from '@jest/globals';
import { findSpecialDay, daysUntil, countSchoolDays } from '../src/specialdays';
import type { SpecialDay } from '../src/specialdays';
import type { Day } from '../src/types';

describe('specialdays module', () => {

  const days: SpecialDay[] = [
    { name: 'Graduation', date: new Date(2027, 5, 4) },
    { name: 'Prom', date: new Date(2027, 5, 24) },
  ];

  test('finds a special day matching the given date', () => {
    expect(findSpecialDay(new Date(2027, 5, 4), days)).toEqual(days[0]);
  });

  test('returns undefined when no special day matches the date', () => {
    expect(findSpecialDay(new Date(2027, 5, 5), days)).toBeUndefined();
  });

  test('uses the default specialDays list when none is passed', () => {
    expect(findSpecialDay(new Date(2027, 5, 24))?.name).toBe('Prom');
  });

  test.each([
    [new Date(2027, 5, 4), new Date(2027, 5, 1), 3],
    [new Date(2027, 5, 4), new Date(2027, 5, 4), 0],
    [new Date(2027, 5, 4), new Date(2027, 5, 5), -1],
  ])('counts the days between %s and %s as %i', (date, now, expected) => {
    expect(daysUntil(date, now)).toBe(expected);
  });

  function makeDay(date: Date, holiday = false): Day {
    return { date, completed: false, holiday, today: false };
  }

  // Monday 7 June 2027 to Friday 11 June 2027, with the Wednesday a holiday
  const weekDays: Day[] = [
    makeDay(new Date(2027, 5, 7)),
    makeDay(new Date(2027, 5, 8)),
    makeDay(new Date(2027, 5, 9), true),
    makeDay(new Date(2027, 5, 10)),
    makeDay(new Date(2027, 5, 11)),
  ];

  test('counts non-holiday days within the given range', () => {
    expect(countSchoolDays(weekDays, new Date(2027, 5, 7), new Date(2027, 5, 11))).toBe(4);
  });

  test('excludes a holiday day even if it falls in range', () => {
    expect(countSchoolDays(weekDays, new Date(2027, 5, 9), new Date(2027, 5, 9))).toBe(0);
  });

  test('ignores days outside the given range', () => {
    expect(countSchoolDays(weekDays, new Date(2027, 5, 10), new Date(2027, 5, 11))).toBe(2);
  });

  test('returns 0 when the range start is after the range end', () => {
    expect(countSchoolDays(weekDays, new Date(2027, 5, 11), new Date(2027, 5, 7))).toBe(0);
  });
});
