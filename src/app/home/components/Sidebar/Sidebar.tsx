import React, { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";

const Sidebar = () => {
  const userStore = useUserStore();
  const account = userStore.user;

  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const initials =
    account.firstName && account.lastName
      ? account.firstName.charAt(0).toUpperCase() +
        account.lastName.charAt(0).toUpperCase()
      : "";

  // Handle logout click
  const handleLogout = () => {
    console.log("User logged out");
    // Add your logout logic here (e.g., clearing user session, redirecting, etc.)
  };

  return (
    <div className="bg-[#14151A] h-auto sm:h-screen flex flex-col text-white p-5 sm:p-6 md:p-8">
      {/* Profile section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-purple-600 text-white rounded-full p-3 mr-4 text-lg">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {account.firstName} {account.lastName}
            </p>
            <p className="text-md text-gray-400">{account.email}</p>
          </div>
        </div>

        <Image
          src="/images/logout.png"
          alt="Logout"
          width={45}
          height={45}
          className="cursor-pointer hover:opacity-80"
          priority
          onClick={handleLogout}
        />
      </div>

      {/* Navigation section */}
      <div className="flex flex-col space-y-6">
        {/* Summarize Text button */}
        <button className="bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 w-full mx-auto">
          + Summarize Text
        </button>

        {/* Home section with logo on the left */}
        <div
          className={`flex items-center space-x-3 cursor-pointer ${
            activeItem === "home" ? "bg-gray-700" : ""
          } hover:bg-gray-600 rounded-md p-2 transition-all`}
          onClick={() => handleItemClick("home")}
        >
          <Image src="/images/home.png" alt="Home" width={24} height={24} />
          <span className={`text-xl`}>Home</span>
        </div>

        {/* History section with logo on the left */}
        <div
          className={`flex items-center space-x-3 cursor-pointer ${
            activeItem === "history" ? "bg-gray-700" : ""
          } hover:bg-gray-600 rounded-md p-2 transition-all`}
          onClick={() => handleItemClick("history")}
        >
          <Image
            src="/images/history.png"
            alt="History"
            width={24}
            height={24}
          />
          <span className={`text-xl`}>History</span>
          <span className={`bg-blue-500 text-white text-xs px-2 rounded-full}`}>
            15
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
