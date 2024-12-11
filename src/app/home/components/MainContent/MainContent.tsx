import React from "react";
import { useViewStore } from "@/stores/viewStore";
import SummarizerView from "./SummarizerView/SummarizerView";
import HistoryView from "./HistoryView/HistoryView";

const MainContent = () => {
  const selectedView = useViewStore((state) => state.selectedView);

  return (
    <div>{selectedView === "home" ? <SummarizerView /> : <HistoryView />}</div>
  );
};

export default MainContent;
