import { useState, useEffect } from "react";
import { ReviewItem, scheduleReview, saveReview, loadReviews, updateStreak } from "@/lib/spaced-repetition";

interface ChapterInfo {
  id: number;
  name_arabic: string;
  name_complex: string;
  name_simple: string;
}

interface VerseInfo {
  id: number;
  chapter_id: number;
  verse_number: number;
  text: string;
  translation: string;
  audioUrl: string;
  timestamps?: { word: string; start: number; end: number }[];
}

export function useMemorization(chapterId: number, ayahNumber: number) {
  const [ayah, setAyah] = useState<VerseInfo | null>(null);
  const [chapter, setChapter] = useState<ChapterInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`/api/content/verses/${chapterId}`).then((r) => r.json()),
      fetch("/api/content/chapters").then((r) => r.json()),
    ])
      .then(([verses, chapters]) => {
        const verse = Array.isArray(verses)
          ? verses.find((v: any) => v.verse_number === ayahNumber)
          : null;

        const chap = Array.isArray(chapters)
          ? chapters.find((c: any) => c.id === chapterId)
          : null;

        if (verse) {
          setAyah({
            ...verse,
            timestamps: verse.timestamps || buildTimestamps(verse.text, 0),
          });
        }
        if (chap) {
          setChapter(chap);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [chapterId, ayahNumber]);

  const markMemorized = () => {
    if (!ayah || !chapter) return;

    const item: ReviewItem = {
      chapterId,
      ayahNumber,
      text: ayah.text,
      translation: ayah.translation,
      chapterName: chapter.name_simple || chapter.name_complex,
      memorizedAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      reviewCount: 0,
      status: "new",
    };

    const reviewed = scheduleReview(item);
    saveReview(reviewed);
    updateStreak();
  };

  return { ayah, chapter, loading, markMemorized };
}

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
