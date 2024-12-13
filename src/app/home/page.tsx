"use client";
import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/MainContent/MainContent";

const MainPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-auto lg:h-[calc(100vh-3rem)] max-h-auto rounded-3xl shadow-md bg-white overflow-hidden m-6 border border-[#DEE0E3]">
      {/* Sidebar with fixed width on large screens, full width on small screens */}
      <div className="w-full md:w-96 bg-gray-900">
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
