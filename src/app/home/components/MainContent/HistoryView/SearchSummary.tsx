import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";

const SearchSummary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const summaryStore = useSummaryStore();
  const ViewStore = useViewStore();
  const viewStoreState = useViewStore((state) => state);

  const date = viewStoreState.filter.date;

  // Handle search query change
  const handleSearch = async (value: string) => {
    try {
      const response = await axios.get("/api/summary", {
        params: { search: value, date },
      });

      if (response.status === 200) {
        const summaries = response.data;

        summaryStore.setSummaries({
          summaries,
          total: summaries.length,
        });

        ViewStore.setFilter({
          date,
          search: value,
        });
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  return (
    <Input
      placeholder="Search"
      className="rounded-2xl w-96"
      prefix={<SearchOutlined className="text-gray-400" />}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onPressEnter={() => handleSearch(searchQuery)}
    />
  );
};

export default SearchSummary;
