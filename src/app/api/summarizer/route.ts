import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/services/openAIService";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    // Validate request body
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const summary = await generateSummary(content);

    // Return the summary in the response
    return NextResponse.json({ summary }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Error generating summary", details: (error as Error).message },
      { status: 500 }
    );
  }
}
