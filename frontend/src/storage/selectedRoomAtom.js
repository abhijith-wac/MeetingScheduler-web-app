import { atomWithStorage } from "jotai/utils";
import { createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => localStorage);

export const selectedRoomAtom = atomWithStorage(
  "selectedRoom",
  "1", // Default selected room
  storage
);
