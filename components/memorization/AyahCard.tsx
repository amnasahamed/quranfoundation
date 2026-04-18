"use client";
import { Card } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface AyahCardProps {
  ayah: {
    chapterId: number;
    ayahNumber: number;
    text?: string;
    translation?: string;
    chapterName?: string;
  };
  compact?: boolean;
  onClick?: () => void;
}

export function AyahCard({ ayah, compact = false, onClick }: AyahCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/memorize/${ayah.chapterId}/${ayah.ayahNumber}`);
    }
  };

  const displayText = ayah.text
    ? ayah.text.slice(0, compact ? 40 : 80) + (ayah.text.length > (compact ? 40 : 80) ? "..." : "")
    : "";

  return (
    <Card hover={!compact} onClick={handleClick} className={`${compact ? "min-w-[200px]" : "w-full"} p-4 cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-muted text-xs mb-1">
            {ayah.chapterName || `Surah ${ayah.chapterId}`}:{ayah.ayahNumber}
          </p>
          {!compact && (
            <p className="font-arabic text-lg text-text-primary leading-loose mb-2" dir="rtl" translate="no">
              {displayText}
            </p>
          )}
          {compact && (
            <p className="font-arabic text-sm text-text-secondary leading-loose" dir="rtl" translate="no">
              {displayText}
            </p>
          )}
          {!compact && ayah.translation && (
            <p className="text-text-muted text-sm">{ayah.translation.slice(0, 60)}...</p>
          )}
        </div>
        {!compact && <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0 ml-2" />}
      </div>
    </Card>
  );
}
