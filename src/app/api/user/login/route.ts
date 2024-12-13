"use client";
import { NextRequest, NextResponse } from "next/server";
import { login } from "@/services/userService";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Get data from request body
    const { username, password } = await req.json();

    // Validate request body
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Attempt to login and get the token and user details
    const { token, user } = await login(username, password);

    // Access the cookies utility
    const cookieStore = cookies();

    // Set the token cookie using the correct format
    cookieStore.set("token", token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      maxAge: Infinity, // Cookie will not expire
      sameSite: "strict", // Prevent CSRF attacks
      path: "/", // Make the cookie accessible to the entire domain
    });

    // Return the response with user data and token
    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: `${error}`, details: (error as Error).message },
      { status: 401 }
    );
  }
}
