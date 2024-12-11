import { OpenAI, OpenAIError } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

// Function to generate a summary using OpenAI's GPT model
export async function generateSummary(content: string): Promise<string> {
  const retryLimit = 3;
  let attempt = 0;
  while (attempt < retryLimit) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Please summarize the following content: ${content}`,
          },
        ],
      });
      const summary = response.choices[0].message?.content;
      return summary || "Summary not available.";
    } catch (error: unknown) {
      // Check if the error is an instance of OpenAIError or has the structure we expect
      if (isOpenAIError(error)) {
        // Log the error to inspect the full structure
        console.error("Error generating summary:", error);

        // Handle specific OpenAI error types like quota exceeded (or others)
        if (
          "message" in error &&
          error.message.includes("insufficient_quota")
        ) {
          if (attempt < retryLimit - 1) {
            attempt++;
            console.log(
              `Quota exceeded. Retrying (${attempt}/${retryLimit})...`
            );
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Retry after 5 seconds
          } else {
            return "Quota exceeded, please try again later.";
          }
        }
        return "Error generating summary due to OpenAI error.";
      } else {
        console.error("Unknown error:", error);
        return "Error generating summary.";
      }
    }
  }
  return "Error generating summary after multiple attempts.";
}

// Type guard to check if the error is an instance of OpenAIError
function isOpenAIError(error: unknown): error is OpenAIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: string }).message === "string"
  );
}
