import { NextRequest, NextResponse } from "next/server";
import { getQuranClient } from "@/lib/quran";

function buildTimestampsFromSegments(verse: any): { word: string; start: number; end: number }[] {
  const segments = verse.audio?.segments;
  const words = verse.words;
  if (!segments || !words) return [];

  // segments are [wordFrom, wordTo, timeFrom, timeTo] in ms
  return segments.map((seg: number[], i: number) => ({
    word: words[i]?.text || "",
    start: seg[2] / 1000, // convert ms to seconds
    end: seg[3] / 1000,
  }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;
    const client = getQuranClient();
    const verses = await client.verses.findByChapter(chapterId as any, {
      words: true,
    });

    const transformed = verses.map((v: any) => ({
      id: v.id,
      chapter_id: Number(v.chapterId) || parseInt(chapterId),
      verse_number: v.verseNumber,
      text: v.textIndopak || v.textUthmani || v.text || "",
      translation: v.translations?.[0]?.text || "",
      audioUrl:
        v.audio?.url ||
        `https://verses.quran.com/${chapterId.padStart(3, "0")}${v.verseNumber.toString().padStart(3, "0")}.mp3`,
      timestamps: buildTimestampsFromSegments(v),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Verses API error:", error);
    return NextResponse.json({ error: "Failed to fetch verses" }, { status: 500 });
  }
}
