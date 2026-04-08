import { create } from "zustand";
import { apiRequest, setToken } from "../api/client";
import type { User, TokenResponse } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  register: (username: string, email: string, password: string, displayName: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,

  register: async (username, email, password, displayName) => {
    try {
      const data = await apiRequest<TokenResponse>("/auth/register", {
        method: "POST",
        body: { username, email, password, display_name: displayName },
      });
      setToken(data.access_token);
      set({ user: data.user, isAuthenticated: true, error: null });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  login: async (username, password) => {
    try {
      const data = await apiRequest<TokenResponse>("/auth/login", {
        method: "POST",
        body: { username, password },
      });
      setToken(data.access_token);
      set({ user: data.user, isAuthenticated: true, error: null });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  logout: () => {
    setToken(null);
    set({ user: null, isAuthenticated: false, error: null });
  },
}));
