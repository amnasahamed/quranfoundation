import { useState, useEffect, useRef, useCallback } from "react";

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export function useAudioSync(audioUrl: string, timestamps: WordTimestamp[]) {
  const [playing, setPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const howlRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (!howlRef.current || !howlRef.current.playing()) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const currentTime = howlRef.current.seek() as number;
    const dur = howlRef.current.duration() || 0;
    setDuration(dur);
    setProgress(dur > 0 ? (currentTime / dur) * 100 : 0);

    if (timestamps.length > 0) {
      const idx = timestamps.findIndex(
        (ts) => currentTime >= ts.start && currentTime < ts.end
      );
      setCurrentWordIndex(idx);
    }

    rafRef.current = requestAnimationFrame(updateProgress);
  }, [timestamps]);

  useEffect(() => {
    if (audioUrl) {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      import("howler").then(({ Howl }) => {
        howlRef.current = new Howl({
          src: [audioUrl],
          html5: true,
          onplay: () => {
            setPlaying(true);
            rafRef.current = requestAnimationFrame(updateProgress);
          },
          onpause: () => {
            setPlaying(false);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
          },
          onstop: () => {
            setPlaying(false);
            setProgress(0);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
          },
          onload: () => {
            setDuration(howlRef.current?.duration() || 0);
          },
          onend: () => {
            setPlaying(false);
            setCurrentWordIndex(-1);
          },
        });
      });
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [audioUrl, updateProgress]);

  const toggle = useCallback(() => {
    if (!howlRef.current) return;
    if (playing) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  }, [playing]);

  const seek = useCallback((time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
    }
  }, []);

  const seekPercent = useCallback((pct: number) => {
    if (howlRef.current && duration > 0) {
      howlRef.current.seek(pct * duration);
    }
  }, [duration]);

  return {
    playing,
    currentWordIndex,
    progress,
    duration,
    toggle,
    seek,
    seekPercent,
    howl: howlRef.current,
  };
}
