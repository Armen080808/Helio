import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  type AuthUser,
} from "@/services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("helio_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    localStorage.setItem("helio_token", data.access_token);
    localStorage.setItem("helio_user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await registerRequest(name, email, password);
      localStorage.setItem("helio_token", data.access_token);
      localStorage.setItem("helio_user", JSON.stringify(data.user));
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem("helio_token");
      localStorage.removeItem("helio_user");
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
