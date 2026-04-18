import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const clientId = process.env.QF_CLIENT_ID || process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";
  const authUrl = process.env.QF_AUTH_URL || "https://prelive-oauth2.quran.foundation";

  try {
    const tokenRes = await fetch(`${authUrl}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const tokens = await tokenRes.json();
    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
