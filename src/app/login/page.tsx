"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types/types";
import { useRouter } from "next/navigation";
import { useSummaryStore } from "@/stores/summaryStore";
import { Button, Input } from "antd";
import { openNotification } from "@/utils/notification";
import Spinner from "@/utils/spinner";
import { useViewStore } from "@/stores/viewStore";

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, login } = useUserStore();
  const { setSummaries, setTotalDoc } = useSummaryStore();
  const { setCurrentPage } = useViewStore();
  const router = useRouter();

  // Check if the user is already authenticated and redirect if true
  useEffect(() => {
    if (user?.id) {
      router.push("/home");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    setIsLoading(true);
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
        login({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
        });

        // Fetch summaries to get total summaries
        const summaryTotalResponse = await axios.get("/api/summary", {
          params: { date: ">60days" },
        });

        // Fetch summaries for default "Today"
        const summaryResponse = await axios.get("/api/summary", {
          params: { date: "today" },
        });

        // Optionally, handle the summary data
        if (
          summaryResponse.status === 200 &&
          summaryTotalResponse.status === 200
        ) {
          const summaries = summaryResponse.data;

          // Store summaries if needed in the store or use them in the component
          setSummaries({
            summaries,
            total: summaries.length,
          });
          setTotalDoc(summaryTotalResponse.data.length);
          setCurrentPage(1);

          // Redirect to the home page
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
      } else {
        console.error("Login failed:", error);
        openNotification("error", "Login failed", "Please try again later.");
      }
    } finally {
      // Ensure loading is stopped even if there is an error or success
      setIsLoading(false);
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

          <div className="space-4 md:mx-10">
            <form onSubmit={handleLogin}>
              {/* Username Input */}
              <div>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="my-2 py-3 rounded-2xl text-lg"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="my-2 py-3 rounded-2xl text-lg"
                  required
                />
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  htmlType="submit"
                  color="default"
                  variant="solid"
                  onClick={handleLogin}
                  className="w-full font-semibold my-2 py-6 rounded-2xl text-lg"
                >
                  Log in {isLoading && <Spinner mr-2 />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
