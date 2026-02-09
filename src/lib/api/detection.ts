import type { ScanResult, CropType, Disease } from "@/types";
import { diseases, getDiseasesByCrop } from "./diseases";

// Simulates AI disease detection
export const mockDetection = async (
  imageData: string,
  cropType: CropType
): Promise<ScanResult> => {
  // Simulate network delay and processing time
  await simulateProgress();

  // Get diseases for this crop type
  const cropDiseases = getDiseasesByCrop(cropType);

  // Randomly determine if healthy or diseased (70% healthy for demo)
  const isHealthy = Math.random() > 0.3;

  let detectedDisease: Disease | null = null;
  let confidence = 0;
  let recommendations: string[] = [];

  if (!isHealthy && cropDiseases.length > 0) {
    // Pick a random disease from available crop diseases
    detectedDisease =
      cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
    // Generate confidence between 75-98%
    confidence = Math.floor(Math.random() * 23) + 75;

    recommendations = generateRecommendations(detectedDisease);
  } else {
    // Healthy plant
    confidence = Math.floor(Math.random() * 15) + 85; // 85-99% confidence
    recommendations = getHealthyRecommendations(cropType);
  }

  const result: ScanResult = {
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: "current_user",
    imageUrl: imageData,
    thumbnailUrl: imageData,
    cropType,
    detectedDisease,
    confidence,
    isHealthy,
    recommendations,
    createdAt: new Date().toISOString(),
  };

  return result;
};

// Simulate progressive loading
const simulateProgress = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate processing time (1.5 - 3 seconds)
    const processingTime = 1500 + Math.random() * 1500;
    setTimeout(resolve, processingTime);
  });
};

// Generate recommendations based on detected disease
const generateRecommendations = (disease: Disease): string[] => {
  const recommendations: string[] = [];

  // Add priority action based on severity
  if (disease.severity === "critical") {
    recommendations.push(
      "URGENT: Immediate action required to prevent spread"
    );
  } else if (disease.severity === "high") {
    recommendations.push("Take action within the next few days");
  }

  // Add top treatment recommendations
  if (disease.treatment.cultural.length > 0) {
    recommendations.push(disease.treatment.cultural[0]);
  }

  if (disease.treatment.organic.length > 0) {
    recommendations.push(disease.treatment.organic[0]);
  }

  // Add prevention tip
  if (disease.prevention.length > 0) {
    recommendations.push(`Prevention: ${disease.prevention[0]}`);
  }

  // Add consultation advice for severe cases
  if (disease.severity === "critical" || disease.severity === "high") {
    recommendations.push(
      "Consult with local agricultural extension officer for detailed guidance"
    );
  }

  return recommendations;
};

// Get recommendations for healthy plants
const getHealthyRecommendations = (cropType: CropType): string[] => {
  const generalTips: Record<CropType, string[]> = {
    cocoa: [
      "Your cocoa plant looks healthy! Continue regular monitoring",
      "Maintain proper pruning to ensure good air circulation",
      "Apply balanced fertilizer during the growing season",
      "Remove any debris around the tree base",
    ],
    cassava: [
      "Your cassava plant appears healthy! Keep up the good work",
      "Continue weeding to reduce pest habitat",
      "Monitor for whiteflies regularly",
      "Ensure proper spacing for next planting",
    ],
    maize: [
      "Your maize crop looks healthy! Continue current practices",
      "Monitor for signs of streak virus as plants grow",
      "Apply nitrogen fertilizer at knee-high stage if needed",
      "Scout for stem borers regularly",
    ],
    plantain: [
      "Your plantain looks healthy! Maintain current care",
      "Continue regular de-suckering practices",
      "Apply mulch around the base",
      "Monitor older leaves for early disease signs",
    ],
    rice: [
      "Your rice crop appears healthy",
      "Maintain proper water levels",
      "Monitor for blast disease symptoms",
      "Apply fertilizer according to growth stage",
    ],
    tomato: [
      "Your tomato plant looks healthy",
      "Stake plants for better support",
      "Water at the base to prevent leaf diseases",
      "Remove lower leaves as fruits develop",
    ],
    pepper: [
      "Your pepper plant appears healthy",
      "Ensure consistent watering",
      "Monitor for aphids and whiteflies",
      "Apply mulch to retain moisture",
    ],
    other: [
      "Your crop appears healthy",
      "Continue regular monitoring",
      "Maintain good agricultural practices",
      "Consult extension services for specific advice",
    ],
  };

  return generalTips[cropType] || generalTips.other;
};

// Mock function to analyze image quality
export const analyzeImageQuality = (
  imageData: string
): {
  isValid: boolean;
  quality: "good" | "fair" | "poor";
  suggestions: string[];
} => {
  // In a real app, this would analyze the actual image
  // For mock, we just return a random quality assessment

  const qualities = ["good", "fair", "poor"] as const;
  const quality = qualities[Math.floor(Math.random() * 2)]; // Bias towards good/fair

  const suggestions: string[] = [];

  if (quality === "poor") {
    suggestions.push("Try to capture the image in better lighting");
    suggestions.push("Move closer to the affected area");
    suggestions.push("Ensure the image is in focus");
  } else if (quality === "fair") {
    suggestions.push("Image quality is acceptable but could be improved");
    suggestions.push("Natural daylight provides best results");
  }

  return {
    isValid: quality !== "poor",
    quality,
    suggestions,
  };
};
