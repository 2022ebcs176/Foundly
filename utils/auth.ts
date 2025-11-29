/**
 * Authentication Utility for Foundly App
 * Handles token management, validation, and auth helpers
 */

import type { User } from '../types/api.types';
import {
    clearAuthData,
    getAuthToken,
    getRefreshToken,
    getUserData,
    isAuthenticated,
    storeAuthToken,
    storeRefreshToken,
    storeUserData,
} from './storage';

/**
 * Set authentication data after successful login
 */
export const setAuthData = async (
  token: string,
  user: User,
  refreshToken?: string
): Promise<void> => {
  try {
    await storeAuthToken(token);
    await storeUserData(user);
    if (refreshToken) {
      await storeRefreshToken(refreshToken);
    }
  } catch (error) {
    console.error('Error setting auth data:', error);
    throw new Error('Failed to save authentication data');
  }
};

/**
 * Get current authentication data
 */
export const getAuthData = async (): Promise<{
  token: string | null;
  user: User | null;
  refreshToken: string | null;
}> => {
  try {
    const [token, user, refreshToken] = await Promise.all([
      getAuthToken(),
      getUserData(),
      getRefreshToken(),
    ]);

    return { token, user, refreshToken };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, user: null, refreshToken: null };
  }
};

/**
 * Clear all authentication data (logout)
 */
export const logout = async (): Promise<void> => {
  try {
    await clearAuthData();
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Check if user is authenticated
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    return await isAuthenticated();
  } catch (error) {
    console.error('Error checking auth:', error);
    return false;
  }
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = async (): Promise<Record<string, string>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error('Error getting auth header:', error);
    return {};
  }
};

/**
 * Decode JWT token (basic decoding without verification)
 * Note: This is for client-side token inspection only
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as: (123) 456-7890 or similar based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleaned.length >= 10;
};
