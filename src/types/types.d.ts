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
  currentPage: number;
  total: number;
  setSelectedView: (view: string) => void;
  setCurrentPage: (page: number) => void;
  setTotal: (total: number) => void;
}

export interface UserParameter {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}

export interface UserStore {
  user: UserParameter;
  login: (userData: UserParameter) => void;
  logout: () => void;
}

export interface HistoryEntry {
  content: string;
  summary: string;
  createdAt: string;
  wordCount: number;
  charCount: number;
}

export interface TokenPayload {
  id: string;
  username: string;
}

export interface Summary {
  id: number;
  content: string;
  summary: string;
  wordCount: number;
  charCount: number;
}

export interface SummaryStore {
  summaries: Summary[];
  total: string;
  setSummaries: (data: { summaries: Summary[]; total: string }) => void;
}
