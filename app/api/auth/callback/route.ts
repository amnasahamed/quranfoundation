import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, verifier, redirectUri } = await req.json();

    if (!code || !verifier) {
      return NextResponse.json({ error: "Missing code or verifier" }, { status: 400 });
    }

    const clientId = process.env.QF_CLIENT_ID || process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";
    const clientSecret = process.env.QURAN_CLIENT_SECRET || "";
    const authUrl = process.env.QF_AUTH_URL || "https://prelive-oauth2.quran.foundation";

    const tokenRes = await fetch(`${authUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri || `${req.headers.get("origin") || "http://localhost:3000"}/api/auth/callback`,
        code_verifier: verifier,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return NextResponse.json({ error: "Token exchange failed", details: err }, { status: 400 });
    }

    const tokens = await tokenRes.json();

    const response = NextResponse.json({
      success: true,
      hasRefreshToken: !!tokens.refresh_token,
    });

    response.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });

    if (tokens.refresh_token) {
      response.cookies.set("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    if (tokens.id_token) {
      response.cookies.set("id_token", tokens.id_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
