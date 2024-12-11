import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the user data interface with the `username` field
interface User {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}

// Define the state structure for the store
interface UserStore {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
}

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
      login: (userData: User) => set({ user: userData }), // Only set user data
      logout: () =>
        set({
          user: {
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            username: null,
          },
        }), // Clear user data
    }),
    { name: "user-storage" } // Name for persisted storage
  )
);
