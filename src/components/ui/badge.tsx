"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    success: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
    warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
    danger: "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

// Severity badge for diseases
export function SeverityBadge({
  severity,
  className,
}: {
  severity: "low" | "medium" | "high" | "critical";
  className?: string;
}) {
  const config = {
    low: { variant: "success" as const, label: "Low" },
    medium: { variant: "warning" as const, label: "Medium" },
    high: { variant: "danger" as const, label: "High" },
    critical: { variant: "danger" as const, label: "Critical" },
  };

  const { variant, label } = config[severity];

  return (
    <Badge variant={variant} className={className}>
      {label} Severity
    </Badge>
  );
}

// Crop type badge
export function CropBadge({
  cropType,
  className,
}: {
  cropType: string;
  className?: string;
}) {
  return (
    <Badge variant="default" className={cn("capitalize", className)}>
      {cropType}
    </Badge>
  );
}
