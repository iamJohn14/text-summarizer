import React, { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useViewStore } from "@/stores/viewStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSummaryStore } from "@/stores/summaryStore";
import { Button } from "antd";
import { HiMailOpen } from "react-icons/hi";
import { PiClockFill } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  const { totalDoc, setForEdit } = useSummaryStore();
  const { selectedView, setSelectedView, setTrigger } = useViewStore();
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user.id === null) {
      router.push("/login");
    }
  }, [router, user.id]);

  useEffect(() => {
    setSelectedView("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemClick = (item: string) => {
    setSelectedView(item);
  };

  const initials =
    user.firstName && user.lastName
      ? user.firstName.charAt(0).toUpperCase() +
        user.lastName.charAt(0).toUpperCase()
      : "";

  // Handle logout click
  const handleLogout = async () => {
    try {
      // Call the API to log out and delete the token from cookies
      const response = await axios.post("/api/user/logout");

      if (response.status === 200) {
        // Clear user data from the store
        useUserStore.getState().logout();

        // Optionally, clear any persisted data in localStorage or cookies
        localStorage.removeItem("user-storage");
        localStorage.removeItem("view-storage");
        localStorage.removeItem("summary-storage");

        // Redirect the user to the login page
        router.push("/login");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleSummarizeText = () => {
    setSelectedView("home");
    setTrigger(true);
    // Immediately set trigger to false after a short delay or as per your needs
    setTimeout(() => {
      setTrigger(false);
    }, 0);
    setForEdit(null);
  };

  return (
    <div className="bg-[#14151A] h-auto md:h-screen flex flex-col text-white p-5 md:p-6">
      {/* Profile section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-purple-600 text-white rounded-full p-3 mr-4 text-lg">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-md font-caption text-gray-500">{user.email}</p>
          </div>
        </div>

        <IoMdLogOut
          className="cursor-pointer hover:opacity-80 text-4xl"
          onClick={handleLogout}
        />
      </div>

      {/* Navigation section */}
      <div className="flex flex-col space-y-6">
        {/* Summarize Text button */}
        <Button
          onClick={handleSummarizeText}
          className="bg-white text-black p-6 rounded-md hover:bg-gray-200 w-full mx-auto text-md"
        >
          + Summarize Text
        </Button>

        {/* Home section with logo on the left */}
        <Button
          onClick={() => handleItemClick("home")}
          color="default"
          variant="solid"
          // className="p-6 justify-start text-xl side-button !bg-[transparent]"
          className={`p-6 justify-start text-xl side-button  ${
            selectedView === "home" ? "!bg-gray-700" : "!bg-transparent"
          } hover:bg-gray-600`}
          icon={<HiMailOpen className="text-3xl" />}
        >
          Home
        </Button>

        {/* History section with logo on the left */}
        <Button
          onClick={() => handleItemClick("history")}
          color="default"
          variant="solid"
          className={`p-6 justify-start text-xl side-button ${
            selectedView === "history" ? "!bg-gray-700" : "!bg-transparent"
          } hover:bg-gray-600`}
          icon={<PiClockFill className="text-3xl" />}
        >
          <>
            History
            <span
              className={`ml-2 bg-[#3368F04D] bg-opacity-30 border border-[#FFFFFF24] rounded-md text-white px-2 text-lg`}
            >
              {totalDoc}
            </span>
          </>
        </Button>

        {/* Home section with logo on the left */}
        {/* <div
          className={`flex items-center space-x-3 cursor-pointer ${
            selectedView === "home" ? "bg-gray-700" : ""
          } hover:bg-gray-600 rounded-md p-2 transition-all`}
          onClick={() => handleItemClick("home")}
        >
          <HiMailOpen />
          <span className={`text-xl`}>Home</span>
        </div> */}

        {/* History section with logo on the left */}
        {/* <div
          className={`flex items-center space-x-3 cursor-pointer ${
            selectedView === "history" ? "bg-gray-700" : ""
          } hover:bg-gray-600 rounded-md p-2 transition-all`}
          onClick={() => handleItemClick("history")}
        >
          <PiClockFill />
          <span className={`text-xl`}>History</span>
          <span
            className={`bg-[#3368F04D] bg-opacity-30 border border-[#FFFFFF24] rounded-md text-white px-2 text-xl}`}
          >
            {totalDoc}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
