"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Recorder } from "@/components/practice/Recorder";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mic, BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";

export default function PracticePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userAudio, setUserAudio] = useState<{ blob: Blob; url: string } | null>(null);
  const [grade, setGrade] = useState<"good" | "needs_practice" | null>(null);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/content/chapters")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setChapters(data.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-1">Recitation Practice</h1>
        <p className="text-text-muted">Record and compare your recitation</p>
      </div>

      {/* Surah selector */}
      <div className="px-6 mb-6">
        <label className="text-text-muted text-sm mb-2 block">Select Surah</label>
        <select
          value={selectedSurah}
          onChange={(e) => setSelectedSurah(Number(e.target.value))}
          className="w-full bg-surface-elevated border border-surface-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
        >
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_simple} ({c.verses_count} ayahs)
            </option>
          ))}
        </select>
      </div>

      <div className="px-6 space-y-6">
        {/* Original audio */}
        <Card className="p-4">
          <p className="text-text-muted text-sm mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Original Recitation
          </p>
          <audio
            controls
            className="w-full"
            src={`https://verses.quran.com/Alafasy/mp3/${selectedSurah.toString().padStart(3, "0")}001.mp3`}
            preload="metadata"
          />
        </Card>

        {/* Your recording */}
        <Card className="p-6">
          <p className="text-text-muted text-sm mb-4 flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Your Recitation
          </p>
          <Recorder
            onRecordingComplete={(blob, url) => setUserAudio({ blob, url })}
          />
        </Card>

        {/* Grade buttons */}
        {userAudio && !grade && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-center text-text-secondary">How did it sound?</p>
            <div className="flex gap-3">
              <Button
                label="👍 Good"
                onClick={() => setGrade("good")}
                variant="primary"
                className="flex-1"
                icon={<ThumbsUp className="w-4 h-4" />}
              />
              <Button
                label="👎 Needs Practice"
                onClick={() => setGrade("needs_practice")}
                variant="secondary"
                className="flex-1"
                icon={<ThumbsDown className="w-4 h-4" />}
              />
            </div>
          </motion.div>
        )}

        {/* Result */}
        {grade && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                grade === "good" ? "bg-primary/20" : "bg-surface-elevated"
              }`}
            >
              {grade === "good" ? (
                <ThumbsUp className="w-8 h-8 text-primary" />
              ) : (
                <ThumbsDown className="w-8 h-8 text-text-muted" />
              )}
            </div>
            <h3 className="text-xl font-bold">
              {grade === "good" ? "Well Done!" : "Keep Practicing!"}
            </h3>
            <p className="text-text-muted text-sm">
              {grade === "good"
                ? "Your recitation is on point. Keep it up!"
                : "Practice makes perfect. Try again!"}
            </p>
            <Button
              label="Back to Dashboard"
              onClick={() => router.push("/dashboard")}
              className="w-full"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
