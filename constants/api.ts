/**
 * API Configuration for Foundly App
 * This file contains API endpoints and configuration for backend integration
 */

import { Platform } from 'react-native';

// Base API URL - Platform-specific configuration for Spring Boot backend
const getBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android Emulator uses special IP to access host machine
      return 'http://10.0.2.2:9292';
    } else if (Platform.OS === 'web') {
      // Web can use localhost
      return 'http://localhost:9292';
    } else {
      // iOS or other platforms - use local network IP
      // Update this with your actual local IP if testing on physical device
      return 'http://192.168.1.100:9292';
    }
  } else {
    // Production mode
    return 'https://api.foundly.app'; // Update with actual production URL
  }
};

export const API_BASE_URL = getBaseUrl();

// API Endpoints - Spring Boot Backend
export const API_ENDPOINTS = {
  // Auth endpoints (if you add authentication later)
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    verify: '/api/auth/verify',
  },
  
  // Found Items endpoints (Spring Boot)
  items: {
    getAll: '/api/found-items/all',
    getById: (id: number) => `/api/found-items/${id}`,
    create: '/api/found-items',
    update: (id: number) => `/api/found-items/${id}`,
    delete: (id: number) => `/api/found-items/${id}`,
    search: '/api/found-items/search', // Query params: category, name
  },
  
  // User endpoints (if you add user management later)
  user: {
    profile: '/api/user/profile',
    updateProfile: '/api/user/profile',
    myPosts: '/api/user/posts',
    saved: '/api/user/saved',
  },
  
  // Upload endpoints (if you add image upload later)
  upload: {
    image: '/api/upload/image',
    images: '/api/upload/images',
  },
};

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/**
 * Helper function to build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
