import { atomWithStorage } from "jotai/utils";
import { createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => localStorage);

export const modalStateAtom = atomWithStorage(
  "modalState", 
  {
    isModalOpen: false,
    selectedItem: null,
  },
  storage, 
  {
    getOnInit: true, 
  }
);
