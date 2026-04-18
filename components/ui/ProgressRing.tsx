"use client";
import { motion } from "framer-motion";

interface ProgressRingProps {
  current: number;
  total: number;
  label: string;
  size?: number;
  className?: string;
}

export function ProgressRing({ current, total, label, size = 80, className = "" }: ProgressRingProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-surface-elevated"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-primary"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{current}</span>
        </div>
      </div>
      <p className="text-xs text-text-muted mt-1">{label}</p>
    </div>
  );
}
