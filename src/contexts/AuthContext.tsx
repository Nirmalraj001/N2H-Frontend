import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Auth init failed", err);
        // localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {    
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login({ email, password });
    localStorage.setItem("token", token);
    setUser(user);
    init();
  };

  const register = async (name: string, email: string, password: string) => {
    const { user, token } = await authService.register({ name, email, password });
    localStorage.setItem("token", token);
    setUser(user);
    init();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await authService.changePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        changePassword,
        isAdmin: user?.role === "admin",
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
