import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";

const SearchSummary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSummaries } = useSummaryStore();
  const { filter, setFilter, setCurrentPage } = useViewStore();

  const date = filter.date;

  // Handle search query change
  const handleSearch = async (value: string) => {
    try {
      const response = await axios.get("/api/summary", {
        params: { search: value, date },
      });

      if (response.status === 200) {
        const summaries = response.data;

        setSummaries({
          summaries,
          total: summaries.length,
        });

        setFilter({
          date,
          search: value,
        });

        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  return (
    <div className="w-auto sm:w-96">
      <Input
        placeholder="Search"
        className="rounded-2xl "
        prefix={<SearchOutlined className="text-gray-400" />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onPressEnter={() => handleSearch(searchQuery)}
      />
    </div>
  );
};

export default SearchSummary;
