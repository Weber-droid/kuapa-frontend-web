"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Camera,
  SwitchCamera,
  Zap,
  ZapOff,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface CameraComponentProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraComponent({ onCapture, onClose }: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
      }

      // Check for flash support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.();
      setHasFlash(!!capabilities?.torch);
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError(
            "Camera access denied. Please enable camera permissions in your browser settings."
          );
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Unable to access camera. Please try again.");
        }
      }
    }
  }, [facingMode]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (!streamRef.current || !hasFlash) return;

    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !flashEnabled } as MediaTrackConstraintSet],
      });
      setFlashEnabled(!flashEnabled);
    } catch (err) {
      console.error("Flash toggle error:", err);
    }
  }, [flashEnabled, hasFlash]);

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL("image/jpeg", 0.9);

    // Stop camera
    stopCamera();

    // Callback with captured image
    onCapture(imageData);

    setIsCapturing(false);
  }, [isReady, onCapture, stopCamera]);

  // Handle file upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        stopCamera();
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    },
    [onCapture, stopCamera]
  );

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Restart camera when facing mode changes
  useEffect(() => {
    if (isReady) {
      startCamera();
    }
  }, [facingMode]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera preview */}
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "h-full w-full object-cover",
            facingMode === "user" && "scale-x-[-1]"
          )}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-500/20">
                <Camera className="h-8 w-8 text-danger-500" />
              </div>
              <p className="text-white">{error}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={startCamera}>Try Again</Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
              <p className="mt-4 text-white">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Viewfinder frame */}
        {isReady && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
            <div className="relative aspect-square w-full max-w-sm">
              {/* Corner brackets */}
              <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-white/60" />
              <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-white/60" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-white/60" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-white/60" />

              {/* Scan line animation */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="animate-scan h-0.5 w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Top controls */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 safe-top">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex gap-2">
            {hasFlash && (
              <button
                onClick={toggleFlash}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  flashEnabled ? "bg-yellow-500 text-black" : "bg-black/50 text-white"
                )}
              >
                {flashEnabled ? (
                  <Zap className="h-5 w-5" />
                ) : (
                  <ZapOff className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              onClick={switchCamera}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <SwitchCamera className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 safe-bottom">
          <p className="mb-4 text-center text-sm text-white/80">
            Position the affected crop area within the frame
          </p>

          <div className="flex items-center justify-center gap-8">
            {/* Gallery button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <ImageIcon className="h-6 w-6" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Capture button */}
            <button
              onClick={capturePhoto}
              disabled={!isReady || isCapturing}
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full border-4 border-white",
                "transition-transform active:scale-95",
                isCapturing && "animate-pulse"
              )}
            >
              <div className="h-16 w-16 rounded-full bg-white" />
            </button>

            {/* Placeholder for symmetry */}
            <div className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
