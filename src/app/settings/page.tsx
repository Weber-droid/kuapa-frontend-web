"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Settings,
    Moon,
    Sun,
    Globe,
    Shield,
    Lock,
    HelpCircle,
    FileText,
    ChevronRight,
    LogOut,
    AppWindow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/auth-store";

type SettingItem = {
    id: string;
    icon: any;
    label: string;
    action?: React.ReactNode;
    value?: string;
    onClick?: () => void;
    href?: string;
};

export default function SettingsPage() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [theme, setTheme] = useState("system"); // mock
    const [pushEnabled, setPushEnabled] = useState(true);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const sections: { title: string; items: SettingItem[] }[] = [
        {
            title: "Preferences",
            items: [
                {
                    id: "notifications",
                    icon: Bell,
                    label: "Push Notifications",
                    action: (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">{pushEnabled ? "On" : "Off"}</span>
                            <button
                                onClick={() => setPushEnabled(!pushEnabled)}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                                    pushEnabled ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        pushEnabled ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>
                    ),
                },
                {
                    id: "appearance",
                    icon: theme === "dark" ? Moon : Sun,
                    label: "Theme",
                    value: theme === "system" ? "System Default" : theme === "dark" ? "Dark Mode" : "Light Mode",
                    onClick: () => {
                        // cycle theme
                        setTheme(prev => prev === "system" ? "light" : prev === "light" ? "dark" : "system");
                    }
                },
                {
                    id: "language",
                    icon: Globe,
                    label: "Language",
                    value: "English (US)",
                    onClick: () => { } // Open modal or navigate
                },
            ]
        },
        {
            title: "Privacy & Security",
            items: [
                {
                    id: "privacy",
                    icon: Lock,
                    label: "Privacy Policy",
                    href: "/privacy",
                },
                {
                    id: "security",
                    icon: Shield,
                    label: "Account Security",
                    href: "/settings/security",
                },
            ]
        },
        {
            title: "Support",
            items: [
                {
                    id: "help",
                    icon: HelpCircle,
                    label: "Help Center",
                    href: "/help",
                },
                {
                    id: "terms",
                    icon: FileText,
                    label: "Terms of Service",
                    href: "/terms",
                },
                {
                    id: "about",
                    icon: AppWindow,
                    label: "About Kuapa",
                    value: "v1.0.0",
                }
            ]
        }
    ];

    return (
        <div className="page-content space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Settings
                </h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Manage your app preferences
                </p>
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {section.title}
                        </h2>
                        <Card className="divide-y divide-slate-100 overflow-hidden dark:divide-slate-700">
                            {section.items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={item.onClick || (item.href ? () => router.push(item.href!) : undefined)}
                                    className={cn(
                                        "flex items-center justify-between p-4 transition-colors",
                                        (item.onClick || item.href) && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {item.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {item.value && (
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {item.value}
                                            </span>
                                        )}
                                        {item.action}
                                        {!item.action && (item.onClick || item.href) && (
                                            <ChevronRight className="h-5 w-5 text-slate-400" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-full justify-center text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:text-danger-400 dark:hover:bg-danger-900/20"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>

                <p className="text-center text-xs text-slate-400 pt-4">
                    Kuapa App build 2024.05.20
                </p>
            </div>
        </div>
    );
}
