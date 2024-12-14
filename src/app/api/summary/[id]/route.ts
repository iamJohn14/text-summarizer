import { NextRequest, NextResponse } from "next/server";
import { deleteSummary, updateSummary } from "@/services/summaryService";
import { validateToken } from "@/utils/tokenUtils";
import { JwtPayload } from "jsonwebtoken";

// Handle PUT requests for updating a summary by ID
export async function PUT(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user using the token and extract the user ID from the token
    const decodedToken: JwtPayload = await validateToken(
      token?.value as string
    );

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(decodedToken.id);
    const id = req.nextUrl.pathname.split("/").pop() || "";

    if (!id) {
      return NextResponse.json(
        { error: "Summary ID is required" },
        { status: 400 }
      );
    }

    const { content, summary } = await req.json(); // Assuming the request body has 'content' and 'summary'

    // Validate the provided data
    if (!content || !summary) {
      return NextResponse.json(
        { error: "Content and summary are required" },
        { status: 400 }
      );
    }

    // Update the summary
    const updatedSummary = await updateSummary(
      Number(id),
      content,
      summary,
      userId
    );

    return NextResponse.json(updatedSummary, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handle DELETE requests for deleting a summary by ID
export async function DELETE(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user using the token and extract the user ID from the token
    const decodedToken: JwtPayload = await validateToken(
      token?.value as string
    );

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(decodedToken.id);
    const id = req.nextUrl.pathname.split("/").pop() || "";

    if (!id) {
      return NextResponse.json(
        { error: "Summary ID is required" },
        { status: 400 }
      );
    }

    // Delete the summary
    const deletedSummary = await deleteSummary(Number(id), userId);

    return NextResponse.json(deletedSummary, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
