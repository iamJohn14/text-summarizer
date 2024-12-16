import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";
import { Select } from "antd";
import axios from "axios";
import { AiFillCalendar } from "react-icons/ai";

const { Option } = Select;

const DateRangeMenu = () => {
  const { setSummaries } = useSummaryStore();
  const { filter, setFilter, setCurrentPage, selectedDate, setSelectedDate } =
    useViewStore();

  const search = filter.search;

  const handleDateRangeChange = async (value: string) => {
    const response = await axios.get("/api/summary", {
      params: { date: value, search },
    });

    setFilter({
      date: value,
      search,
    });

    setCurrentPage(1);
    setSelectedDate(value);

    if (response.status === 200) {
      const summaries = response.data;

      setSummaries({
        summaries,
        total: summaries.length,
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 pb-4 lg:pb-0">
      {/* Dropdown */}
      <Select
        value={selectedDate}
        placeholder="Select Date Range"
        className="rounded-2xl w-64"
        onChange={handleDateRangeChange}
        prefix={<AiFillCalendar className="text-gray-500 text-lg" />}
      >
        <Option value="today">Today</Option>
        <Option value="last7days">Last 7 Days</Option>
        <Option value="last14days">Last 14 Days</Option>
        <Option value="last30days">Last 30 Days</Option>
        <Option value="30-60days">30-60 Days Ago</Option>
        <Option value=">60days">&gt; 60 Days Ago</Option>
      </Select>
    </div>
  );
};

export default DateRangeMenu;
