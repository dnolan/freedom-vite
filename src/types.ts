type Term = {
  name: string;
  start: Date;
  end: Date;
  calendar?: Calendar;
};

type Calendar = {
  weeks: Week[];
  count: number;
  holidays: Holiday[];
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
};

type Day = {
  date: Date;
  completed: boolean;
  holiday: boolean;
  title?: string;
};

type Holiday = {
  start: Date;
  end: Date;
  days: Day[];
};


export type { Term, Calendar, Week, Day, Holiday };