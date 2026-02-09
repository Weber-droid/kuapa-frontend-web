import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthState } from "@/types";

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  farmName?: string;
  location?: string;
  cropTypes: string[];
}

type AuthStore = AuthState & AuthActions;

// Mock user for demo purposes
const createMockUser = (email: string, name: string): User => ({
  id: `user_${Date.now()}`,
  email,
  name,
  phone: "",
  avatar: "",
  farmName: "",
  location: "Ashanti Region, Ghana",
  cropTypes: ["cocoa", "cassava"],
  preferredLanguage: "en",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation
        if (!email || !password) {
          set({ isLoading: false, error: "Email and password are required" });
          return false;
        }

        if (password.length < 6) {
          set({ isLoading: false, error: "Invalid credentials" });
          return false;
        }

        // Create mock user on successful login
        const user = createMockUser(email, email.split("@")[0]);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock validation
        if (!data.email || !data.password || !data.name) {
          set({
            isLoading: false,
            error: "Please fill in all required fields",
          });
          return false;
        }

        if (data.password.length < 8) {
          set({
            isLoading: false,
            error: "Password must be at least 8 characters",
          });
          return false;
        }

        // Create new user
        const user: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          name: data.name,
          phone: data.phone || "",
          farmName: data.farmName || "",
          location: data.location || "",
          cropTypes: data.cropTypes as User["cropTypes"],
          preferredLanguage: "en",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...data,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        // Auth state is automatically persisted, so just check if user exists
        const { user } = get();
        set({ isAuthenticated: !!user });
      },
    }),
    {
      name: "kuapa-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
