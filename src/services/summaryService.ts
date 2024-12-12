// services/summaryService.ts
import prisma from "../lib/prisma";

// Add a new summary
export async function addSummary(
  content: string,
  summary: string,
  userId: number
) {
  const newSummary = await prisma.summary.create({
    data: {
      content,
      summary,
      userId,
    },
  });
  return newSummary;
}

// Get all summaries by userId, with optional date range filtering
export async function getSummariesByUser(userId: number, startDate?: Date) {
  const filters: { userId: number; createdAt?: { gte?: Date } } = {
    userId,
  };

  // Apply startDate filter if provided
  if (startDate) {
    filters.createdAt = { gte: startDate }; // greater than or equal to startDate
  }

  const summaries = await prisma.summary.findMany({
    where: filters,
    include: {
      user: true, // Fetch the related user data
    },
  });
  return summaries;
}

// Update an existing summary
export async function updateSummary(
  id: number,
  content: string,
  summary: string,
  userId: number
) {
  // Fetch the existing summary to check the user ID
  const existingSummary = await prisma.summary.findUnique({
    where: { id },
  });

  // Check if the summary exists and if the user is authorized to update it
  if (!existingSummary) {
    throw new Error("Summary not found");
  }

  if (existingSummary.userId !== userId) {
    throw new Error("You are not authorized to update this summary");
  }

  // Proceed with the update if the user is authorized
  const updatedSummary = await prisma.summary.update({
    where: { id },
    data: { content, summary },
  });

  return updatedSummary;
}

// Delete a summary by id
export async function deleteSummary(id: number, userId: number) {
  // Fetch the existing summary to check the user ID
  const existingSummary = await prisma.summary.findUnique({
    where: { id },
  });

  // Check if the summary exists and if the user is authorized to update it
  if (!existingSummary) {
    throw new Error("Summary not found");
  }

  if (existingSummary.userId !== userId) {
    throw new Error("You are not authorized to update this summary");
  }

  const deletedSummary = await prisma.summary.delete({
    where: { id },
  });

  return deletedSummary;
}

// Search summaries based on content or summary text for a specific user
export async function searchSummary(query: string, userId: number) {
  const summaries = await prisma.summary.findMany({
    where: {
      userId, // Ensure that the summaries belong to the specified user
      OR: [
        {
          content: {
            contains: query,
            mode: "insensitive", // Case-insensitive search for content
          },
        },
        {
          summary: {
            contains: query,
            mode: "insensitive", // Case-insensitive search for summary
          },
        },
      ],
    },
    include: {
      user: true, // Optionally include user data for each summary
    },
  });

  return summaries;
}
