"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Trash2,
  Camera,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CropBadge } from "@/components/ui/badge";
import { useScanStore } from "@/stores/scan-store";
import { CROP_LABELS, type CropType, type ScanResult } from "@/types";
import { cn } from "@/lib/utils/cn";

type FilterStatus = "all" | "healthy" | "diseased";

export default function HistoryPage() {
  const router = useRouter();
  const { history, removeScan } = useScanStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCrop, setFilterCrop] = useState<CropType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search scans
  const filteredScans = useMemo(() => {
    return history.filter((scan) => {
      // Status filter
      if (filterStatus === "healthy" && !scan.isHealthy) return false;
      if (filterStatus === "diseased" && scan.isHealthy) return false;

      // Crop filter
      if (filterCrop !== "all" && scan.cropType !== filterCrop) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const diseaseName = scan.detectedDisease?.name.toLowerCase() || "";
        const cropName = scan.cropType.toLowerCase();

        if (!diseaseName.includes(query) && !cropName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [history, filterStatus, filterCrop, searchQuery]);

  // Group scans by date
  const groupedScans = useMemo(() => {
    const groups: { [key: string]: ScanResult[] } = {};

    filteredScans.forEach((scan) => {
      const date = new Date(scan.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = "Yesterday";
      } else {
        key = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(scan);
    });

    return groups;
  }, [filteredScans]);

  const handleDelete = (scanId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeScan(scanId);
  };

  // Empty state
  if (history.length === 0) {
    return (
      <div className="page-content">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Calendar className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            No Scan History
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Start scanning your crops to build your history
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push("/scan")}
            leftIcon={<Camera className="h-5 w-5" />}
          >
            Start Scanning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content space-y-4">
      {/* Search and Filter */}
      <div className="sticky top-14 z-30 -mx-4 bg-slate-50 px-4 pb-4 pt-2 dark:bg-slate-900">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search scans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "secondary"}
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 space-y-3 rounded-xl bg-white p-3 shadow-card dark:bg-slate-800">
            {/* Status filter */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </p>
              <div className="flex gap-2">
                {(["all", "healthy", "diseased"] as FilterStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                        filterStatus === status
                          ? "bg-primary-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      )}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Crop filter */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Crop Type
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCrop("all")}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    filterCrop === "all"
                      ? "bg-primary-500 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  )}
                >
                  All
                </button>
                {(Object.keys(CROP_LABELS) as CropType[]).map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setFilterCrop(crop)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                      filterCrop === crop
                        ? "bg-primary-500 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    )}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filteredScans.length} scan{filteredScans.length !== 1 ? "s" : ""} found
      </p>

      {/* Scan list grouped by date */}
      {filteredScans.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedScans).map(([date, scans]) => (
            <div key={date}>
              <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {date}
              </h2>
              <Card className="divide-y divide-slate-100 dark:divide-slate-700">
                {scans.map((scan) => (
                  <HistoryItem
                    key={scan.id}
                    scan={scan}
                    onDelete={(e) => handleDelete(scan.id, e)}
                  />
                ))}
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Search className="h-10 w-10 text-slate-400" />
          <p className="mt-4 font-medium text-slate-900 dark:text-white">
            No results found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

function HistoryItem({
  scan,
  onDelete,
}: {
  scan: ScanResult;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const time = new Date(scan.createdAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/scan/${scan.id}`}
      className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        {scan.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
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
          {scan.isHealthy ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-success-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-danger-500" />
          )}
          <p className="truncate font-medium text-slate-900 dark:text-white">
            {scan.isHealthy
              ? "Healthy"
              : scan.detectedDisease?.name || "Disease Detected"}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <CropBadge cropType={scan.cropType} />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {time}
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {scan.confidence}%
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-danger-500 dark:hover:bg-slate-700"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </Link>
  );
}
