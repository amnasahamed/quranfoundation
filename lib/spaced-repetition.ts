export interface ReviewItem {
  chapterId: number;
  ayahNumber: number;
  text?: string;
  translation?: string;
  chapterName?: string;
  memorizedAt: string;
  nextReviewAt: string;
  reviewCount: number;
  status: "new" | "learning" | "mastered";
  emotion?: string;
}

const REVIEW_INTERVALS: Record<number, number> = {
  0: 60 * 60 * 1000,
  1: 24 * 60 * 60 * 1000,
  2: 3 * 24 * 60 * 60 * 1000,
  3: 7 * 24 * 60 * 60 * 1000,
};

export function scheduleReview(item: ReviewItem): ReviewItem {
  const nextInterval = REVIEW_INTERVALS[Math.min(item.reviewCount, 3)];
  const nextReviewAt = new Date(Date.now() + nextInterval).toISOString();
  const reviewCount = Math.min(item.reviewCount + 1, 4);
  const status: ReviewItem["status"] = reviewCount >= 4 ? "mastered" : "learning";
  return { ...item, nextReviewAt, reviewCount, status };
}

export function saveReview(item: ReviewItem): void {
  try {
    const stored = localStorage.getItem("hifzflow_reviews");
    const reviews: ReviewItem[] = stored ? JSON.parse(stored) : [];
    const idx = reviews.findIndex(
      (r) => r.chapterId === item.chapterId && r.ayahNumber === item.ayahNumber
    );
    if (idx !== -1) {
      reviews[idx] = item;
    } else {
      reviews.push(item);
    }
    localStorage.setItem("hifzflow_reviews", JSON.stringify(reviews));
  } catch (e) {
    console.error("Failed to save review:", e);
  }
}

export function loadReviews(): ReviewItem[] {
  try {
    const stored = localStorage.getItem("hifzflow_reviews");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function updateStreak(): number {
  try {
    const lastDate = localStorage.getItem("hifzflow_last_active");
    const today = new Date().toDateString();

    if (lastDate === today) {
      return parseInt(localStorage.getItem("hifzflow_streak") || "0");
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const current = parseInt(localStorage.getItem("hifzflow_streak") || "0");

    let newStreak = lastDate === yesterday ? current + 1 : 1;
    localStorage.setItem("hifzflow_streak", newStreak.toString());
    localStorage.setItem("hifzflow_last_active", today);
    return newStreak;
  } catch {
    return 0;
  }
}
