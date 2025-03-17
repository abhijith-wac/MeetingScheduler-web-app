import { atomWithStorage, createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => localStorage);

export const logAuth = atomWithStorage("loginState", {
  isAuthenticated: false,
  user: null,
  token: null,
},
storage,
{
  getOnInit: true
});