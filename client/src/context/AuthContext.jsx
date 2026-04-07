import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiUrl } from "../lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "snapjuice_token";
const USER_KEY = "snapjuice_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const authFetch = useCallback(
    (path, options = {}) => {
      const headers = { ...options.headers };
      if (token) headers.Authorization = `Bearer ${token}`;
      return fetch(apiUrl(path), { ...options, headers });
    },
    [token]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isLoggedIn: Boolean(token),
      login,
      logout,
      authFetch,
    }),
    [token, user, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
