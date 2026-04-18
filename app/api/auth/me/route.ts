import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const idToken = req.cookies.get("id_token")?.value;
  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    if (idToken) {
      const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());
      return NextResponse.json({
        authenticated: true,
        user: {
          sub: payload.sub,
          name: payload.name,
          email: payload.email,
        },
      });
    }

    return NextResponse.json({ authenticated: true, user: null });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
