/**
 * API Utilities for Foundly App
 * Handles HTTP requests and authentication
 */

import { API_BASE_URL } from '../constants/api';
import { Logger } from './logger';
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
  // Log request start (do not await to avoid blocking)
  void Logger.debug('API request:start', {
    url,
    method: (config && (config.method || 'GET')),
    headers: config.headers,
    bodyPreview: typeof config.body === 'string' ? (config.body as string).slice(0, 200) : undefined,
  });

  try {
    const response = await fetch(url, config);
    // Log status
    void Logger.info('API response:status', { url, status: response.status });
    
    // Handle text responses (backend returns plain text for auth endpoints)
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (isJson) {
      const data = await response.json();
      void Logger.debug('API response:body', { url, status: response.status, bodyPreview: data && typeof data === 'object' ? JSON.stringify(data).slice(0, 1000) : String(data).slice(0,500) });
      
      if (!response.ok) {
        const errorMessage = (data as any)?.message || `API Error: ${response.statusText}`;
        void Logger.error('API error response', { url, status: response.status, body: data });
        throw new ApiError(errorMessage, response.status);
      }
      
      return data as T;
    } else {
      // Plain text response
      const text = await response.text();
      void Logger.debug('API response:text', { url, status: response.status, bodyPreview: text && String(text).slice(0, 1000) });
      
      if (!response.ok) {
        void Logger.error('API error response:text', { url, status: response.status, body: text });
        throw new ApiError(text || `API Error: ${response.statusText}`, response.status);
      }
      
      return text as T;
    }
  } catch (error) {
    void Logger.error('API request:failed', { url, error: (error as any)?.message ?? String(error) });
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
