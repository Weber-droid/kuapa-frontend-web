"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ConfidenceGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ConfidenceGauge({
  value,
  size = "md",
  showLabel = true,
  label,
  className,
}: ConfidenceGaugeProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const getColor = (val: number) => {
    if (val >= 80) return "text-primary-500";
    if (val >= 60) return "text-warning-500";
    return "text-danger-500";
  };

  const getStrokeColor = (val: number) => {
    if (val >= 80) return "#22c55e";
    if (val >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const sizes = {
    sm: { width: 80, stroke: 6, fontSize: "text-lg" },
    md: { width: 120, stroke: 8, fontSize: "text-2xl" },
    lg: { width: 160, stroke: 10, fontSize: "text-4xl" },
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width, height: width }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={width}
          height={width}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={getStrokeColor(clampedValue)}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", fontSize, getColor(clampedValue))}>
            {clampedValue}%
          </span>
        </div>
      </div>
      {showLabel && (
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          {label || "Confidence"}
        </p>
      )}
    </div>
  );
}
