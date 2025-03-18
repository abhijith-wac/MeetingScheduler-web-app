import { atomWithStorage } from "jotai/utils";
import { createJSONStorage } from "jotai/utils";

// Create storage for meetings
const storage = createJSONStorage(() => localStorage);

// Atom to store the meetings data
export const meetingsAtom = atomWithStorage(
  "meetingsData", // Key for localStorage
  [], // Default value (an empty array)
  storage, // The storage mechanism (localStorage in this case)
  {
    getOnInit: true, // Fetch data from storage on initialization
  }
);
