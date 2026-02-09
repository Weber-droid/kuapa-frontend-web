"use client";

import Link from "next/link";
import { ChevronRight, Leaf, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge, CropBadge } from "@/components/ui/badge";
import type { ScanResult } from "@/types";

interface RecentScansProps {
  scans: ScanResult[];
  className?: string;
}

export function RecentScans({ scans, className }: RecentScansProps) {
  if (scans.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl bg-white p-6 text-center shadow-card dark:bg-slate-800",
          className
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
          <Leaf className="h-6 w-6 text-slate-400" />
        </div>
        <p className="mt-3 font-medium text-slate-900 dark:text-white">
          No scans yet
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Start by scanning a crop to detect diseases
        </p>
        <Link
          href="/scan"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Scan your first crop
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-white shadow-card dark:bg-slate-800", className)}>
      <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Recent Scans
        </h2>
        <Link
          href="/history"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {scans.slice(0, 5).map((scan) => (
          <ScanListItem key={scan.id} scan={scan} />
        ))}
      </div>
    </div>
  );
}

function ScanListItem({ scan }: { scan: ScanResult }) {
  const formattedDate = new Date(scan.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/scan/${scan.id}`}
      className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        {scan.thumbnailUrl ? (
          <img
            src={scan.thumbnailUrl}
            alt="Scan thumbnail"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf className="h-6 w-6 text-slate-400" />
          </div>
        )}
        {/* Health indicator */}
        <div
          className={cn(
            "absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white dark:border-slate-800",
            scan.isHealthy ? "bg-success-500" : "bg-danger-500"
          )}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-slate-900 dark:text-white">
            {scan.isHealthy
              ? "Healthy"
              : scan.detectedDisease?.name || "Disease Detected"}
          </p>
          {!scan.isHealthy && (
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning-500" />
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <CropBadge cropType={scan.cropType} />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {scan.confidence}%
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">confidence</p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
    </Link>
  );
}
