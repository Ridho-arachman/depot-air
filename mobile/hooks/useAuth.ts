import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  setToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync("token", token);
      set({ token, isAuthenticated: true });
    } else {
      await SecureStore.deleteItemAsync("token");
      set({ token: null, isAuthenticated: false });
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    set({ token: null, isAuthenticated: false });
  },
}));
