

import type { SchoolYear, Term } from "./types";

const years: SchoolYear[] = [
  {
    start: new Date("2025-08-27"),
    end: new Date("2026-07-17"),
    terms: [
      { name: "Autumn Term 1", start: new Date("2025-08-27"), end: new Date("2025-10-17") },
      { name: "Autumn Term 2", start: new Date("2025-11-04"), end: new Date("2025-12-19") },
      { name: "Spring Term 1", start: new Date("2026-01-05"), end: new Date("2026-02-13") },
      { name: "Spring Term 2", start: new Date("2026-02-23"), end: new Date("2026-03-27") },
      { name: "Summer Term 1", start: new Date("2026-04-13"), end: new Date("2026-06-12") },
      { name: "Summer Term 2", start: new Date("2026-06-23"), end: new Date("2026-07-17") }
    ]
  },
  {
    start: new Date("2026-08-25"),
    end: new Date("2027-07-16"),
    terms: [
      { name: "Autumn Term 1", start: new Date("2026-08-25"), end: new Date("2026-10-16") },
      { name: "Autumn Term 2", start: new Date("2026-11-03"), end: new Date("2026-12-18") },
      { name: "Spring Term 1", start: new Date("2027-01-04"), end: new Date("2027-02-12") },  
      { name: "Spring Term 2", start: new Date("2027-02-22"), end: new Date("2027-03-25") }
    ]
  }
];

const terms: Term[] = [
  { name: "Autumn Term 1", start: new Date("2025-08-27"), end: new Date("2025-10-17") },
  { name: "Autumn Term 2", start: new Date("2025-11-04"), end: new Date("2025-12-19") },
  { name: "Spring Term 1", start: new Date("2026-01-05"), end: new Date("2026-02-13") },
  { name: "Spring Term 2", start: new Date("2026-02-23"), end: new Date("2026-03-27") },
  { name: "Summer Term 1", start: new Date("2026-04-13"), end: new Date("2026-06-12") },
  { name: "Summer Term 2", start: new Date("2026-06-23"), end: new Date("2026-07-17") }
];

export { terms, years };