import { NextRequest, NextResponse } from "next/server";
import {
  addSummary,
  getSummariesByUser,
  searchSummary,
} from "@/services/summaryService";
import { validateToken } from "@/utils/tokenUtils";
import { getStartDateForFilter } from "@/utils/dateUtils";
import { countChars, countWords } from "@/utils/textUtils";

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies (assuming token is stored there)
    const token = req.cookies.get("token");

    // Verify the user using the token and extract the user ID from the token
    const decodedToken = await validateToken(token.value);

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(decodedToken.id); // Extract the user ID from the decoded token
    const { date, search } = req.nextUrl.searchParams;

    let summaries;

    if (date) {
      const startDate = getStartDateForFilter(date);
      summaries = await getSummariesByUser(userId, startDate);
    } else if (search) {
      summaries = await searchSummary(search, userId);
    } else {
      summaries = await getSummariesByUser(userId);
    }

    const formattedSummaries = summaries.map((summary) => {
      const wordCount = countWords(summary.summary);
      const charCount = countChars(summary.summary);

      return {
        id: summary.id,
        content: summary.content,
        summary: summary.summary,
        charCount,
        wordCount,
      };
    });

    return NextResponse.json(formattedSummaries, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handle POST requests for adding a new summary
export async function POST(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("token");

    // Verify the user using the token and extract the user ID from the token
    const decodedToken = await validateToken(token.value);

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(decodedToken.id); // Extract the user ID from the decoded token

    const { content, summary } = await req.json(); // Assuming the request body has 'content' and 'summary'

    // Validate the provided data
    if (!content || !summary) {
      return NextResponse.json(
        { error: "Content and summary are required" },
        { status: 400 }
      );
    }

    // Add the new summary
    const newSummary = await addSummary(content, summary, userId);

    return NextResponse.json(newSummary, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
