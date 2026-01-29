/**
 * API Type Definitions for Foundly App
 */

// User registration request
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// User login request
export interface LoginRequest {
  email: string;
  password: string;
}

// User data stored locally
export interface User {
  username: string;
  email: string;
}

// Found Item from backend
export interface FoundItem {
  id: number;
  itemName: string;
  itemColor: string;
  itemDescription: string;
  itemHighlight: string;
  time: string;
  date: string;
  venue: string;
  postedBy: string;
  itemCategory: string;
  itemImages: string[];
}

// Create Found Item request - matches backend API exactly
export interface CreateFoundItemRequest {
  itemName: string; // Required
  itemColor: string; // Required
  itemDescription: string; // Required
  itemHighlight: string; // Required
  time?: string; // Optional - format: HH:mm (24-hour, e.g., "14:30")
  date?: string; // Optional - format: yyyy-MM-dd (e.g., "2024-01-21")
  venue: string; // Required
  postedBy: string; // Required - username
  itemCategory: string; // Required
  itemImages: string[]; // Required - array of URLs or base64
}

// Claim request
export interface ClaimRequest {
  contactPersonName: string;
  contactNumber: string;
  idProofNumber: string;
  meetingDate: string;
  meetingTime: string;
  adminName: string;
}

// Claim response
export interface Claim {
  id: number;
  contactPersonName: string;
  contactNumber: string;
  idProofNumber: string;
  meetingDate: string;
  meetingTime: string;
  adminName: string;
  claimerUsername: string;
  foundItem: FoundItem;
}

// Item type for UI (compatible with both mock data and API)
export interface Item {
  id: number;
  itemName: string;
  itemColor: string;
  itemDescription: string;
  itemHighlight: string;
  time: string;
  date: string;
  venue: string;
  postedBy: string;
  itemCategory: string;
  itemImages: string[];
  type?: "lost" | "found";
}
