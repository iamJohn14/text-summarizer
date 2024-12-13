import { ViewStore } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      selectedView: "home",
      currentPage: 1,
      total: 0,
      setSelectedView: (view: string) => set({ selectedView: view }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setTotal: (total: number) => set({ total }),
    }),
    {
      name: "view-storage",
    }
  )
);
