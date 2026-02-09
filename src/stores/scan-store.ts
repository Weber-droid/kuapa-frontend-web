import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDBStorage } from "@/lib/utils/storage";
import type { ScanResult, ScanState, CropType, Disease } from "@/types";
import { mockDetection } from "@/lib/api/detection";

interface ScanActions {
  startScan: (imageData: string, cropType: CropType) => Promise<ScanResult>;
  addScanToHistory: (scan: ScanResult) => void;
  removeScan: (scanId: string) => void;
  clearHistory: () => void;
  getScanById: (scanId: string) => ScanResult | undefined;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ScanStore = ScanState & ScanActions;

export const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      currentScan: null,
      history: [],
      isScanning: false,
      error: null,

      startScan: async (imageData: string, cropType: CropType) => {
        set({ isScanning: true, error: null, currentScan: null });

        try {
          // Simulate API call with progress
          const result = await mockDetection(imageData, cropType);

          set({
            currentScan: result,
            isScanning: false,
          });

          // Add to history
          get().addScanToHistory(result);

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Scan failed";
          set({
            isScanning: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      addScanToHistory: (scan: ScanResult) => {
        set((state) => ({
          history: [scan, ...state.history].slice(0, 100), // Keep last 100 scans
        }));
      },

      removeScan: (scanId: string) => {
        set((state) => ({
          history: state.history.filter((scan) => scan.id !== scanId),
          currentScan:
            state.currentScan?.id === scanId ? null : state.currentScan,
        }));
      },

      clearHistory: () => {
        set({ history: [], currentScan: null });
      },

      getScanById: (scanId: string) => {
        const { history } = get();
        return history.find((scan) => scan.id === scanId);
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "kuapa-scans",
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const useScanHistory = () => useScanStore((state) => state.history);
export const useCurrentScan = () => useScanStore((state) => state.currentScan);
export const useIsScanning = () => useScanStore((state) => state.isScanning);
