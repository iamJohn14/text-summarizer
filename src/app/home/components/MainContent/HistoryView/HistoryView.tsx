/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Pagination } from "antd";
import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";
import { formatDate } from "@/utils/dateUtils";
import OptionsMenu from "./OptionsMenu";
import { RiText } from "react-icons/ri";
import { ImParagraphLeft } from "react-icons/im";
import { FaCalendar } from "react-icons/fa";
import DateRangeMenu from "./DateRangeMenu";
import axios from "axios";
import SearchSummary from "./SearchSummary";

const HistoryView: React.FC = () => {
  // Accessing only the state of the stores
  const summaryStoreState = useSummaryStore((state) => state);
  const viewStoreState = useViewStore((state) => state);
  const viewStore = useViewStore();
  const currentPage = viewStoreState.currentPage;
  const total = summaryStoreState.total;
  const pageSize = 5;

  // Calculate start and end index for displaying entries
  const startIndex = (currentPage - 1) * pageSize; // Correct starting index
  const endIndex = Math.min(currentPage * pageSize, total); // Ensure it doesn't go past total

  // Get the summaries for the current page
  const summariesToDisplay = summaryStoreState.summaries.slice(
    startIndex,
    endIndex
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("/api/summary", {
  //         params: { date: ">60days" },
  //       });

  //       if (response.status === 200) {
  //         const summaries = response.data;

  //         summaryStoreState.setSummaries({
  //           summaries,
  //           total: summaries.length,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching summary data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="p-10 md:p-14 space-y-4 min-h-screen flex flex-col">
      <div className="text-4xl font-bold">History</div>
      <div className="text-lg text-gray-500 font-caption">
        View previously summarized texts
      </div>

      {/* Search bar */}
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex items-center space-x-2 pb-4 lg:pb-0">
          <DateRangeMenu />
        </div>
        <SearchSummary />
      </div>

      {/* History entries */}
      <div className="mt-4 font-caption flex-grow">
        {summariesToDisplay.map((summary, index) => (
          <div
            key={index}
            className="bg-white p-3 mb-3 border border-[#DEE0E3] rounded-2xl"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm line-clamp-2">{summary.summary}</p>
                <div className="text-sm text-gray-500 mt-2 hidden lg:flex items-center">
                  <span className="border border-[#E9EAEC] bg-[#E9EAEC] rounded-md p-1 flex items-center space-x-2 ml-4">
                    <FaCalendar /> &nbsp;
                    {formatDate(summary.createdAt)}
                  </span>
                  <span className="border border-[#E9EAEC] bg-[#E9EAEC] rounded-md p-1 flex items-center space-x-2 ml-4">
                    <ImParagraphLeft /> &nbsp;
                    {summary.wordCount} words
                  </span>
                  <span className="border border-[#E9EAEC] bg-[#E9EAEC] rounded-md p-1 flex items-center space-x-2 ml-4">
                    <RiText /> &nbsp;
                    {summary.charCount} characters
                  </span>
                </div>
              </div>
              <OptionsMenu summary={summary} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between font-caption mt-auto pb-5">
        <div className="text-gray-500">
          Show {startIndex + 1} to {endIndex} of {total} entries
        </div>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={(page) => viewStore.setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default HistoryView;
