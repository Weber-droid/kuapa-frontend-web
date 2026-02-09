"use client";

import { useNotificationStore } from "@/stores/notification-store";
import {
    Bell,
    CheckCircle,
    Trash2,
    Info,
    AlertTriangle,
    AlertOctagon,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const router = useRouter();
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification
    } = useNotificationStore();

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    const handleClear = () => {
        if (confirm("Are you sure you want to clear all notifications?")) {
            clearNotifications();
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-success-500" />;
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-warning-500" />;
            case "error":
                return <AlertOctagon className="h-5 w-5 text-danger-500" />;
            default:
                return <Info className="h-5 w-5 text-primary-500" />;
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="page-content space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Notifications
                    </h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                        Updates and alerts for your farm
                    </p>
                </div>
                <div className="flex gap-2">
                    {notifications.some(n => !n.read) && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                            Mark all read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClear} className="text-danger-600 hover:bg-danger-50 dark:text-danger-400">
                            Clear all
                        </Button>
                    )}
                </div>
            </div>

            {notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={cn(
                                "relative transition-colors",
                                !notification.read && "bg-slate-50 border-l-4 border-l-primary-500 dark:bg-slate-800/50"
                            )}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start p-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="mt-1 shrink-0 rounded-full bg-white p-2 shadow-sm dark:bg-slate-800">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className={cn("font-semibold text-slate-900 dark:text-white", !notification.read && "text-primary-600 dark:text-primary-400")}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="block h-2 w-2 rounded-full bg-primary-500 shrink-0 mt-2 sm:hidden" />
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                            {notification.message}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                            {getTimeAgo(notification.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden sm:flex flex-col items-end justify-between h-full gap-2 self-start pl-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notification.id);
                                        }}
                                        className="p-1 text-slate-400 hover:text-danger-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                        <Bell className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                        All caught up!
                    </h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        You don&apos;t have any new notifications at the moment.
                    </p>
                    <Button className="mt-6" onClick={() => router.push("/")}>
                        Back to Home
                    </Button>
                </div>
            )}
        </div>
    );
}
