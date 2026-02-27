/**
 * Local Storage Utilities for Foundly App
 * Uses AsyncStorage for persistent data storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "../types/api.types";

// Storage keys
const STORAGE_KEYS = {
  USERNAME: "foundly_username",
  USER_DATA: "foundly_user_data",
  ITEM_TYPE_MAP: "foundly_item_type_map",
} as const;

type ItemPostType = "lost" | "found";

/**
 * Save username (used as API key)
 */
export const saveUsername = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.error("Error saving username:", error);
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
    console.error("Error getting username:", error);
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
    console.error("Error saving user data:", error);
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
    console.error("Error getting user data:", error);
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
    console.error("Error clearing auth data:", error);
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

/**
 * Save local post type mapping for an item ID
 */
export const saveItemPostType = async (
  itemId: number,
  type: ItemPostType,
): Promise<void> => {
  try {
    const existingMap = await getItemPostTypeMap();
    const updatedMap = {
      ...existingMap,
      [itemId]: type,
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.ITEM_TYPE_MAP,
      JSON.stringify(updatedMap),
    );
  } catch (error) {
    console.error("Error saving item post type:", error);
  }
};

/**
 * Get all saved item post type mappings
 */
export const getItemPostTypeMap = async (): Promise<
  Record<string, ItemPostType>
> => {
  try {
    const rawMap = await AsyncStorage.getItem(STORAGE_KEYS.ITEM_TYPE_MAP);
    return rawMap ? JSON.parse(rawMap) : {};
  } catch (error) {
    console.error("Error getting item post type map:", error);
    return {};
  }
};

/**
 * Get saved post type for a single item
 */
export const getItemPostType = async (
  itemId: number,
): Promise<ItemPostType | null> => {
  const map = await getItemPostTypeMap();
  return map[itemId] ?? null;
};
