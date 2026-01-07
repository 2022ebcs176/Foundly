/**
 * User Service
 * Provides helpers related to the currently-signed-in user
 */

import { getUsername } from '../utils/storage';
import { getItemsByUser, GetItemsResponse } from './items.service';

/**
 * Get posts/items for the currently signed-in user
 */
export async function getUserPosts(): Promise<GetItemsResponse> {
  try {
    const username = await getUsername();
    if (!username) {
      return {
        success: false,
        message: 'No username saved',
      };
    }

    return await getItemsByUser(username);
  } catch (error) {
    console.error('Error in getUserPosts:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user posts',
    };
  }
}
