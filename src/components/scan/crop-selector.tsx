"use client";

import { cn } from "@/lib/utils/cn";
import { CROP_LABELS, type CropType } from "@/types";
import { Check } from "lucide-react";

interface CropSelectorProps {
  selectedCrop: CropType | null;
  onSelect: (crop: CropType) => void;
  className?: string;
}

const cropIcons: Record<CropType, string> = {
  cocoa: "🍫",
  cassava: "🥔",
  maize: "🌽",
  plantain: "🍌",
  rice: "🌾",
  tomato: "🍅",
  pepper: "🌶️",
  other: "🌿",
};

export function CropSelector({
  selectedCrop,
  onSelect,
  className,
}: CropSelectorProps) {
  const crops = Object.entries(CROP_LABELS) as [CropType, string][];

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {crops.map(([value, label]) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={cn(
            "relative flex flex-col items-center gap-1 rounded-xl p-3 transition-all",
            selectedCrop === value
              ? "bg-primary-500 text-white shadow-md"
              : "bg-white text-slate-600 shadow-card hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
        >
          <span className="text-2xl">{cropIcons[value]}</span>
          <span className="text-xs font-medium">{label}</span>
          {selectedCrop === value && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
              <Check className="h-3 w-3 text-primary-500" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
