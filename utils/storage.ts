/**
 * Local Storage Utilities for Foundly App
 * Uses AsyncStorage for persistent data storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/api.types';

// Storage keys
const STORAGE_KEYS = {
  USERNAME: 'foundly_username',
  USER_DATA: 'foundly_user_data',
} as const;

/**
 * Save username (used as API key)
 */
export const saveUsername = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.error('Error saving username:', error);
    throw error;
  }
};

/**
 * Get saved username
 */
export const getUsername = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
  } catch (error) {
    console.error('Error getting username:', error);
    return null;
  }
};

/**
 * Save user data
 */
export const saveUserData = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get saved user data
 */
export const getUserData = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear all auth data (logout)
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USERNAME,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const username = await getUsername();
  return username !== null;
};
