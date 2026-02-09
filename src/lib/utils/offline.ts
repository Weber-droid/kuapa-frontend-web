import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { ScanResult, Disease } from "@/types";

interface KuapaDB extends DBSchema {
  scans: {
    key: string;
    value: ScanResult;
    indexes: { "by-date": string; "by-crop": string };
  };
  diseases: {
    key: string;
    value: Disease;
    indexes: { "by-crop": string };
  };
  pendingScans: {
    key: string;
    value: {
      id: string;
      imageData: string;
      cropType: string;
      createdAt: string;
      syncStatus: "pending" | "syncing" | "failed";
    };
  };
}

let dbPromise: Promise<IDBPDatabase<KuapaDB>> | null = null;

const getDB = async (): Promise<IDBPDatabase<KuapaDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<KuapaDB>("kuapa-db", 1, {
      upgrade(db) {
        // Scans store
        const scansStore = db.createObjectStore("scans", { keyPath: "id" });
        scansStore.createIndex("by-date", "createdAt");
        scansStore.createIndex("by-crop", "cropType");

        // Diseases store
        const diseasesStore = db.createObjectStore("diseases", {
          keyPath: "id",
        });
        diseasesStore.createIndex("by-crop", "affectedCrops", {
          multiEntry: true,
        });

        // Pending scans store (for offline sync)
        db.createObjectStore("pendingScans", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
};

// Scan operations
export const offlineStorage = {
  // Save scan result
  async saveScan(scan: ScanResult): Promise<void> {
    const db = await getDB();
    await db.put("scans", scan);
  },

  // Get all scans
  async getAllScans(): Promise<ScanResult[]> {
    const db = await getDB();
    const scans = await db.getAllFromIndex("scans", "by-date");
    return scans.reverse(); // Most recent first
  },

  // Get scan by ID
  async getScanById(id: string): Promise<ScanResult | undefined> {
    const db = await getDB();
    return db.get("scans", id);
  },

  // Get scans by crop type
  async getScansByCrop(cropType: string): Promise<ScanResult[]> {
    const db = await getDB();
    return db.getAllFromIndex("scans", "by-crop", cropType);
  },

  // Delete scan
  async deleteScan(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("scans", id);
  },

  // Clear all scans
  async clearAllScans(): Promise<void> {
    const db = await getDB();
    await db.clear("scans");
  },

  // Disease operations
  async saveDisease(disease: Disease): Promise<void> {
    const db = await getDB();
    await db.put("diseases", disease);
  },

  async saveDiseases(diseases: Disease[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction("diseases", "readwrite");
    await Promise.all([
      ...diseases.map((disease) => tx.store.put(disease)),
      tx.done,
    ]);
  },

  async getAllDiseases(): Promise<Disease[]> {
    const db = await getDB();
    return db.getAll("diseases");
  },

  async getDiseaseById(id: string): Promise<Disease | undefined> {
    const db = await getDB();
    return db.get("diseases", id);
  },

  async getDiseasesByCrop(cropType: string): Promise<Disease[]> {
    const db = await getDB();
    return db.getAllFromIndex("diseases", "by-crop", cropType);
  },

  // Pending scans for offline sync
  async addPendingScan(scan: {
    id: string;
    imageData: string;
    cropType: string;
  }): Promise<void> {
    const db = await getDB();
    await db.put("pendingScans", {
      ...scan,
      createdAt: new Date().toISOString(),
      syncStatus: "pending",
    });
  },

  async getPendingScans(): Promise<
    {
      id: string;
      imageData: string;
      cropType: string;
      createdAt: string;
      syncStatus: "pending" | "syncing" | "failed";
    }[]
  > {
    const db = await getDB();
    return db.getAll("pendingScans");
  },

  async updatePendingScanStatus(
    id: string,
    status: "pending" | "syncing" | "failed"
  ): Promise<void> {
    const db = await getDB();
    const scan = await db.get("pendingScans", id);
    if (scan) {
      await db.put("pendingScans", { ...scan, syncStatus: status });
    }
  },

  async removePendingScan(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("pendingScans", id);
  },
};

// Check online status
export const isOnline = (): boolean => {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
};

// Online/offline event listeners
export const onOnlineStatusChange = (
  callback: (isOnline: boolean) => void
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};
