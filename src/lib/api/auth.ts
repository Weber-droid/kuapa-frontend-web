import type { User, ApiResponse, LoginFormData, SignupFormData } from "@/types";

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database (in-memory)
const mockUsers: Map<string, User & { password: string }> = new Map();

// Initialize with a demo user
mockUsers.set("demo@kuapa.com", {
  id: "user_demo",
  email: "demo@kuapa.com",
  password: "demo1234",
  name: "Kofi Mensah",
  phone: "+233 24 123 4567",
  avatar: "",
  farmName: "Mensah Cocoa Farm",
  location: "Ashanti Region, Ghana",
  cropTypes: ["cocoa", "cassava", "plantain"],
  preferredLanguage: "en",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
});

export const authApi = {
  // Login with email and password
  async login(data: LoginFormData): Promise<ApiResponse<User>> {
    await delay(1000);

    const user = mockUsers.get(data.email);

    if (!user) {
      return {
        success: false,
        error: "No account found with this email address",
      };
    }

    if (user.password !== data.password) {
      return {
        success: false,
        error: "Incorrect password",
      };
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
      message: "Login successful",
    };
  },

  // Register new user
  async signup(data: SignupFormData): Promise<ApiResponse<User>> {
    await delay(1500);

    // Check if email already exists
    if (mockUsers.has(data.email)) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Validate password
    if (data.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone || "",
      avatar: "",
      farmName: data.farmName || "",
      location: data.location || "",
      cropTypes: data.cropTypes,
      preferredLanguage: "en",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.set(data.email, newUser);

    const { password, ...userWithoutPassword } = newUser;
    return {
      success: true,
      data: userWithoutPassword,
      message: "Account created successfully",
    };
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    await delay(1000);

    const user = mockUsers.get(email);

    // Always return success for security (don't reveal if email exists)
    return {
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link",
    };
  },

  // Reset password with token
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<null>> {
    await delay(1000);

    // In a real app, validate the token
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    return {
      success: true,
      message: "Password reset successfully",
    };
  },

  // Update user profile
  async updateProfile(
    userId: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> {
    await delay(800);

    // Find user by ID
    let foundUser: (User & { password: string }) | undefined;
    let userEmail: string | undefined;

    for (const [email, user] of mockUsers.entries()) {
      if (user.id === userId) {
        foundUser = user;
        userEmail = email;
        break;
      }
    }

    if (!foundUser || !userEmail) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Update user data
    const updatedUser = {
      ...foundUser,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // If email changed, update the key
    if (data.email && data.email !== userEmail) {
      mockUsers.delete(userEmail);
      mockUsers.set(data.email, updatedUser);
    } else {
      mockUsers.set(userEmail, updatedUser);
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return {
      success: true,
      data: userWithoutPassword,
      message: "Profile updated successfully",
    };
  },

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<null>> {
    await delay(800);

    // Find user by ID
    let foundUser: (User & { password: string }) | undefined;
    let userEmail: string | undefined;

    for (const [email, user] of mockUsers.entries()) {
      if (user.id === userId) {
        foundUser = user;
        userEmail = email;
        break;
      }
    }

    if (!foundUser || !userEmail) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (foundUser.password !== currentPassword) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters",
      };
    }

    foundUser.password = newPassword;
    foundUser.updatedAt = new Date().toISOString();
    mockUsers.set(userEmail, foundUser);

    return {
      success: true,
      message: "Password changed successfully",
    };
  },

  // Mock Google OAuth login
  async loginWithGoogle(): Promise<ApiResponse<User>> {
    await delay(1500);

    // Simulate Google OAuth returning user info
    const googleUser: User = {
      id: `user_google_${Date.now()}`,
      email: "farmer@gmail.com",
      name: "Ama Asante",
      phone: "",
      avatar: "",
      farmName: "",
      location: "Greater Accra, Ghana",
      cropTypes: ["maize", "tomato"],
      preferredLanguage: "en",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: googleUser,
      message: "Google login successful",
    };
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    await delay(300);
    return {
      success: true,
      message: "Logged out successfully",
    };
  },
};
