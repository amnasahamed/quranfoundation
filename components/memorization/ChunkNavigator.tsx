"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChunkNavigatorProps {
  chunks: string[][];
  current: number;
  onPrev: () => void;
  onNext: () => void;
}

export function ChunkNavigator({ chunks, current, onPrev, onNext }: ChunkNavigatorProps) {
  const chunkText = chunks[current]?.join(" ") || "";

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-sm">
          Chunk {current + 1} of {chunks.length}
        </span>
      </div>
      <div
        className="bg-surface-elevated rounded-lg p-3 mb-3 font-arabic text-xl text-center"
        dir="rtl"
        translate="no"
      >
        {chunkText}
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button
          label=""
          onClick={onPrev}
          variant="ghost"
          disabled={current === 0}
          className="rounded-full w-10 h-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-1">
          {chunks.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-primary" : i < current ? "bg-primary/40" : "bg-surface-elevated"
              }`}
            />
          ))}
        </div>
        <Button
          label=""
          onClick={onNext}
          variant="ghost"
          disabled={current === chunks.length - 1}
          className="rounded-full w-10 h-10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
