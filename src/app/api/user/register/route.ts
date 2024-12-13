"use client";
import { NextRequest, NextResponse } from "next/server";
import { addUser } from "@/services/userService";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body (since it's a Next.js 14 handler)
    const { username, password, firstName, lastName, email } = await req.json();

    // Ensure all required fields are provided
    if (!username || !password || !firstName || !lastName || !email) {
      return NextResponse.json(
        {
          error:
            "Username, password, first name, last name, and email are required",
        },
        { status: 400 }
      );
    }

    // Attempt to create a new user
    const newUser = await addUser(
      username,
      password,
      firstName,
      lastName,
      email
    );

    // If successful, return the new user details or a success message
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    console.error(error);

    // If it's an instance of an Error, return a detailed message
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "An error occurred during user creation",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "An unknown error occurred during user creation",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
