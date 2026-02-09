"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  Share2,
  ChevronRight,
  Leaf,
  Bug,
  Pill,
  Shield,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConfidenceGauge } from "@/components/ui/confidence-gauge";
import { SeverityBadge, CropBadge } from "@/components/ui/badge";
import { useScanStore } from "@/stores/scan-store";
import type { ScanResult } from "@/types";
import { cn } from "@/lib/utils/cn";

export default function ScanResultPage() {
  const router = useRouter();
  const params = useParams();
  const scanId = params.id as string;

  const { getScanById, history } = useScanStore();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<"treatment" | "prevention">(
    "treatment"
  );

  useEffect(() => {
    const result = getScanById(scanId);
    if (result) {
      setScan(result);
    }
  }, [scanId, getScanById, history]);

  // Handle share
  const handleShare = async () => {
    if (!scan) return;

    const shareData = {
      title: "Kuapa Scan Result",
      text: scan.isHealthy
        ? `My ${scan.cropType} crop is healthy!`
        : `Disease detected: ${scan.detectedDisease?.name} in my ${scan.cropType} crop`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!scan) {
    return (
      <div className="page-content">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Scan result not found
          </p>
          <Button className="mt-4" onClick={() => router.push("/scan")}>
            New Scan
          </Button>
        </div>
      </div>
    );
  }

  const disease = scan.detectedDisease;
  const formattedDate = new Date(scan.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="page-content space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Result Header */}
      <Card
        className={cn(
          "overflow-hidden",
          scan.isHealthy
            ? "bg-gradient-to-br from-success-500 to-success-600"
            : "bg-gradient-to-br from-danger-500 to-danger-600"
        )}
      >
        <div className="p-6 text-white">
          <div className="flex items-center gap-3">
            {scan.isHealthy ? (
              <CheckCircle className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {scan.isHealthy ? "Healthy Crop" : disease?.name || "Disease Detected"}
              </h1>
              {disease?.scientificName && (
                <p className="text-sm opacity-80">{disease.scientificName}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <CropBadge cropType={scan.cropType} className="bg-white/20 text-white" />
            {disease && <SeverityBadge severity={disease.severity} />}
          </div>

          <p className="mt-3 text-sm opacity-80">{formattedDate}</p>
        </div>
      </Card>

      {/* Confidence Gauge & Image */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-4">
          <ConfidenceGauge value={scan.confidence} size="md" />
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="aspect-square">
            {scan.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={scan.imageUrl}
                alt="Scanned crop"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-700">
                <Leaf className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Disease Details (if not healthy) */}
      {!scan.isHealthy && disease && (
        <>
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-primary-500" />
                About this Disease
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                {disease.description}
              </p>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {disease.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {symptom}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Treatment/Prevention Tabs */}
          <Card>
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("treatment")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === "treatment"
                    ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                <Pill className="mr-2 inline h-4 w-4" />
                Treatment
              </button>
              <button
                onClick={() => setActiveTab("prevention")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === "prevention"
                    ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                <Shield className="mr-2 inline h-4 w-4" />
                Prevention
              </button>
            </div>

            <CardContent className="pt-4">
              {activeTab === "treatment" && (
                <div className="space-y-4">
                  {/* Cultural practices */}
                  {disease.treatment.cultural.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                        Cultural Practices
                      </h4>
                      <ul className="space-y-2">
                        {disease.treatment.cultural.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Organic treatments */}
                  {disease.treatment.organic.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                        Organic Solutions
                      </h4>
                      <ul className="space-y-2">
                        {disease.treatment.organic.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chemical treatments */}
                  {disease.treatment.chemical.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                        Chemical Treatments
                      </h4>
                      <ul className="space-y-2">
                        {disease.treatment.chemical.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "prevention" && (
                <ul className="space-y-2">
                  {disease.prevention.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* View full disease info */}
          <Link
            href={`/diseases/${disease.id}`}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-card transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <span className="font-medium text-slate-900 dark:text-white">
              View full disease information
            </span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        </>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary-500" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {scan.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {index + 1}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {rec}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleShare}
          leftIcon={<Share2 className="h-5 w-5" />}
        >
          Share Result
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/scan")}
          leftIcon={<Camera className="h-5 w-5" />}
        >
          New Scan
        </Button>
      </div>
    </div>
  );
}
