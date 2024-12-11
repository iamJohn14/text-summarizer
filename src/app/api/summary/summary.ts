import { NextApiRequest, NextApiResponse } from "next";
import {
  getSummariesByUser,
  addSummary,
  updateSummary,
  deleteSummary,
  searchSummary,
} from "@/services/summaryService";
import { generateSummary } from "@/services/openAIService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  switch (method) {
    case "GET":
      // Handle search queries or get summaries by user ID
      const { userId: queryUserId, startDate, searchQuery } = query;

      // If there is a search query, call the search function
      if (searchQuery) {
        const summaries = await searchSummary(
          searchQuery as string,
          Number(queryUserId)
        );
        return res.status(200).json(summaries);
      }

      // Otherwise, get summaries by user ID and optional start date
      if (!queryUserId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const start = startDate ? new Date(startDate as string) : undefined;
      const summaries = await getSummariesByUser(Number(queryUserId), start);
      return res.status(200).json(summaries);

    case "POST":
      // Add a new summary
      const { content, userId: postUserId } = body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      try {
        // Generate summary using OpenAI
        const summary = await generateSummary(content);

        // Save the summary to your database (e.g., Prisma)
        const newSummary = await addSummary(content, summary, postUserId);
        return res.status(201).json(newSummary);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
      }

    case "PUT":
      // Update an existing summary
      const { id, newContent, userId: putUserId } = body;

      if (!id || !newContent || !putUserId) {
        return res
          .status(400)
          .json({ error: "ID, new content, and User ID are required" });
      }

      try {
        // Generate the new summary if content has changed
        const updatedSummary = await generateSummary(newContent);

        // Update the summary in the database
        const updatedSummaryRecord = await updateSummary(
          id,
          newContent,
          updatedSummary,
          putUserId
        );
        return res.status(200).json(updatedSummaryRecord);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
      }

    case "DELETE":
      // Delete a summary by ID
      const { id: deleteId, userId: deleteUserId } = body;
      if (!deleteId || deleteUserId) {
        return res
          .status(400)
          .json({ error: "Summary ID and User ID are required" });
      }

      try {
        const deletedSummary = await deleteSummary(deleteId, deleteUserId);
        return res.status(200).json(deletedSummary);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
