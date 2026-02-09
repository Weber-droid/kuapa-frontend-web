"use client";

import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2
        className={cn("animate-spin text-primary-500", sizes[size])}
      />
      {text && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          {text}
        </p>
      )}
    </div>
  );
}

// Full page loading state
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Scan progress indicator
export function ScanProgress({
  progress,
  stage,
}: {
  progress?: number;
  stage: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        {/* Pulsing background */}
        <div className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-20" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-500">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="w-48">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stage text */}
      <div className="text-center">
        <p className="text-lg font-medium text-slate-900 dark:text-white">
          {stage}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please wait while we analyze your crop
        </p>
      </div>
    </div>
  );
}
