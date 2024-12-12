import React, { useState, useEffect } from "react";
import { Pagination } from "antd";

const HistoryPagination = () => {
  const totalItems = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(totalItems / 3);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Pagination
      current={currentPage}
      total={totalPages}
      pageSize={3}
      onChange={handlePageChange}
      itemRender={(page, type) => {
        if (type === "page") {
          return (
            <a
              onClick={() => handlePageChange(page)}
              className={`ant-pagination-item ${
                page === currentPage ? "ant-pagination-item-active" : ""
              }`}
            >
              {page}
            </a>
          );
        }
        return null;
      }}
    />
  );
};

export default HistoryPagination;
