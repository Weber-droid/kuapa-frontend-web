// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  farmName?: string;
  location?: string;
  cropTypes: CropType[];
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Crop types
export type CropType =
  | "cocoa"
  | "cassava"
  | "maize"
  | "plantain"
  | "rice"
  | "tomato"
  | "pepper"
  | "other";

export const CROP_LABELS: Record<CropType, string> = {
  cocoa: "Cocoa",
  cassava: "Cassava",
  maize: "Maize",
  plantain: "Plantain",
  rice: "Rice",
  tomato: "Tomato",
  pepper: "Pepper",
  other: "Other",
};

// Disease types
export interface Disease {
  id: string;
  name: string;
  scientificName?: string;
  affectedCrops: CropType[];
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: TreatmentInfo;
  prevention: string[];
  severity: "low" | "medium" | "high" | "critical";
  imageUrl?: string;
}

export interface TreatmentInfo {
  organic: string[];
  chemical: string[];
  cultural: string[];
}

// Scan types
export interface ScanResult {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  cropType: CropType;
  detectedDisease: Disease | null;
  confidence: number;
  isHealthy: boolean;
  recommendations: string[];
  createdAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface ScanState {
  currentScan: ScanResult | null;
  history: ScanResult[];
  isScanning: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  farmName?: string;
  location?: string;
  cropTypes: CropType[];
  agreeToTerms: boolean;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  farmName?: string;
  location?: string;
  cropTypes: CropType[];
  preferredLanguage: string;
}

// Dashboard stats
export interface DashboardStats {
  totalScans: number;
  healthyScans: number;
  diseasedScans: number;
  mostCommonDisease?: string;
  recentScans: ScanResult[];
  cropDistribution: Record<CropType, number>;
}

// Notification types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Offline sync types
export interface PendingScan {
  id: string;
  imageData: string;
  cropType: CropType;
  createdAt: string;
  syncStatus: "pending" | "syncing" | "failed";
}
