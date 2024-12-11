import { NextApiResponse } from "next";
import { validateToken } from "@/utils/tokenUtils";
import { NextApiRequestWithUser } from "@/types/types";

export function authenticate(
  req: NextApiRequestWithUser, // Use the custom type
  res: NextApiResponse,
  next: () => void
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = validateToken(token); // Decode and verify the token
    req.user = user; // Assign user to the request
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message); // Log the error for debugging purposes
    }
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
