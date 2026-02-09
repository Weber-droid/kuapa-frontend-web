import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Notification } from "@/types";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
}

interface NotificationActions {
    addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
    persist(
        (set, get) => ({
            notifications: [
                {
                    id: "1",
                    type: "info",
                    title: "Welcome to Kuapa",
                    message: "Thanks for joining us! Start scanning your crops to detect diseases.",
                    read: false,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "2",
                    type: "warning",
                    title: "Complete your profile",
                    message: "Add your farm details to get personalized recommendations.",
                    read: false,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                },
            ],
            unreadCount: 2,

            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: Math.random().toString(36).substr(2, 9),
                    createdAt: new Date().toISOString(),
                    read: false,
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markAsRead: (id) => {
                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    if (notification && !notification.read) {
                        return {
                            notifications: state.notifications.map((n) =>
                                n.id === id ? { ...n, read: true } : n
                            ),
                            unreadCount: Math.max(0, state.unreadCount - 1),
                        };
                    }
                    return state;
                });
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            },

            clearNotifications: () => {
                set({ notifications: [], unreadCount: 0 });
            },

            removeNotification: (id) => {
                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    const wasUnread = notification && !notification.read;

                    return {
                        notifications: state.notifications.filter((n) => n.id !== id),
                        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
                    };
                });
            },
        }),
        {
            name: "kuapa-notifications",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
