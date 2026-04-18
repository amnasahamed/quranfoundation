import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const clientId = process.env.QF_CLIENT_ID || process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";

  if (!accessToken) {
    return NextResponse.json({ bookmarks: [] });
  }

  try {
    const response = await fetch("https://apis.quran.foundation/auth/v1/bookmarks", {
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
