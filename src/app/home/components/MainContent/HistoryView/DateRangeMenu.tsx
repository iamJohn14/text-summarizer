import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";
import { Select } from "antd";
import axios from "axios";
import Image from "next/image";

const { Option } = Select;

const DateRangeMenu = () => {
  const summaryStore = useSummaryStore();
  const viewStore = useViewStore();
  const viewStoreState = useViewStore((state) => state);

  const search = viewStoreState.filter.search;

  const handleDateRangeChange = async (value: string) => {
    const response = await axios.get("/api/summary", {
      params: { date: value, search },
    });

    viewStore.setFilter({
      date: value,
      search,
    });

    if (response.status === 200) {
      const summaries = response.data;

      summaryStore.setSummaries({
        summaries,
        total: summaries.length,
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 pb-4 lg:pb-0">
      {/* Dropdown */}
      <Select
        defaultValue=">60days"
        placeholder="Select Date Range"
        className="rounded-2xl w-64"
        onChange={handleDateRangeChange}
        prefix={
          <Image
            src="/images/calendar.png"
            alt="Calendar"
            width={20}
            height={20}
            priority
          />
        }
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
