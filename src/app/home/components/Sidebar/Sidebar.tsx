import React, { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useViewStore } from "@/stores/viewStore";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const userStore = useUserStore();
  const account = userStore.user;
  const router = useRouter();

  const { selectedView, setSelectedView } = useViewStore();

  useEffect(() => {
    if (account.id === null) {
      router.push("/login");
    }
  }, [router, account.id]);

  useEffect(() => {
    setSelectedView("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemClick = (item: string) => {
    setSelectedView(item);
  };

  const initials =
    account.firstName && account.lastName
      ? account.firstName.charAt(0).toUpperCase() +
        account.lastName.charAt(0).toUpperCase()
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

        // Redirect the user to the login page
        router.push("/login");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
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
              {account.firstName} {account.lastName}
            </p>
            <p className="text-md font-caption text-gray-500">
              {account.email}
            </p>
          </div>
        </div>

        <Image
          src="/images/logout.png"
          alt="Logout"
          width={45}
          height={45}
          className="cursor-pointer hover:opacity-80"
          onClick={handleLogout}
          priority
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
            selectedView === "home" ? "bg-gray-700" : ""
          } hover:bg-gray-600 rounded-md p-2 transition-all`}
          onClick={() => handleItemClick("home")}
        >
          <Image src="/images/home.png" alt="Home" width={24} height={24} />
          <span className={`text-xl`}>Home</span>
        </div>

        {/* History section with logo on the left */}
        <div
          className={`flex items-center space-x-3 cursor-pointer ${
            selectedView === "history" ? "bg-gray-700" : ""
          } hover:bg-gray-600 rounded-md p-2 transition-all`}
          onClick={() => handleItemClick("history")}
        >
          <Image
            src="/images/history.png"
            alt="History"
            width={24}
            height={24}
            priority
          />
          <span className={`text-xl`}>History</span>
          <span
            className={`bg-[#3368F04D] bg-opacity-30 border border-[#FFFFFF24] rounded-md text-white px-2 text-xl}`}
          >
            15
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
