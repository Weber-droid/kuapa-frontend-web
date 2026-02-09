"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  ArrowRight,
  Leaf,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CameraComponent } from "@/components/scan/camera";
import { CropSelector } from "@/components/scan/crop-selector";
import { ScanProgress } from "@/components/ui/loading-spinner";
import { useScanStore } from "@/stores/scan-store";
import { compressImage, blobToDataUrl, dataUrlToBlob } from "@/lib/utils/image";
import type { CropType } from "@/types";
import { cn } from "@/lib/utils/cn";

type ScanStep = "select" | "camera" | "preview" | "scanning" | "error";

export default function ScanPage() {
  const router = useRouter();
  const { startScan, isScanning } = useScanStore();

  const [step, setStep] = useState<ScanStep>("select");
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanStage, setScanStage] = useState("Initializing...");
  const [scanError, setScanError] = useState<string | null>(null);

  // Handle image capture from camera
  const handleCapture = useCallback(async (imageData: string) => {
    try {
      // Compress image for low-bandwidth optimization
      const blob = await dataUrlToBlob(imageData);
      const compressedBlob = await compressImage(blob, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.85,
      });
      const compressedData = await blobToDataUrl(compressedBlob);
      setCapturedImage(compressedData);
      setStep("preview");
    } catch (error) {
      console.error("Image compression error:", error);
      // Use original if compression fails
      setCapturedImage(imageData);
      setStep("preview");
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        // Compress uploaded image
        const compressedBlob = await compressImage(file, {
          maxWidth: 1280,
          maxHeight: 1280,
          quality: 0.85,
        });
        const compressedData = await blobToDataUrl(compressedBlob);
        setCapturedImage(compressedData);
        setStep("preview");
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    []
  );

  // Start the scan process
  const handleStartScan = useCallback(async () => {
    if (!capturedImage || !selectedCrop) return;

    setStep("scanning");
    setScanError(null);

    // Simulate scan progress stages
    const stages = [
      "Analyzing image...",
      "Detecting patterns...",
      "Identifying disease...",
      "Generating recommendations...",
    ];

    try {
      // Show progress stages
      for (let i = 0; i < stages.length; i++) {
        setScanStage(stages[i]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Perform the scan
      const result = await startScan(capturedImage, selectedCrop);

      // Navigate to results
      router.push(`/scan/${result.id}`);
    } catch (error) {
      console.error("Scan error:", error);
      setScanError(
        error instanceof Error ? error.message : "Scan failed. Please try again."
      );
      setStep("error");
    }
  }, [capturedImage, selectedCrop, startScan, router]);

  // Reset scan flow
  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setSelectedCrop(null);
    setScanError(null);
    setStep("select");
  }, []);

  // Retake photo
  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setStep("camera");
  }, []);

  // Render camera view
  if (step === "camera") {
    return (
      <CameraComponent
        onCapture={handleCapture}
        onClose={() => setStep("select")}
      />
    );
  }

  // Render scanning progress
  if (step === "scanning") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <ScanProgress stage={scanStage} />
      </div>
    );
  }

  // Render error state
  if (step === "error") {
    return (
      <div className="page-content">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900/30">
            <AlertCircle className="h-10 w-10 text-danger-500" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Scan Failed
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {scanError || "Something went wrong. Please try again."}
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={handleReset}>
              Start Over
            </Button>
            <Button onClick={() => setStep("preview")}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {step === "select" && "Scan Your Crop"}
          {step === "preview" && "Review Image"}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {step === "select" && "Select your crop type and take a photo"}
          {step === "preview" && "Confirm the image looks clear"}
        </p>
      </div>

      {/* Step: Select crop and capture method */}
      {step === "select" && (
        <>
          {/* Crop Selection */}
          <Card className="p-4">
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">
              What crop are you scanning?
            </h2>
            <CropSelector
              selectedCrop={selectedCrop}
              onSelect={setSelectedCrop}
            />
          </Card>

          {/* Capture Options */}
          <Card className="p-4">
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">
              Capture Image
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => setStep("camera")}
                disabled={!selectedCrop}
                leftIcon={<Camera className="h-6 w-6" />}
              >
                <span>Take Photo</span>
              </Button>

              <label
                className={cn(
                  "btn btn-secondary flex h-auto cursor-pointer flex-col gap-2 py-6",
                  !selectedCrop && "opacity-50 cursor-not-allowed"
                )}
              >
                <Upload className="h-6 w-6" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={!selectedCrop}
                  className="hidden"
                />
              </label>
            </div>
          </Card>

          {/* Tips */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Leaf className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Tips for best results
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <li>• Use natural daylight if possible</li>
                  <li>• Focus on the affected area</li>
                  <li>• Keep the camera steady</li>
                  <li>• Include both healthy and affected parts</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Step: Preview captured image */}
      {step === "preview" && capturedImage && (
        <>
          {/* Image Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Captured crop"
              className="aspect-square w-full object-cover"
            />

            {/* Retake button */}
            <button
              onClick={handleRetake}
              className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-sm font-medium text-white backdrop-blur"
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </button>
          </div>

          {/* Selected crop display */}
          {selectedCrop && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Crop type
                  </p>
                  <p className="font-semibold capitalize text-slate-900 dark:text-white">
                    {selectedCrop}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("select")}
                >
                  Change
                </Button>
              </div>
            </Card>
          )}

          {/* Start Scan Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleStartScan}
            disabled={isScanning}
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Analyze for Diseases
          </Button>
        </>
      )}
    </div>
  );
}
