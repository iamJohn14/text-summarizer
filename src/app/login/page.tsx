"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { EyeIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types/types";
import { useRouter } from "next/navigation";
import { useSummaryStore } from "@/stores/summaryStore";
import { Input } from "antd";
import { openNotification } from "@/utils/notification";

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const userStore = useUserStore();
  const summaryStore = useSummaryStore();
  const router = useRouter();

  // Check if the user is already authenticated and redirect if true
  useEffect(() => {
    const user = userStore.user;

    if (user?.id) {
      router.push("/home");
    }
  }, [userStore, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend login API
      const response = await axios.post("api/user/login", {
        username,
        password,
      });

      if (response.status === 200) {
        openNotification(
          "success",
          "Login Successful",
          "You will be redirected shortly"
        );
        const { token, user }: { token: string; user: User } = response.data;

        // Store the token in cookies with secure flags
        document.cookie = `token=${token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; HttpOnly; Secure; SameSite=Lax`;

        // Update the store with the user data
        userStore.login({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
        });

        // Fetch additional user-related data after login (e.g., user history, profile data)
        const summaryResponse = await axios.get("/api/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { date: ">60days" },
        });

        // Optionally, handle the summary data
        if (summaryResponse.status === 200) {
          const summaries = summaryResponse.data;

          // Store summaries if needed in the store or use them in the component
          summaryStore.setSummaries({
            summaries,
            total: summaries.length,
          });

          router.push("/home");
        }
      }
    } catch (error) {
      // Check if the error is an instance of AxiosError
      if (axios.isAxiosError(error)) {
        // Safely access response data and message
        const errorMessage = error.response?.data?.details;
        const description =
          errorMessage === "Invalid Username"
            ? "The username you entered does not exist."
            : errorMessage === "Incorrect Password"
            ? "The password that you’ve entered is incorrect. Please try again."
            : "Please check the credentials and try again.";
        openNotification("error", errorMessage, description);
      }
      console.error(`Invalid credentials, please try again, ${error}`);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-xl">
        <div className="text-center">
          <div className="mb-6">
            <Image
              src="/images/logo.png"
              alt="Undetectable AI Logo"
              width={100}
              height={100}
              className="mx-auto"
              priority
            />
          </div>

          <h1 className="text-2xl font-semibold mb-4">
            Log in to Undetectable AI
          </h1>
          <p className="font-caption text-gray-500 text-xl mb-6">
            Enter your username and password to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#14151A] text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
