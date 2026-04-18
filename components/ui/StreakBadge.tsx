"use client";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  count: number;
  className?: string;
}

export function StreakBadge({ count, className = "" }: StreakBadgeProps) {
  const isActive = count > 0;

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-2 bg-surface rounded-xl px-4 py-3 ${className}`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Flame className={`w-6 h-6 ${isActive ? "text-accent" : "text-text-muted"}`} />
      </motion.div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs text-text-muted">day streak</p>
      </div>
    </motion.div>
  );
}
