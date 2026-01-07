/**
 * API Configuration for Foundly App
 * Backend: Spring Boot on port 9292
 */

import { Platform } from 'react-native';

// Platform-aware base URL configuration
const getBaseUrl = () => {
  // Use hosted backend for both dev and production. If you need to
  // override during local development, change this value or add
  // environment-based logic here.
  return 'https://foundly-backend.onrender.com';
};

export const API_BASE_URL = getBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  
  // Found Items endpoints
  foundItems: {
    post: '/api/found-items/post',
    getAll: '/api/found-items/all',
    search: '/api/found-items/search',
    getByUser: (username: string) => `/api/found-items/user/${username}`,
    getCategories: '/api/found-items/categories',
    claim: (id: number) => `/api/found-items/${id}/claim`,
  },
};
