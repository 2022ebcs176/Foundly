/**
 * API Type Definitions for Foundly App
 * Defines interfaces for all API requests and responses
 */

// ============= Auth Types =============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============= User Types =============
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: User;
}

// ============= Item Types =============
export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'resolved' | 'closed';

// Spring Boot Backend - Found Item Interface
export interface FoundItem {
  id: number;
  itemName: string;
  itemColor: string;
  itemDescription: string;
  itemHighlight: string;
  time: string; // Format: "15:30:00"
  date: string; // Format: "2025-11-03"
  venue: string;
  postedBy: string;
  itemCategory: string;
  itemImages: string[];
}

// Generic Item interface (for backward compatibility)
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: ItemType;
  status: ItemStatus;
  images: string[];
  location: {
    address: string;
    city: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  date: string; // Date when item was lost/found
  userId: string;
  user?: User;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// Helper function to convert Spring Boot FoundItem to generic Item
export const foundItemToItem = (foundItem: FoundItem): Item => ({
  id: foundItem.id.toString(),
  title: foundItem.itemName,
  description: foundItem.itemDescription,
  category: foundItem.itemCategory,
  type: 'found',
  status: 'active',
  images: foundItem.itemImages,
  location: {
    address: foundItem.venue,
    city: foundItem.venue,
  },
  date: foundItem.date,
  userId: foundItem.postedBy,
  createdAt: `${foundItem.date}T${foundItem.time}`,
});

export interface CreateItemRequest {
  title: string;
  description: string;
  category: string;
  type: ItemType;
  images?: string[];
  location: {
    address: string;
    city: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  date: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  category?: string;
  status?: ItemStatus;
  images?: string[];
  location?: {
    address: string;
    city: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  date?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface GetItemsRequest {
  type?: ItemType;
  category?: string;
  status?: ItemStatus;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface ItemsResponse {
  success: boolean;
  data: {
    items: Item[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ItemResponse {
  success: boolean;
  data: Item;
}

// ============= Upload Types =============
export interface UploadImageRequest {
  image: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
  };
}

// ============= Search Types =============
export interface SearchRequest {
  query: string;
  type?: ItemType;
  category?: string;
  city?: string;
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    items: Item[];
    count: number;
  };
}

// ============= Generic API Response =============
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ============= Error Types =============
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;

  constructor(message: string, statusCode?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// ============= Saved Items Types =============
export interface SavedItemsResponse {
  success: boolean;
  data: {
    items: Item[];
  };
}

export interface SaveItemRequest {
  itemId: string;
}
