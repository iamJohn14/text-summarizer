import { ViewStore } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      selectedView: "home",
      setSelectedView: (view: string) => set({ selectedView: view }),
    }),
    {
      name: "view-storage",
    }
  )
);
