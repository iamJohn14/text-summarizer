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

export interface Filter {
  search?: string;
  date?: string;
}
export interface ViewStore {
  selectedView: string;
  currentPage: number;
  filter: {
    date: string;
    search: string;
  };
  trigger: boolean;
  setSelectedView: (view: string) => void;
  setCurrentPage: (page: number) => void;
  setFilter: (filter: { date: string; search: string }) => void;
  setTrigger: (value: boolean) => void;
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
  createdAt: Date;
}

export interface SummaryStore {
  summaries: Summary[];
  total: number;
  totalDoc: number;
  setSummaries: (data: { summaries: Summary[]; total: number }) => void;
  setTotalDoc: (count: number) => void;
  forEdit: number | null;
  setForEdit: (index: number | null) => void;
}

export interface OptionsMenuProps {
  summary: any; // Define the type of summary as per your data
}
