"use client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logout } from "@/services/userService";

// This is the POST request handler for logging out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  try {
    // Call the logout service
    await logout();

    // Access the cookies object
    const cookieStore = cookies();

    // Remove the token cookie by setting its maxAge to 0 (which expires the cookie)
    cookieStore.set("token", "", {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      maxAge: -1, // Set the cookie to expire immediately
      sameSite: "strict", // Prevent CSRF attacks
      path: "/", // Make the cookie accessible to the entire domain
    });

    // Return the response indicating the user is logged out successfully
    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        error: "An error occurred during logout",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
