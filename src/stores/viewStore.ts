import { ViewStore } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      selectedView: "home",
      selectedDate: "today",
      currentPage: 1,
      filter: {
        date: "today",
        search: "",
      },
      trigger: false,
      setSelectedView: (view: string) => set({ selectedView: view }),
      setSelectedDate: (date: string) => set({ selectedDate: date }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setFilter: (filter: { date: string; search: string }) => set({ filter }),
      setTrigger: (value: boolean) => set({ trigger: value }),
    }),
    {
      name: "view-storage",
    }
  )
);
