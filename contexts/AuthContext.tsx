/**
 * Authentication Context for Foundly App
 * Provides global authentication state and actions
 */

import { useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as authService from '../services/auth.service';
import type { LoginRequest, RegisterRequest, User } from '../types/api.types';
import { ApiError } from '../utils/api';
import { checkAuth, getAuthData } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Protected route navigation
  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = segments[0] === 'login';
    const isRegisterPage = segments[0] === 'register';

    if (!isAuthenticated) {
      // User is not authenticated
      if (!isLoginPage && !isRegisterPage && segments.length > 0) {
        // Redirect to login if trying to access protected routes
        router.replace('/login');
      }
    } else {
      // User is authenticated
      if (isLoginPage || isRegisterPage) {
        // Redirect to home if on auth pages
        router.replace('/home');
      }
    }
  }, [isAuthenticated, segments, isLoading, router]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const authenticated = await checkAuth();
      
      if (authenticated) {
        const { user: userData } = await getAuthData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        router.replace('/home');
      } else {
        throw new ApiError(response.message || 'Login failed');
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        router.replace('/home');
      } else {
        throw new ApiError(response.message || 'Registration failed');
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force logout locally even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { user: userData } = await getAuthData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
