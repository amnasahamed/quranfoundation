"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

interface AudioPlayerProps {
  audioUrl: string;
  timestamps: WordTimestamp[];
  words: string[];
  autoPlay?: boolean;
}

export function AudioPlayer({ audioUrl, timestamps, words, autoPlay = false }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const howlRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    import("howler").then(({ Howl }) => {
      if (howlRef.current) {
        howlRef.current.unload();
      }

      howlRef.current = new Howl({
        src: [audioUrl],
        html5: true,
        onplay: () => setPlaying(true),
        onpause: () => setPlaying(false),
        onstop: () => {
          setPlaying(false);
          setProgress(0);
        },
        onload: () => {
          setDuration(howlRef.current?.duration() || 0);
          if (autoPlay) {
            howlRef.current?.play();
          }
        },
        onend: () => {
          setPlaying(false);
          setCurrentWordIndex(-1);
        },
      });

      const tick = () => {
        if (!howlRef.current?.playing()) return;
        const t = howlRef.current.seek() as number;
        const d = howlRef.current.duration() || 0;
        setProgress(d > 0 ? (t / d) * 100 : 0);

        if (timestamps.length > 0) {
          const idx = timestamps.findIndex((ts) => t >= ts.start && t < ts.end);
          setCurrentWordIndex(idx);
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      howlRef.current.on("play", () => {
        rafRef.current = requestAnimationFrame(tick);
      });
      howlRef.current.on("pause", () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      });
      howlRef.current.on("stop", () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      });
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [audioUrl, autoPlay, timestamps]);

  const togglePlay = () => {
    if (!howlRef.current) return;
    if (playing) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  };

  const handleSeek = (pct: number) => {
    if (!howlRef.current || duration <= 0) return;
    const time = pct * duration;
    howlRef.current.seek(time);
    setProgress(pct * 100);
  };

  const replay = () => {
    if (!howlRef.current) return;
    howlRef.current.seek(0);
    howlRef.current.play();
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-surface-elevated">
      {/* Word highlights */}
      <div
        className="flex flex-wrap gap-1 mb-4 justify-center font-arabic text-2xl md:text-3xl leading-loose"
        dir="rtl"
        translate="no"
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={`transition-all duration-200 ${
              i === currentWordIndex
                ? "text-accent font-bold"
                : i < currentWordIndex
                  ? "text-primary/70"
                  : "text-text-primary"
            }`}
          >
            {word}{" "}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="h-1 bg-surface-elevated rounded-full mb-3 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          handleSeek(pct);
        }}
      >
        <div
          className="h-full bg-primary rounded-full transition-all relative group-hover:bg-accent"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Time */}
      <div className="flex justify-between text-xs text-text-muted mb-3">
        <span>{duration > 0 ? formatTime((progress / 100) * duration) : "0:00"}</span>
        <span>{duration > 0 ? formatTime(duration) : "0:00"}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button label="" onClick={replay} variant="ghost" className="rounded-full w-10 h-10">
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          label=""
          onClick={togglePlay}
          variant="primary"
          className="rounded-full w-14 h-14 flex items-center justify-center"
        >
          {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>
        <Button label="" onClick={() => {}} variant="ghost" className="rounded-full w-10 h-10 opacity-0 pointer-events-none">
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
