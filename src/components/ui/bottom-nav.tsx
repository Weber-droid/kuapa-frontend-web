"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Camera,
  History,
  BookOpen,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
  {
    href: "/scan",
    label: "Scan",
    icon: Camera,
    isMain: true,
  },
  {
    href: "/diseases",
    label: "Library",
    icon: BookOpen,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show nav on auth pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6 flex flex-col items-center"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform",
                    "bg-primary-500 text-white hover:bg-primary-600 active:scale-95"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center px-3 py-2",
                "transition-colors touch-target",
                isActive
                  ? "text-primary-500"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
