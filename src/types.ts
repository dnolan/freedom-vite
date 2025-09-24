type Term = {
  name: string;
  start: Date;
  end: Date;
  calendar?: Calendar;
};

type Calendar = {
  weeks: Week[];
  count: number;
  stats: {
    holidayDays: number;
    schoolDays: number;
    completedDays: number;
    totalDays: number;
    percentDone: number;
  };
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
};


export type { Term, Calendar, Week, Day };