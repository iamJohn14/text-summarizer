import { NextApiResponse } from "next";
import { validateToken } from "@/utils/tokenUtils";
import { NextApiRequestWithUser } from "@/types/types";
import { cookies } from "next/headers";
export function authenticate(
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: () => void
) {
  // Retrieve cookies from the request
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = tokenCookie.value;

  try {
    // Validate the token and decode user info
    const user = validateToken(token);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
