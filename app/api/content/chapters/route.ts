import { NextResponse } from "next/server";
import { getQuranClient } from "@/lib/quran";

export async function GET() {
  try {
    const client = getQuranClient();
    const chapters = await client.chapters.findAll();
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Chapters API error:", error);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
