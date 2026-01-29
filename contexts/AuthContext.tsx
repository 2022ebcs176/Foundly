import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import type { User } from "../types/api.types";
import { getUserData } from "../utils/storage";

type AuthContextType = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean;
};

const noopAsync = async () => {};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: noopAsync,
  logout: noopAsync,
  isLoading: false,
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load persisted user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await getUserData();
        if (savedUser) {
          setUser(savedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error loading persisted user:", error);
      }
    };
    loadUser();
  }, []);

  const login = async (u: User) => {
    setIsLoading(true);
    try {
      setUser(u);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clear local state even if logout fails
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
