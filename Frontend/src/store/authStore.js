import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5001/api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isAdmin: false,
  isCheckingAuth: true,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });
      set({
        user: response.data.user,
        isAdmin: user.isAdmin,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      set({
        isAuthenticated: true,
        user: user,
        isAdmin: user.isAdmin,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      localStorage.removeItem("authToken");
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        return;
      }
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        user: response.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      localStorage.removeItem("authToken");
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
}));
