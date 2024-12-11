"use client";
import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/MainContent/MainContent";

const MainPage = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:h-auto h-screen">
      {/* Sidebar with fixed width on large screens, full width on small screens */}
      <div className="w-full sm:w-96 bg-gray-900">
        <Sidebar />
      </div>

      {/* Main Content takes remaining width */}
      <div className="flex-grow w-full">
        <MainContent />
      </div>
    </div>
  );
};

export default MainPage;
