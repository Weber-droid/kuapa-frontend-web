"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bug,
  AlertTriangle,
  Pill,
  Shield,
  ChevronDown,
  ChevronUp,
  Share2,
  Camera,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SeverityBadge, CropBadge } from "@/components/ui/badge";
import { getDiseaseById } from "@/lib/api/diseases";
import { cn } from "@/lib/utils/cn";

export default function DiseaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const diseaseId = params.id as string;

  const disease = getDiseaseById(diseaseId);

  const [expandedSections, setExpandedSections] = useState({
    symptoms: true,
    causes: false,
    treatment: true,
    prevention: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleShare = async () => {
    if (!disease) return;

    const shareData = {
      title: disease.name,
      text: `Learn about ${disease.name} - ${disease.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!disease) {
    return (
      <div className="page-content">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Bug className="h-12 w-12 text-slate-400" />
          <p className="mt-4 font-medium text-slate-900 dark:text-white">
            Disease not found
          </p>
          <Button className="mt-4" onClick={() => router.push("/diseases")}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </button>

      {/* Header */}
      <Card
        className={cn(
          "overflow-hidden",
          disease.severity === "critical"
            ? "bg-gradient-to-br from-danger-500 to-danger-600"
            : disease.severity === "high"
              ? "bg-gradient-to-br from-warning-500 to-warning-600"
              : "bg-gradient-to-br from-primary-500 to-primary-600"
        )}
      >
        <div className="p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Bug className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{disease.name}</h1>
              {disease.scientificName && (
                <p className="mt-1 text-sm opacity-80 italic">
                  {disease.scientificName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={disease.severity} />
            {disease.affectedCrops.map((crop) => (
              <CropBadge
                key={crop}
                cropType={crop}
                className="bg-white/20 text-white"
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-slate-600 dark:text-slate-400">
            {disease.description}
          </p>
        </CardContent>
      </Card>

      {/* Symptoms */}
      <CollapsibleSection
        title="Symptoms"
        icon={AlertTriangle}
        isExpanded={expandedSections.symptoms}
        onToggle={() => toggleSection("symptoms")}
        iconClassName="text-danger-500"
      >
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
      </CollapsibleSection>

      {/* Causes */}
      <CollapsibleSection
        title="Causes"
        icon={Bug}
        isExpanded={expandedSections.causes}
        onToggle={() => toggleSection("causes")}
        iconClassName="text-slate-500"
      >
        <ul className="space-y-2">
          {disease.causes.map((cause, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">{cause}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Treatment */}
      <CollapsibleSection
        title="Treatment"
        icon={Pill}
        isExpanded={expandedSections.treatment}
        onToggle={() => toggleSection("treatment")}
        iconClassName="text-primary-500"
      >
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
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Always follow local regulations and safety guidelines when using
                chemical treatments.
              </p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Prevention */}
      <CollapsibleSection
        title="Prevention"
        icon={Shield}
        isExpanded={expandedSections.prevention}
        onToggle={() => toggleSection("prevention")}
        iconClassName="text-success-500"
      >
        <ul className="space-y-2">
          {disease.prevention.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success-500" />
              <span className="text-slate-600 dark:text-slate-400">{item}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleShare}
          leftIcon={<Share2 className="h-5 w-5" />}
        >
          Share
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/scan")}
          leftIcon={<Camera className="h-5 w-5" />}
        >
          Scan Crop
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        This information is for educational purposes. Consult local agricultural
        experts for specific advice.
      </p>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  iconClassName,
  children,
}: {
  title: string;
  icon: typeof Bug;
  isExpanded: boolean;
  onToggle: () => void;
  iconClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("h-5 w-5", iconClassName)} />
          <span className="font-semibold text-slate-900 dark:text-white">
            {title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {isExpanded && (
        <CardContent className="border-t border-slate-100 pt-4 dark:border-slate-700">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
