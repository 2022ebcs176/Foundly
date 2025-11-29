/**
 * Authentication Service for Foundly App
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS } from '../constants/api';
import type {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from '../types/api.types';
import { post } from '../utils/api';
import { logout as logoutUtil, setAuthData } from '../utils/auth';

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    // Store authentication data
    if (response.success && response.data) {
      await setAuthData(
        response.data.token,
        response.data.user,
        response.data.refreshToken
      );
    }

    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      userData
    );

    // Store authentication data
    if (response.success && response.data) {
      await setAuthData(
        response.data.token,
        response.data.user,
        response.data.refreshToken
      );
    }

    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint (optional, for token invalidation)
    try {
      await post(API_ENDPOINTS.auth.logout);
    } catch {
      // Continue with local logout even if backend call fails
      console.warn('Backend logout failed, continuing with local logout');
    }

    // Clear local authentication data
    await logoutUtil();
  } catch (error: any) {
    throw error;
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await post<AuthResponse>(API_ENDPOINTS.auth.refresh);

    // Update stored token
    if (response.success && response.data) {
      await setAuthData(
        response.data.token,
        response.data.user,
        response.data.refreshToken
      );
    }

    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Verify current authentication token
 */
export const verifyAuth = async (): Promise<boolean> => {
  try {
    const response = await post<ApiResponse<{ valid: boolean }>>(
      '/auth/verify'
    );
    return response.success && response.data?.valid === true;
  } catch {
    return false;
  }
};
