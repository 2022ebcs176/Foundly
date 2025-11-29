// /**
//  * Authentication Context for Foundly App
//  * Provides global authentication state and actions
//  */

// import { useRouter, useSegments } from 'expo-router';
// import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// import * as authService from '../services/auth.service';
// import type { LoginRequest, RegisterRequest, User } from '../types/api.types';
// import { post , ApiError } from '../utils/api';    // Updated By Bhavya !
// import { checkAuth, getAuthData } from '../utils/auth';

// // Added By Bhavya
// interface User {
//   id : string ;
//   email : string ;
//   name? : string ;
//   role? : string ;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (credentials: any) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Removed By Bhavya
// // interface AuthProviderProps {
// //   children: ReactNode;
// // }

// // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// export const AuthProvider = ({children} : {children : ReactNode}) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const segments = useSegments();

//   // Initialize auth state on mount
//   useEffect(() => {
//     if(isLoading) return ;
    
//     initializeAuth();
//   }, []);

//   // Protected route navigation
//   useEffect(() => {
//     if (isLoading) return;

//     const isLoginPage = segments[0] === 'login';
//     const isRegisterPage = segments[0] === 'register';

//     if (!isAuthenticated) {
//       // User is not authenticated
//       if (!isLoginPage && !isRegisterPage && segments.length > 0) {
//         // Redirect to login if trying to access protected routes
//         router.replace('/login');
//       }
//     } else {
//       // User is authenticated
//       if (isLoginPage || isRegisterPage) {
//         // Redirect to home if on auth pages
//         router.replace('/home');
//       }
//     }
//   }, [isAuthenticated, segments, isLoading, router]);

//   const initializeAuth = async () => {
//     try {
//       setIsLoading(true);
//       const authenticated = await checkAuth();
      
//       if (authenticated) {
//         const { user: userData } = await getAuthData();
//         if (userData) {
//           setUser(userData);
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//         }
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth initialization error:', error);
//       setIsAuthenticated(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (credentials: LoginRequest) => {
//     try {
//       setIsLoading(true);
//       const response = await authService.login(credentials);
      
//       if (response.success && response.data) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         router.replace('/home');
//       } else {
//         throw new ApiError(response.message || 'Login failed');
//       }
//     } catch (error: any) {
//       setIsAuthenticated(false);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: RegisterRequest) => {
//     try {
//       setIsLoading(true);
//       const response = await authService.register(userData);
      
//       if (response.success && response.data) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         router.replace('/home');
//       } else {
//         throw new ApiError(response.message || 'Registration failed');
//       }
//     } catch (error: any) {
//       setIsAuthenticated(false);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setIsLoading(true);
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//       router.replace('/login');
//     } catch (error: any) {
//       console.error('Logout error:', error);
//       // Force logout locally even if API call fails
//       setUser(null);
//       setIsAuthenticated(false);
//       router.replace('/login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     try {
//       const { user: userData } = await getAuthData();
//       if (userData) {
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Error refreshing user:', error);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     register,
//     logout,
//     refreshUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// /**
//  * Hook to use auth context
//  */
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };













/**
 * Authentication Context for Foundly App
 * Provides global authentication state and actions
 */

import { useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { post, ApiError } from '../utils/api'; 
// We assume you have these storage helpers. 
// If not, see the "Missing File" section below this code block.
import { setAuthToken, getAuthToken, removeAuthToken } from '../utils/storage'; 

// --- TYPES ---
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface LoginRequest {
  email: string;
  password?: string;
}

interface RegisterRequest {
  email: string;
  password?: string;
  name?: string;
  // Add other registration fields your Spring Boot expects
}

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true to check for existing token
  const router = useRouter();
  const segments = useSegments();

  // 1. Initialize auth state on mount (Check if user is already logged in)
  useEffect(() => {
    initializeAuth();
  }, []);

  // 2. Protected route navigation
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)'; // Adjust based on your folder structure
    const isLoginPage = segments[0] === 'login';
    const isRegisterPage = segments[0] === 'register';

    if (!isAuthenticated) {
      // If not logged in and not on login/register page, redirect to login
      if (!isLoginPage && !isRegisterPage) {
        // router.replace('/login'); // Uncomment this when you are ready to enforce protection
      }
    } else if (isAuthenticated) {
      // If logged in and on login page, redirect to home
      if (isLoginPage || isRegisterPage) {
        router.replace('/home');
      }
    }
  }, [isAuthenticated, segments, isLoading, router]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      // Check if we have a token saved from a previous session
      const token = await getAuthToken();
      
      if (token) {
        // Optional: Call an endpoint like /api/auth/me to validate token and get user details
        // For now, we just assume if token exists, they are authenticated
        setIsAuthenticated(true);
        // You might want to decode the JWT here to get the User object back
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

  // --- LOGIN FUNCTION ---
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      
      // CALL SPRING BOOT API
      const response = await post('/api/auth/login', credentials);
      
      console.log("Login Response:", response);

      // Adapt this check based on your exact JSON response
      // Scenario: Spring returns { token: "...", user: { ... } }
      if (response && (response.token || response.accessToken)) {
        
        // 1. Save Token
        const token = response.token || response.accessToken;
        await setAuthToken(token);

        // 2. Set User State
        if (response.user) {
          setUser(response.user);
        } else {
          // If backend only sends token, you might need to decode it or call /me
          setUser({ email: credentials.email, id: "1" }); // Fallback
        }

        setIsAuthenticated(true);
        router.replace('/home');
      } else {
        throw new ApiError('Invalid response from server');
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      
      // CALL SPRING BOOT API
      const response = await post('/api/auth/register', userData);

      if (response && (response.token || response.success)) {
        // Auto-login logic or redirect to login
        router.replace('/login');
      } else {
        throw new ApiError('Registration failed');
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      setIsLoading(true);
      // Remove token from storage
      await removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force logout locally even if error
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    // Logic to re-fetch user details if needed
    console.log("Refresh user triggered");
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
