import { API_BASE_URL, API_CONFIG } from '../constants/api';
import type { ApiErrorResponse } from '../types/api.types';
import { checkInternetConnection } from './network';
import { clearAuthData, getAuthToken } from './storage';

/**
 * Custom error class for API errors
 */
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

/**
 * Generic API request handler with automatic token injection
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise with response data
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Check internet connection first
  const isConnected = await checkInternetConnection();
  if (!isConnected) {
    throw new ApiError('No internet connection', 0, 'NETWORK_ERROR');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token and add to headers
  const token = await getAuthToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...authHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      await clearAuthData();
      throw new ApiError(
        'Session expired. Please login again.',
        401,
        'UNAUTHORIZED'
      );
    }

    // Parse response
    const data = await response.json();

    // Check if response indicates failure
    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new ApiError(
        errorData.error?.message || `API Error: ${response.statusText}`,
        response.status,
        errorData.error?.code,
        errorData.error?.details
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing error
    if (error instanceof TypeError) {
      throw new ApiError('Network request failed. Please check your connection.', 0, 'NETWORK_ERROR');
    }
    
    throw new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
  }
};

/**
 * GET request helper
 */
export const get = <T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET', headers });
};

/**
 * POST request helper
 */
export const post = <T = any>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>
): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });
};

/**
 * PUT request helper
 */
export const put = <T = any>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>
): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers,
  });
};

/**
 * DELETE request helper
 */
export const deleteRequest = <T = any>(
  endpoint: string,
  headers?: Record<string, string>
): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE', headers });
};
