"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { LogOut, BookOpen, Calendar, Award } from "lucide-react";

interface MemorizedAyah {
  chapterId: number;
  ayahNumber: number;
  chapterName?: string;
  status: string;
  memorizedAt: string;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [memorizedAyahs, setMemorizedAyahs] = useState<MemorizedAyah[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hifzflow_reviews");
      if (stored) {
        const reviews = JSON.parse(stored);
        setMemorizedAyahs(
          reviews.map((r: any) => ({
            chapterId: r.chapterId,
            ayahNumber: r.ayahNumber,
            chapterName: r.chapterName,
            status: r.status,
            memorizedAt: r.memorizedAt,
          }))
        );
      }
      const streakVal = localStorage.getItem("hifzflow_streak");
      if (streakVal) setStreak(parseInt(streakVal));
    } catch {}
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const masteredCount = memorizedAyahs.filter((a) => a.status === "mastered").length;
  const learningCount = memorizedAyahs.filter((a) => a.status === "learning").length;

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 border-b border-surface-elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            {user.name && <p className="text-text-muted text-sm">{user.name}</p>}
          </div>
          <Button
            label="Sign Out"
            onClick={logout}
            variant="ghost"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{memorizedAyahs.length}</p>
              <p className="text-xs text-text-muted">Total Memorized</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{masteredCount}</p>
              <p className="text-xs text-text-muted">Mastered</p>
            </div>
          </Card>
        </div>

        <div className="flex gap-4 items-center mb-6">
          <StreakBadge count={streak} />
          <div className="flex-1">
            <ProgressRing current={masteredCount} total={30} label="Mastered" size={60} />
          </div>
          <Card className="p-4 flex-1">
            <p className="text-text-muted text-xs mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Learning
            </p>
            <p className="text-xl font-bold">{learningCount}</p>
          </Card>
        </div>
      </div>

      {/* Memorized List */}
      <div className="px-6">
        <h2 className="text-lg font-semibold mb-4">Your Memorized Ayahs</h2>
        {memorizedAyahs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-text-muted mb-2">No ayahs memorized yet.</p>
            <Button label="Start Memorizing" onClick={() => router.push("/surahs")} size="sm" />
          </Card>
        ) : (
          <div className="space-y-2">
            {memorizedAyahs.slice(0, 20).map((ayah) => (
              <Card
                key={`${ayah.chapterId}-${ayah.ayahNumber}`}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">
                    {ayah.chapterName || `Surah ${ayah.chapterId}`} : {ayah.ayahNumber}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(ayah.memorizedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    ayah.status === "mastered"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {ayah.status}
                </span>
              </Card>
            ))}
            {memorizedAyahs.length > 20 && (
              <p className="text-center text-text-muted text-sm py-2">
                +{memorizedAyahs.length - 20} more
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
