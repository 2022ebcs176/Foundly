import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const noopAsync = async () => {};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: noopAsync,
  logout: noopAsync,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Placeholder: load persisted user if needed
  }, []);

  const login = async (u: User) => {
    setIsLoading(true);
    try {
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
