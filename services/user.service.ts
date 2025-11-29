/**
 * User Service for Foundly App
 * Handles user profile and user-related API calls
 */

import { API_ENDPOINTS } from '../constants/api';
import type {
    ItemsResponse,
    SavedItemsResponse,
    UpdateProfileRequest,
    UserProfileResponse
} from '../types/api.types';
import { get, put } from '../utils/api';

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await get<UserProfileResponse>(API_ENDPOINTS.user.profile);
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  profileData: UpdateProfileRequest
): Promise<UserProfileResponse> => {
  try {
    const response = await put<UserProfileResponse>(
      API_ENDPOINTS.user.updateProfile,
      profileData
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Get user's own posts (lost & found items)
 */
export const getUserPosts = async (): Promise<ItemsResponse> => {
  try {
    const response = await get<ItemsResponse>(API_ENDPOINTS.user.myPosts);
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Get user's saved/bookmarked items
 */
export const getSavedItems = async (): Promise<SavedItemsResponse> => {
  try {
    const response = await get<SavedItemsResponse>(API_ENDPOINTS.user.saved);
    return response;
  } catch (error: any) {
    throw error;
  }
};
