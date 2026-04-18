import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const clientId = process.env.QF_CLIENT_ID || process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch("https://apis.quran.foundation/auth/v1/reflections", {
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch reflections" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Reflections fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const clientId = process.env.QF_CLIENT_ID || process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";

  if (!accessToken) {
    const body = await req.json();
    try {
      const local = JSON.parse(localStorage.getItem("hifzflow_local_reflections") || "[]");
      local.push({ ...body, createdAt: new Date().toISOString() });
      localStorage.setItem("hifzflow_local_reflections", JSON.stringify(local));
      return NextResponse.json({ success: true, local: true });
    } catch {
      return NextResponse.json({ error: "Failed to save locally" }, { status: 500 });
    }
  }

  try {
    const body = await req.json();
    const response = await fetch("https://apis.quran.foundation/auth/v1/reflections", {
      method: "POST",
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to save reflection" }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reflection save error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
