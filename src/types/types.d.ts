import { NextApiRequest } from "next";
import { JwtPayload } from "jsonwebtoken";

// Extend the NextApiRequest type to include the user property
export interface NextApiRequestWithUser extends NextApiRequest {
  user?: JwtPayload; // Add user field to the request
}

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  id: number;
}
