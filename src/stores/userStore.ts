import { UserParameter, UserStore } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Apply the persist middleware
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        username: null,
      },
      login: (userData: UserParameter) => set({ user: userData }),
      logout: () =>
        set({
          user: {
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            username: null,
          },
        }),
    }),
    { name: "user-storage" }
  )
);
