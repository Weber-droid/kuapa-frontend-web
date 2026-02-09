import { openDB } from "idb";
import type { StateStorage } from "zustand/middleware";

const DB_NAME = "kuapa-db";
const STORE_NAME = "app-state";

// Initialize the database
const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    },
});

/**
 * Custom Zustand storage adapter using IndexedDB.
 * This allows us to store large amounts of data (like base64 images)
 * that would otherwise exceed localStorage limits (typically 5MB).
 */
export const indexedDBStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            const value = await (await dbPromise).get(STORE_NAME, name);
            return value || null;
        } catch (error) {
            console.error("Error getting item from IndexedDB:", error);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            await (await dbPromise).put(STORE_NAME, value, name);
        } catch (error) {
            console.error("Error setting item in IndexedDB:", error);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            await (await dbPromise).delete(STORE_NAME, name);
        } catch (error) {
            console.error("Error removing item from IndexedDB:", error);
        }
    },
};
