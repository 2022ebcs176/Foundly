/**
 * Items Service for Foundly App
 * Handles found/lost items operations
 */

import { API_ENDPOINTS } from '../constants/api';
import type { CreateFoundItemRequest, FoundItem } from '../types/api.types';
import { api } from '../utils/api';

export interface GetItemsParams {
  type?: 'lost' | 'found';
  category?: string;
  search?: string;
}

export interface GetItemsResponse {
  success: boolean;
  data?: {
    items: FoundItem[];
    total: number;
  };
  message?: string;
}

/**
 * Get all items with optional filters
 */
export async function getAllItems(params?: GetItemsParams): Promise<GetItemsResponse> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      // Use search endpoint if search query exists
      queryParams.append('query', params.search);
      const items = await api.get<FoundItem[]>(
        `${API_ENDPOINTS.foundItems.search}?${queryParams.toString()}`
      );
      
      return {
        success: true,
        data: {
          items,
          total: items.length,
        },
      };
    }
    
    // Otherwise get all items
    const items = await api.get<FoundItem[]>(API_ENDPOINTS.foundItems.getAll);
    
    // Apply client-side filtering for type and category
    let filteredItems = items;
    
    if (params?.category) {
      filteredItems = filteredItems.filter(item => 
        item.itemCategory.toLowerCase() === params.category?.toLowerCase()
      );
    }
    
    return {
      success: true,
      data: {
        items: filteredItems,
        total: filteredItems.length,
      },
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch items',
    };
  }
}

/**
 * Get items posted by a specific user
 */
export async function getItemsByUser(username: string): Promise<GetItemsResponse> {
  try {
    const items = await api.get<FoundItem[]>(
      API_ENDPOINTS.foundItems.getByUser(username)
    );
    
    return {
      success: true,
      data: {
        items,
        total: items.length,
      },
    };
  } catch (error) {
    console.error('Error fetching user items:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user items',
    };
  }
}

/**
 * Post a new found item
 */
export async function postFoundItem(data: CreateFoundItemRequest): Promise<{
  success: boolean;
  data?: FoundItem;
  message?: string;
}> {
  try {
    const item = await api.post<FoundItem>(
      API_ENDPOINTS.foundItems.post,
      data
    );
    
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error('Error posting item:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to post item',
    };
  }
}

/**
 * Generic create item wrapper used by UI screens (post-found/post-lost)
 */
export async function createItem(data: CreateFoundItemRequest): Promise<{
  success: boolean;
  data?: FoundItem;
  message?: string;
}> {
  // For now, forward to postFoundItem (backend expects same payload)
  return postFoundItem(data);
}

/**
 * Get available categories
 */
export async function getCategories(): Promise<{
  success: boolean;
  data?: string[];
  message?: string;
}> {
  try {
    const categories = await api.get<string[]>(
      API_ENDPOINTS.foundItems.getCategories
    );
    
    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch categories',
    };
  }
}
