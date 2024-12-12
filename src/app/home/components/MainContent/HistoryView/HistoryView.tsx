import React from "react";
import { Input, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";

const HistoryView: React.FC = () => {
  const { Option } = Select;
  const handleDelete = () => {};

  const currentPage = 1;
  const total = 15;

  return (
    <div className="p-10 md:p-14 space-y-4">
      <div className="text-4xl font-bold">History</div>
      <div className="text-lg text-gray-500 font-caption">
        View previously summarized texts
      </div>

      {/* Search bar */}
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          {/* Dropdown */}
          <Select
            defaultValue="today"
            placeholder="Select Date Range"
            className="rounded-2xl w-64"
            onChange={(value) => console.log(`Selected: ${value}`)}
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
            <Option value=">60days"> {">"}60 Days Ago</Option>
          </Select>
        </div>
        <Input
          placeholder="Search"
          className="rounded-2xl w-96"
          prefix={<SearchOutlined className="text-gray-400" />}
        />
      </div>

      {/* History entries */}
      {/* <div className="mt-4 font-caption">
        {history.map((entry, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-4 border border-[#DEE0E3] rounded-2xl"
          >
            <div className="flex justify-between">
              <div>
                <p>{entry.text}</p>
                <p className="text-sm text-gray-500">{entry.date}</p>
                <p className="text-sm text-gray-500">
                  {entry.wordCount} words, {entry.charCount} characters
                </p>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div> */}

      {/* Pagination */}
      <div className="flex justify-between font-caption">
        <div className="text-gray-500">
          Show {currentPage} to 5 of {total} entries
        </div>
        <Pagination
          defaultCurrent={1}
          total={15}
          pageSize={5}
          // onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HistoryView;
