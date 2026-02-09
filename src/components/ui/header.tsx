"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bell, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  showNotifications = false,
  rightAction,
  className,
}: HeaderProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Don't show header on auth pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  const defaultTitle = getPageTitle(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 safe-top",
        className
      )}
    >
      {/* Offline indicator */}
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-warning-500 px-4 py-1.5 text-sm text-white">
          <WifiOff className="h-4 w-4" />
          <span>You are offline. Some features may be limited.</span>
        </div>
      )}

      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                <span className="text-lg font-bold text-white">K</span>
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Kuapa
              </span>
            </Link>
          )}
        </div>

        {/* Title (centered) */}
        {(title || defaultTitle) && showBack && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-slate-900 dark:text-white">
            {title || defaultTitle}
          </h1>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Online status indicator */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              isOnline
                ? "text-primary-500"
                : "text-slate-400"
            )}
          >
            {isOnline ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
          </div>

          {showNotifications && (
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
            </Link>
          )}

          {rightAction}
        </div>
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    "/": "",
    "/scan": "Scan Crop",
    "/history": "Scan History",
    "/diseases": "Disease Library",
    "/profile": "Profile",
  };

  // Handle dynamic routes
  if (pathname.startsWith("/scan/")) return "Scan Result";
  if (pathname.startsWith("/diseases/")) return "Disease Details";

  return titles[pathname] || "";
}
