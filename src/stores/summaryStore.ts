import { SummaryStore, Summary } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create the store for summary
export const useSummaryStore = create<SummaryStore>()(
  persist(
    (set) => ({
      summaries: [],
      total: 0,
      forEdit: null, // Initialize forEdit as null
      setSummaries: (data: { summaries: Summary[]; total: number }) =>
        set({
          summaries: data.summaries,
          total: data.total,
        }),
      editSummary: (index: number, newSummary: Summary) =>
        set((state) => {
          const updatedSummaries = [...state.summaries];
          updatedSummaries[index] = newSummary;
          return { summaries: updatedSummaries };
        }),
      setForEdit: (index: number | null) => set({ forEdit: index }),
    }),
    { name: "summary-storage" }
  )
);
