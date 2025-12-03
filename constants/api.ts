/**
 * API Configuration for Foundly App
 * Backend: Spring Boot on port 9292
 */

import { Platform } from 'react-native';

// Platform-aware base URL configuration
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
      // iOS or physical devices - use local network IP
      // Update this with your actual local IP if testing on physical device
      return 'http://192.168.1.100:9292';
    }
  } else {
    // Production mode
    return 'https://api.foundly.app'; // Update with actual production URL
  }
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
