import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getCurrentUser, isAuthenticated as checkIsAuthenticated, signOut as authSignOut, User } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      // Check if authenticated via token
      const authenticated = checkIsAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
      setUser(null);
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setIsAuth(false);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isAuth,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
