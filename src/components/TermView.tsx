import type { Calendar } from "../types";
import { TermStatus } from "./TermStatus";
import { TermWeeks } from "./TermWeeks";


export function TermView({ calendar }: { calendar: Calendar }) {
  
    return (
      <div className="term">
        <TermWeeks calendar={calendar} />
        <TermStatus calendar={calendar} />
      </div>
    );
  
}