"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export function ProgressBar({
  value,
  max,
  className,
  showPercentage = true,
  animated = true,
  size = "md",
  color = "primary",
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(percentage);
    }
  }, [percentage, animated]);

  // Déterminer la hauteur en fonction de la taille
  const getHeight = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "lg":
        return "h-3";
      case "md":
      default:
        return "h-2.5";
    }
  };

  // Déterminer la couleur
  const getColor = () => {
    switch (color) {
      case "secondary":
        return "bg-gray-400";
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      case "primary":
      default:
        return "bg-gofundme-600";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-gray-100",
          getHeight()
        )}
      >
        <motion.div
          className={cn("h-full", getColor())}
          style={{ width: `${width}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-600">
          <span className="font-medium">{value.toLocaleString()} €</span>
          <span className="font-medium">{percentage}%</span>
          <span>{max.toLocaleString()} €</span>
        </div>
      )}
    </div>
  );
}
