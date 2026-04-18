import { QuranClient, Language } from "@quranjs/api";

let client: QuranClient | null = null;

export function getQuranClient(): QuranClient {
  if (!client) {
    client = new QuranClient({
      clientId: process.env.QURAN_CLIENT_ID!,
      clientSecret: process.env.QURAN_CLIENT_SECRET!,
      defaults: { language: Language.ENGLISH },
    });
  }
  return client;
}

export interface VerseData {
  id: number;
  chapter_id: number;
  verse_number: number;
  text: string;
  translation: string;
  audioUrl: string;
  timestamps?: { word: string; start: number; end: number }[];
}
