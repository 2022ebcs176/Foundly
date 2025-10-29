import { API_BASE_URL, API_CONFIG } from '../constants/api';
import { checkInternetConnection } from './network';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Generic API request handler
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
    throw new ApiError('No internet connection');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(
        `API Error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network request failed');
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
