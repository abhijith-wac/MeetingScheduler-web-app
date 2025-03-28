import { atomWithStorage } from "jotai/utils";
import { createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => localStorage);

export const calendarViewAtom = atomWithStorage(
  "calendarView",
  "week", // Default view is "month"
  storage
);
