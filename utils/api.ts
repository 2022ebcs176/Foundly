/**
 * API Utilities for Foundly App
 * Handles HTTP requests and authentication
 */

import { API_BASE_URL } from '../constants/api';
import { getUsername } from './storage';

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
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get username for authentication (X-API-KEY header)
  const username = await getUsername();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(username && { 'X-API-KEY': username }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle text responses (backend returns plain text for auth endpoints)
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (isJson) {
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = (data as any)?.message || `API Error: ${response.statusText}`;
        throw new ApiError(errorMessage, response.status);
      }
      
      return data as T;
    } else {
      // Plain text response
      const text = await response.text();
      
      if (!response.ok) {
        throw new ApiError(text || `API Error: ${response.statusText}`, response.status);
      }
      
      return text as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing error
    if (error instanceof TypeError) {
      throw new ApiError('Network request failed. Please check your connection.', 0);
    }
    
    throw new ApiError('An unexpected error occurred', 0);
  }
}

/**
 * HTTP method helpers
 */
export const api = {
  get: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),
  
  post: <T = any>(endpoint: string, data?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }),
  
  put: <T = any>(endpoint: string, data?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    }),
  
  delete: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};
