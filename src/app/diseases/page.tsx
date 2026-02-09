"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Bug,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, SeverityBadge, CropBadge } from "@/components/ui/badge";
import { diseases, searchDiseases, getDiseasesByCrop } from "@/lib/api/diseases";
import { CROP_LABELS, type CropType, type Disease } from "@/types";
import { cn } from "@/lib/utils/cn";

export default function DiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropType | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<
    Disease["severity"] | "all"
  >("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter diseases
  const filteredDiseases = useMemo(() => {
    let result = diseases;

    // Search filter
    if (searchQuery) {
      result = searchDiseases(searchQuery);
    }

    // Crop filter
    if (selectedCrop !== "all") {
      result = result.filter((d) => d.affectedCrops.includes(selectedCrop));
    }

    // Severity filter
    if (selectedSeverity !== "all") {
      result = result.filter((d) => d.severity === selectedSeverity);
    }

    return result;
  }, [searchQuery, selectedCrop, selectedSeverity]);

  // Group diseases by crop
  const groupedByCrop = useMemo(() => {
    if (selectedCrop !== "all" || searchQuery) {
      return null;
    }

    const groups: Record<CropType, Disease[]> = {} as Record<CropType, Disease[]>;

    diseases.forEach((disease) => {
      disease.affectedCrops.forEach((crop) => {
        if (!groups[crop]) {
          groups[crop] = [];
        }
        if (!groups[crop].find((d) => d.id === disease.id)) {
          groups[crop].push(disease);
        }
      });
    });

    return groups;
  }, [selectedCrop, searchQuery]);

  const severities: (Disease["severity"] | "all")[] = [
    "all",
    "low",
    "medium",
    "high",
    "critical",
  ];

  return (
    <div className="page-content space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Disease Library
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Learn about common crop diseases and treatments
        </p>
      </div>

      {/* Search and Filter */}
      <div className="sticky top-14 z-30 -mx-4 bg-slate-50 px-4 pb-4 pt-2 dark:bg-slate-900">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search diseases..."
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
            {/* Crop filter */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Crop Type
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCrop("all")}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    selectedCrop === "all"
                      ? "bg-primary-500 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  )}
                >
                  All Crops
                </button>
                {(Object.keys(CROP_LABELS) as CropType[]).slice(0, 4).map(
                  (crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                        selectedCrop === crop
                          ? "bg-primary-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      )}
                    >
                      {crop}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Severity filter */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Severity
              </p>
              <div className="flex flex-wrap gap-2">
                {severities.map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setSelectedSeverity(severity)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                      selectedSeverity === severity
                        ? "bg-primary-500 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    )}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filteredDiseases.length} disease{filteredDiseases.length !== 1 ? "s" : ""}{" "}
        found
      </p>

      {/* Disease list */}
      {groupedByCrop && !searchQuery ? (
        // Grouped by crop view
        <div className="space-y-6">
          {(Object.entries(groupedByCrop) as [CropType, Disease[]][]).map(
            ([crop, cropDiseases]) => (
              <div key={crop}>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold capitalize text-slate-900 dark:text-white">
                  {crop}
                  <Badge variant="default" size="sm">
                    {cropDiseases.length}
                  </Badge>
                </h2>
                <Card className="divide-y divide-slate-100 dark:divide-slate-700">
                  {cropDiseases.map((disease) => (
                    <DiseaseItem key={disease.id} disease={disease} />
                  ))}
                </Card>
              </div>
            )
          )}
        </div>
      ) : filteredDiseases.length > 0 ? (
        // Filtered/searched view
        <Card className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredDiseases.map((disease) => (
            <DiseaseItem key={disease.id} disease={disease} />
          ))}
        </Card>
      ) : (
        // No results
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Search className="h-10 w-10 text-slate-400" />
          <p className="mt-4 font-medium text-slate-900 dark:text-white">
            No diseases found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

function DiseaseItem({ disease }: { disease: Disease }) {
  return (
    <Link
      href={`/diseases/${disease.id}`}
      className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          disease.severity === "critical"
            ? "bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400"
            : disease.severity === "high"
            ? "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400"
            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
        )}
      >
        <Bug className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-slate-900 dark:text-white">
            {disease.name}
          </p>
          {(disease.severity === "critical" || disease.severity === "high") && (
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning-500" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
          {disease.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={disease.severity} />
          {disease.affectedCrops.slice(0, 2).map((crop) => (
            <CropBadge key={crop} cropType={crop} />
          ))}
          {disease.affectedCrops.length > 2 && (
            <Badge variant="default" size="sm">
              +{disease.affectedCrops.length - 2}
            </Badge>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
    </Link>
  );
}
