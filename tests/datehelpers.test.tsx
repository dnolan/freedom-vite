import { describe, expect, test } from '@jest/globals';
import { getEndOfWeek } from '../src/datehelpers';

describe('datehelpers module', () => {

  test.each([
    [new Date(2026, 0, 3), new Date(2026, 0, 9)], // Saturday to Friday
    [new Date(2026, 0, 4), new Date(2026, 0, 9)], // Sunday to Friday
    [new Date(2026, 0, 5), new Date(2026, 0, 9)], // Monday to Friday
    [new Date(2026, 0, 6), new Date(2026, 0, 9)], // Tuesday to Friday
    [new Date(2026, 0, 7), new Date(2026, 0, 9)], // Wednesday to Friday
    [new Date(2026, 0, 8), new Date(2026, 0, 9)], // Thursday to Friday
    [new Date(2026, 0, 9), new Date(2026, 0, 9)], // Friday to Friday
  ])('gets the end of the week for %s', (input, expected) => {
    expect(getEndOfWeek(input)).toEqual(expected);
  });
});