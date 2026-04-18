"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AyahCard } from "@/components/memorization/AyahCard";
import { Button } from "@/components/ui/Button";
import { Flame, BookOpen, Plus } from "lucide-react";

interface ReviewItem {
  chapterId: number;
  ayahNumber: number;
  text?: string;
  translation?: string;
  chapterName?: string;
  nextReviewAt: string;
  status: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dueToday, setDueToday] = useState<ReviewItem[]>([]);
  const [memorized, setMemorized] = useState(0);
  const [streak, setStreak] = useState(0);
  const [chapters, setChapters] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load chapters map
    fetch("/api/content/chapters")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<number, string> = {};
          data.forEach((c: any) => {
            map[c.id] = c.name_complex || c.name_arabic;
          });
          setChapters(map);
        }
      })
      .catch(() => {});

    // Load from localStorage spaced repetition
    try {
      const stored = localStorage.getItem("hifzflow_reviews");
      if (stored) {
        const reviews: ReviewItem[] = JSON.parse(stored);
        const now = new Date().toISOString();
        const due = reviews.filter((r) => r.nextReviewAt <= now);
        setDueToday(
          due.slice(0, 10).map((r) => ({
            ...r,
            chapterName: chapters[r.chapterId] || `Surah ${r.chapterId}`,
          }))
        );
        setMemorized(reviews.filter((r) => r.status === "mastered").length);
      }
      const streakCount = localStorage.getItem("hifzflow_streak");
      if (streakCount) setStreak(parseInt(streakCount));
    } catch {}
  }, [chapters, user]);

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
        <h1 className="text-2xl font-bold mb-1">
          Assalamu Alaikum{user.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-text-muted">Ready to memorize?</p>
      </div>

      {/* Streak + Progress */}
      <div className="px-6 flex gap-6 items-center mb-8">
        <StreakBadge count={streak} />
        <ProgressRing current={memorized} total={30} label="Memorized" />
      </div>

      {/* Review Today */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Flame className="text-accent w-5 h-5" />
          Review Today
        </h2>
        {dueToday.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 text-center border border-surface-elevated">
            <p className="text-text-muted mb-4">No ayahs due for review right now.</p>
            <Button
              label="Start Memorizing"
              onClick={() => router.push("/surahs")}
              icon={<Plus className="w-4 h-4" />}
            />
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
            {dueToday.map((ayah) => (
              <AyahCard key={`${ayah.chapterId}-${ayah.ayahNumber}`} ayah={ayah} compact />
            ))}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div className="px-6">
        <Button
          label="Start Memorizing"
          onClick={() => router.push("/surahs")}
          size="lg"
          className="w-full"
          icon={<BookOpen className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}
