"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface Chapter {
  id: number;
  name_arabic: string;
  name_complex: string;
  name_simple: string;
  verses_count: number;
  revelation_type: string;
}

interface SurahListItemProps {
  chapter: Chapter;
}

export function SurahListItem({ chapter }: SurahListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  return (
    <div className="border-b border-surface-elevated">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm w-6 text-right">{chapter.id}</span>
          <div className="text-left">
            <p className="font-arabic text-xl text-text-primary" dir="rtl" translate="no">
              {chapter.name_arabic}
            </p>
            <p className="text-sm text-text-secondary">{chapter.name_simple}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={chapter.revelation_type === "Meccan" ? "accent" : "primary"}>
            {chapter.revelation_type}
          </Badge>
          <span className="text-text-muted text-sm">{chapter.verses_count} ayahs</span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 pl-16">
              <p className="text-text-muted text-sm mb-3">
                Begin your memorization journey with Surah {chapter.name_simple}
              </p>
              <div className="flex gap-2">
                <Button
                  label="Start Memorizing"
                  size="sm"
                  onClick={() => router.push(`/memorize/${chapter.id}/1`)}
                  icon={<Play className="w-3 h-3" />}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
