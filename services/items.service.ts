/**
 * Items Service for Foundly App
 * Handles all item/post-related API calls (Spring Boot Backend)
 */

import { API_ENDPOINTS } from '../constants/api';
import type {
    ApiResponse,
    CreateItemRequest,
    FoundItem,
    GetItemsRequest,
    Item,
    ItemResponse,
    ItemsResponse,
    SearchRequest,
    SearchResponse,
    UpdateItemRequest
} from '../types/api.types';
import { deleteRequest, get, post, put } from '../utils/api';

/**
 * Get all found items from Spring Boot backend
 */
export const getAllItems = async (params?: GetItemsRequest): Promise<ItemsResponse> => {
  try {
    // Call Spring Boot endpoint: GET /api/found-items/all
    const response = await get<FoundItem[]>(API_ENDPOINTS.items.getAll);
    
    // Convert Spring Boot FoundItem[] to our Item[]
    const items: Item[] = response.map((foundItem: FoundItem) => ({
      id: foundItem.id.toString(),
      title: foundItem.itemName,
      description: foundItem.itemDescription,
      category: foundItem.itemCategory,
      type: 'found' as const,
      status: 'active' as const,
      images: foundItem.itemImages,
      location: {
        address: foundItem.venue,
        city: foundItem.venue,
      },
      date: foundItem.date,
      userId: foundItem.postedBy,
      createdAt: `${foundItem.date}T${foundItem.time}`,
    }));

    // Apply client-side filtering if params provided
    let filteredItems = items;
    if (params?.type && params.type !== 'found') {
      filteredItems = [];
    }
    if (params?.category) {
      filteredItems = filteredItems.filter(item => 
        item.category.toLowerCase() === params.category?.toLowerCase()
      );
    }
    if (params?.search) {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(params.search!.toLowerCase()) ||
        item.description.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    return {
      success: true,
      data: {
        items: filteredItems,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: filteredItems.length,
          totalPages: Math.ceil(filteredItems.length / (params?.limit || 20)),
        },
      },
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Get single item by ID
 */
export const getItemById = async (id: string): Promise<ItemResponse> => {
  try {
    const numericId = parseInt(id, 10);
    const response = await get<ItemResponse>(API_ENDPOINTS.items.getById(numericId));
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Create new item (lost or found post)
 */
export const createItem = async (itemData: CreateItemRequest): Promise<ItemResponse> => {
  try {
    const response = await post<ItemResponse>(
      API_ENDPOINTS.items.create,
      itemData
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Update existing item
 */
export const updateItem = async (
  id: string,
  itemData: UpdateItemRequest
): Promise<ItemResponse> => {
  try {
    const numericId = parseInt(id, 10);
    const response = await put<ItemResponse>(
      API_ENDPOINTS.items.update(numericId),
      itemData
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Delete item
 */
export const deleteItem = async (id: string): Promise<ApiResponse> => {
  try {
    const numericId = parseInt(id, 10);
    const response = await deleteRequest<ApiResponse>(
      API_ENDPOINTS.items.delete(numericId)
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Search items using Spring Boot endpoint
 * GET /api/found-items/search?category=X&name=Y
 */
export const searchItems = async (params: SearchRequest): Promise<SearchResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Spring Boot expects 'name' and 'category' query params
    if (params.query) queryParams.append('name', params.query);
    if (params.category) queryParams.append('category', params.category);

    const endpoint = `${API_ENDPOINTS.items.search}?${queryParams.toString()}`;
    const response = await get<FoundItem[]>(endpoint);
    
    // Convert to SearchResponse format
    const items: Item[] = response.map((foundItem: FoundItem) => ({
      id: foundItem.id.toString(),
      title: foundItem.itemName,
      description: foundItem.itemDescription,
      category: foundItem.itemCategory,
      type: 'found' as const,
      status: 'active' as const,
      images: foundItem.itemImages,
      location: {
        address: foundItem.venue,
        city: foundItem.venue,
      },
      date: foundItem.date,
      userId: foundItem.postedBy,
      createdAt: `${foundItem.date}T${foundItem.time}`,
    }));

    return {
      success: true,
      data: {
        items,
        count: items.length,
      },
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Mark item as resolved
 */
export const resolveItem = async (id: string): Promise<ItemResponse> => {
  try {
    const response = await updateItem(id, { status: 'resolved' });
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Mark item as closed
 */
export const closeItem = async (id: string): Promise<ItemResponse> => {
  try {
    const response = await updateItem(id, { status: 'closed' });
    return response;
  } catch (error: any) {
    throw error;
  }
};
