type SchoolYear = {
  terms: Term[];
  start: Date;
  end: Date;
};

type Term = {
  name: string;
  start: Date;
  end: Date;
  calendar?: Calendar;
};

type Calendar = {
  weeks: Week[];
  count: number;
  stats: Stats;
};

type Stats = {
  holidayDays: number;
  schoolDays: number;
  completedDays: number;
  percentDone: number;
  totalDays: number;
};

type Week = {
  start: Date;
  end: Date;
  days: Day[];
  holiday: boolean;
};

type Day = {
  date: Date;
  completed: boolean;
  holiday: boolean;
  title?: string;
  today: boolean;
};


export type { Term, Calendar, Week, Day, Stats, SchoolYear };