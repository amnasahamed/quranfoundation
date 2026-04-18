"use client";
import { useEffect, useState, useMemo } from "react";
import { SurahListItem } from "@/components/surah/SurahListItem";
import { Search } from "lucide-react";

interface Chapter {
  id: number;
  name_arabic: string;
  name_complex: string;
  name_simple: string;
  verses_count: number;
  revelation_type: string;
}

export default function SurahsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/chapters")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChapters(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return chapters;
    const q = search.toLowerCase();
    return chapters.filter(
      (c) =>
        c.name_arabic.toLowerCase().includes(q) ||
        c.name_complex.toLowerCase().includes(q) ||
        c.name_simple.toLowerCase().includes(q) ||
        c.id.toString().includes(q)
    );
  }, [chapters, search]);

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-24">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-4">Surahs</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-elevated border border-surface-elevated rounded-lg pl-10 pr-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-text-muted">Loading surahs...</p>
        </div>
      ) : (
        <div>
          {filtered.map((chapter) => (
            <SurahListItem key={chapter.id} chapter={chapter} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-text-muted">
              No surahs found matching &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
