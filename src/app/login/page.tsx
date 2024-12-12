"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { EyeIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types/types";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const userStore = useUserStore();
  const router = useRouter();

  // Check if the user is already authenticated and redirect if true
  useEffect(() => {
    const user = userStore.user;

    if (user?.id) {
      router.push("/home");
    }
  }, [userStore, router]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend login API
      const response = await axios.post("api/user/login", {
        username,
        password,
      });

      if (response.status === 200) {
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

        router.push("/home");
      }
    } catch (error) {
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
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                className="mt-1 block w-full px-4 py-2 border border-[#DEE0E3] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="mt-1 block w-full px-4 py-2 border border-[#DEE0E3] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
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
