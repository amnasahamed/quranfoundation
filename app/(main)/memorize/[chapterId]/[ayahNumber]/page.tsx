"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AudioPlayer } from "@/components/memorization/AudioPlayer";
import { ChunkNavigator } from "@/components/memorization/ChunkNavigator";
import { EmotionModal } from "@/components/emotion/EmotionModal";
import { Button } from "@/components/ui/Button";
import { useMemorization } from "@/hooks/useMemorization";
import { ArrowLeft, Check, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

function buildTimestamps(
  text: string,
  offset: number = 0
): { word: string; start: number; end: number }[] {
  const words = text.split(" ");
  let time = offset;
  return words.map((word) => {
    const duration = word.length * 0.12 + 0.25;
    const ts = { word, start: time, end: time + duration };
    time += duration + 0.03;
    return ts;
  });
}

export default function MemorizePage() {
  const { chapterId, ayahNumber } = useParams();
  const router = useRouter();
  const cid = Number(chapterId);
  const anum = Number(ayahNumber);

  const { ayah, chapter, loading, markMemorized } = useMemorization(cid, anum);
  const [showEmotion, setShowEmotion] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [looping, setLooping] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Loading ayah...</p>
      </div>
    );
  }

  if (!ayah) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center flex-col gap-4">
        <p className="text-text-muted">Ayah not found</p>
        <Button label="Go Back" onClick={() => router.back()} />
      </div>
    );
  }

  const words = ayah.text.split(" ");
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += 3) {
    chunks.push(words.slice(i, i + 3));
  }

  const timestamps = ayah.timestamps || buildTimestamps(ayah.text);

  const handleMarkMemorized = () => {
    markMemorized();
    setShowEmotion(true);
  };

  const handleEmotionSelect = async (emotion: string) => {
    try {
      await fetch("/api/user/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: "emotion",
          content: { emotion, chapterId: cid, ayahNumber: anum },
        }),
      }).catch(() => {});
    } catch {}
    setShowEmotion(false);
    router.push("/dashboard");
  };

  const handleSkip = () => {
    setShowEmotion(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-sm">
          {chapter?.name_simple || `Surah ${cid}`} : {anum}
        </h1>
        <div className="w-8" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center px-6 py-4"
      >
        {/* Arabic text */}
        <div
          className="font-arabic text-2xl md:text-4xl leading-loose text-center mb-6 max-w-lg"
          dir="rtl"
          translate="no"
        >
          {ayah.text}
        </div>

        {/* Translation */}
        <div className="text-text-secondary text-center mb-8 max-w-lg text-sm leading-relaxed">
          {ayah.translation}
        </div>

        {/* Audio player */}
        <div className="w-full max-w-md mb-4">
          <AudioPlayer
            audioUrl={ayah.audioUrl}
            timestamps={timestamps}
            words={words}
            autoPlay={false}
          />
        </div>

        {/* Chunk navigator */}
        {chunks.length > 1 && (
          <ChunkNavigator
            chunks={chunks}
            current={chunkIndex}
            onPrev={() => setChunkIndex((i) => Math.max(0, i - 1))}
            onNext={() => setChunkIndex((i) => Math.min(chunks.length - 1, i + 1))}
          />
        )}
      </motion.div>

      {/* Actions */}
      <div className="px-6 py-6 flex gap-3">
        <Button
          label={looping ? "Looping" : "Repeat"}
          onClick={() => setLooping(!looping)}
          variant="secondary"
          className="flex-1"
          icon={<RotateCw className="w-4 h-4" />}
        />
        <Button
          label="Mark Memorized"
          onClick={handleMarkMemorized}
          variant="primary"
          className="flex-1"
          icon={<Check className="w-4 h-4" />}
        />
      </div>

      <EmotionModal
        open={showEmotion}
        chapterName={chapter?.name_simple}
        ayahNumber={anum}
        onSelect={handleEmotionSelect}
        onSkip={handleSkip}
      />
    </div>
  );
}
