import { SummaryStore, Summary } from "@/types/types"; // Make sure to define these types correctly
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create the store for summary
export const useSummaryStore = create<SummaryStore>()(
  persist(
    (set) => ({
      summaries: [], // Initial empty array
      total: "0", // Initial total set to "0"
      // Update setSummaries to accept an object with summaries and total
      setSummaries: (data: { summaries: Summary[]; total: string }) =>
        set({
          summaries: data.summaries,
          total: data.total,
        }),
    }),
    { name: "summary-storage" }
  )
);
