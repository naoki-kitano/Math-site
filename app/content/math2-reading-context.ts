import {math2ExplogReadingContext} from "./math2-explog-reading-context";

// Only hypotheses needed across passages stay visible. Worked steps and
// chapter-wide reminders belong to the passage in which they are used.
export const math2ReadingContext:Record<string,string>={
 ...math2ExplogReadingContext,
};
