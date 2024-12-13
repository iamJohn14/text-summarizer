import { ViewStore } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      selectedView: "home",
      currentPage: 1,
      filter: {
        date: ">60days",
        search: "",
      },
      trigger: false,
      setSelectedView: (view: string) => set({ selectedView: view }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setFilter: (filter: { date: string; search: string }) => set({ filter }),
      setTrigger: (value: boolean) => set({ trigger: value }),
    }),
    {
      name: "view-storage",
    }
  )
);
