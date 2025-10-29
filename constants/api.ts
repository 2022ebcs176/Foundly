/**
 * API Configuration for Foundly App
 * This file contains API endpoints and configuration for backend integration
 */

// Base API URL - Update this when backend is ready
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Development
  : 'https://api.foundly.app/api'; // Production (placeholder)

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  
  // Items endpoints
  items: {
    getAll: '/items',
    getById: (id: string) => `/items/${id}`,
    create: '/items',
    update: (id: string) => `/items/${id}`,
    delete: (id: string) => `/items/${id}`,
    search: '/items/search',
  },
  
  // User endpoints
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    myPosts: '/user/posts',
    saved: '/user/saved',
  },
  
  // Upload endpoints
  upload: {
    image: '/upload/image',
  },
};

// API Configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Helper function to build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
