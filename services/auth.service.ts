/**
 * Authentication Service for Foundly App
 * Handles user registration, login, and logout
 */

import { API_ENDPOINTS } from '../constants/api';
import type { LoginRequest, RegisterRequest, User } from '../types/api.types';
import { api } from '../utils/api';
import { clearAuthData, getUserData, saveUserData, saveUsername } from '../utils/storage';

export class AuthService {
  /**
   * Register a new user
   * Backend returns: "User Registered Successfully !" (plain text)
   */
  async register(data: RegisterRequest): Promise<string> {
    try {
      const message = await api.post<string>(
        API_ENDPOINTS.auth.register,
        data
      );
      
      // Backend returns plain text success message
      return message;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login a user
   * Backend returns: "Login Successfull !" (plain text)
   * We need to store the username from the request
   */
  async login(data: LoginRequest): Promise<User> {
    try {
      // Backend returns plain text success message: "Login Successfull !"
      await api.post<string>(
        API_ENDPOINTS.auth.login,
        data
      );
      
      // Backend returns plain text success message
      // We need to store the username (email is used as identifier)
      // Since backend doesn't return the username, we need to extract it from email
      // For now, we'll use the email prefix as username
      const username = data.email.split('@')[0];
      
      const user: User = {
        username: username,
        email: data.email,
      };
      
      // Save username (used as API key for authenticated requests)
      await saveUsername(username);
      
      // Save user data
      await saveUserData(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await clearAuthData();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current logged-in user
   */
  async getCurrentUser(): Promise<User | null> {
    return await getUserData();
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}

// Export singleton instance
export const authService = new AuthService();
