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

export interface ViewStore {
  selectedView: string;
  setSelectedView: (view: string) => void;
}

export interface UserParameter {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}

// Define the state structure for the store
export interface UserStore {
  user: UserParameter;
  login: (userData: UserParameter) => void;
  logout: () => void;
}
