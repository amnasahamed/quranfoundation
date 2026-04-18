# HifzFlow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the HifzFlow MVP — a Quran memorization app with OAuth2 auth, Quran Foundation API integration, memorization mode with audio sync, emotion reflection, and spaced repetition.

**Architecture:** Next.js 15 App Router full-stack, API routes for backend token exchange, @quranjs/api SDK for content, Zustand for state, Framer Motion for animations.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zustand, Howler.js, @quranjs/api, Lucide React

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Next.js Project

**Files:**
- Create: `.env.local`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `tsconfig.json`

**Step 1: Create project**

Run: `cd /Users/amnasahamed/Desktop/hifzflow && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes`
Expected: Next.js project scaffolded in current directory

**Step 2: Install dependencies**

Run: `npm install framer-motion zustand howler @quranjs/api lucide-react`
Expected: Packages installed

**Step 3: Install types**

Run: `npm install -D @types/howler`
Expected: Types installed

**Step 4: Configure Tailwind theme**

Modify: `tailwind.config.ts` — add HifzFlow color palette and fonts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0F1A14",
        surface: "#1A2E22",
        "surface-elevated": "#243828",
        primary: "#4ADE80",
        accent: "#D4A843",
        "accent-dim": "#A8882F",
        "text-primary": "#F0F4F0",
        "text-secondary": "#A8B8A8",
        "text-muted": "#6B7B6B",
        danger: "#EF6B6B",
      },
      fontFamily: {
        arabic: ["Amiri Quran", "Scheherazade New", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 5: Add Google Fonts to layout**

Modify: `app/layout.tsx` — add Amiri Quran and Inter from next/font/google

---

### Task 2: Set Up Project Structure

**Files:**
- Create: `components/ui/` directory + base components
- Create: `components/memorization/` directory
- Create: `components/emotion/` directory
- Create: `components/layout/` directory
- Create: `components/surah/` directory
- Create: `lib/` directory
- Create: `hooks/` directory
- Create: `app/(main)/` directory
- Create: `app/api/auth/` directory
- Create: `app/api/content/` directory
- Create: `app/api/user/` directory

**Step 1: Create all directories**

Run: `mkdir -p components/{ui,memorization,emotion,layout,surah} lib hooks app/\(main\)/{dashboard,surahs,memorize,practice,profile} app/api/{auth,content,user}`

---

### Task 3: Base UI Components

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Modal.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Input.tsx`

**Step 1: Write Button component tests**

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button label="Start Memorizing" />);
    expect(screen.getByText("Start Memorizing")).toBeTruthy();
  });

  it("calls onClick when pressed", () => {
    const onClick = vi.fn();
    render(<Button label="Click me" onClick={onClick} />);
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button label="Loading" loading={true} />);
    expect(screen.getByTestId("spinner")).toBeTruthy();
  });
});
```

**Step 2: Run tests**

Run: `npm test components/ui/Button.test.tsx`
Expected: FAIL — Button not yet implemented

**Step 3: Implement Button**

```typescript
// components/ui/Button.tsx
"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-bg hover:brightness-110",
    secondary: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-text-secondary hover:text-text-primary",
    danger: "bg-danger text-white hover:brightness-110",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition-all disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Loader2 className="animate-spin" data-testid="spinner" /> : label}
    </motion.button>
  );
}
```

**Step 4: Run tests**

Run: `npm test components/ui/Button.test.tsx`
Expected: PASS

**Step 5: Implement remaining UI components (Modal, Card, Badge, Input) following same TDD pattern**

Run: `npm test components/ui/`
Expected: All PASS

**Step 6: Commit**

Run: `git add -A && git commit -m "feat: scaffold Next.js project with Tailwind theme and base UI components"`

---

## Phase 2: Authentication (Quran Foundation OAuth2 PKCE)

### Task 4: OAuth2 PKCE Helpers

**Files:**
- Create: `lib/auth.ts`

**Step 1: Write PKCE helper functions**

```typescript
// lib/auth.ts
// PKCE code verifier and challenge generation
export async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generatePKCE() {
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateState();
  return { verifier, challenge, state };
}
```

**Step 2: Verify helpers work**

Run: `npx ts-node -e 'import { generatePKCE } from "./lib/auth"; generatePKCE().then(console.log)'`
Expected: Outputs object with verifier, challenge, state

**Step 3: Commit**

Run: `git add lib/auth.ts && git commit -m "feat: add OAuth2 PKCE helper functions"`

---

### Task 5: Auth API Routes

**Files:**
- Create: `app/api/auth/callback/route.ts`
- Create: `app/api/auth/refresh/route.ts`
- Create: `app/api/auth/me/route.ts`

**Step 1: Implement token exchange route**

```typescript
// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code, verifier, redirectUri } = await req.json();

  const tokenRes = await fetch(`${process.env.QF_AUTH_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.QF_CLIENT_ID}:${process.env.QF_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
  }

  const tokens = await tokenRes.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
  });
  response.cookies.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
```

**Step 2: Implement token refresh route**

```typescript
// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const tokenRes = await fetch(`${process.env.QF_AUTH_URL}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.QF_CLIENT_ID!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }

  const tokens = await tokenRes.json();
  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", tokens.access_token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 3600 });
  return response;
}
```

**Step 3: Commit**

Run: `git add app/api/auth/ && git commit -m "feat: add OAuth2 token exchange and refresh API routes"`

---

### Task 6: Auth Hook and Login Flow

**Files:**
- Create: `hooks/useAuth.ts`
- Create: `components/auth/LoginButton.tsx`
- Modify: `app/page.tsx` (landing page)

**Step 1: Implement useAuth hook**

```typescript
// hooks/useAuth.ts
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<{ sub: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.includes("access_token");
    if (token) {
      // Decode id_token to get user info
      const idToken = document.cookie.match(/id_token=([^;]+)/)?.[1];
      if (idToken) {
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        setUser({ sub: payload.sub, name: payload.name });
      }
    }
    setLoading(false);
  }, []);

  const login = async () => {
    const { verifier, challenge, state } = await generatePKCE();
    sessionStorage.setItem("pkce_verifier", verifier);
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_QF_CLIENT_ID!,
      redirect_uri: `${window.location.origin}/api/auth/callback`,
      scope: "openid user bookmark collection reading_session goal streak",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
    });

    window.location.href = `${process.env.NEXT_PUBLIC_QF_AUTH_URL}/authorize?${params}`;
  };

  const logout = () => {
    document.cookie = "access_token=; Max-Age=0";
    document.cookie = "refresh_token=; Max-Age=0";
    setUser(null);
    router.push("/");
  };

  return { user, loading, login, logout };
}
```

**Step 2: Add LoginButton component**

```typescript
// components/auth/LoginButton.tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function LoginButton() {
  const { login } = useAuth();
  return <Button label="Sign in with Quran Foundation" onClick={login} variant="primary" size="lg" />;
}
```

**Step 3: Commit**

Run: `git add hooks/useAuth.ts components/auth/LoginButton.tsx && git commit -m "feat: add auth hook and login button"`

---

## Phase 3: Content API Integration

### Task 7: Quran API Client

**Files:**
- Create: `lib/quran.ts`

**Step 1: Set up @quranjs/api client**

```typescript
// lib/quran.ts
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
```

**Step 2: Create content API proxy routes**

```typescript
// app/api/content/chapters/route.ts
import { NextResponse } from "next/server";
import { getQuranClient } from "@/lib/quran";

export async function GET() {
  const client = getQuranClient();
  const chapters = await client.chapters.findAll();
  return NextResponse.json(chapters);
}
```

```typescript
// app/api/content/verses/[chapterId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuranClient } from "@/lib/quran";

export async function GET(req: NextRequest, { params }: { params: { chapterId: string } }) {
  const client = getQuranClient();
  const verses = await client.verses.findByChapter(parseInt(params.chapterId));
  return NextResponse.json(verses);
}
```

**Step 3: Commit**

Run: `git add lib/quran.ts app/api/content/ && git commit -m "feat: integrate Quran Foundation Content API"`

---

## Phase 4: Landing Page

### Task 8: Landing Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Write landing page**

```tsx
// app/page.tsx
"use client";
import { motion } from "framer-motion";
import { LoginButton } from "@/components/auth/LoginButton";
import { BookOpen, Brain, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg text-text-primary flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-4 text-primary"
        >
          HifzFlow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-secondary mb-2"
        >
          Every ayah, closer to heart.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted mb-8 max-w-md"
        >
          A psychologically optimized Quran memorization platform. Spaced repetition, audio looping, and emotional reflection.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <LoginButton />
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={<Brain className="w-8 h-8 text-primary" />}
          title="Spaced Repetition"
          description="Scientifically-backed review scheduling. New ayahs repeat in 1 hour, then 1 day, 3 days, 7 days."
        />
        <FeatureCard
          icon={<BookOpen className="w-8 h-8 text-accent" />}
          title="Audio Looping"
          description="Word-by-word highlights synced to recitation audio. Loop until it clicks."
        />
        <FeatureCard
          icon={<Heart className="w-8 h-8 text-primary" />}
          title="Emotional Reflection"
          description="After each ayah, pause and reflect. What did you feel? Connect heart and mind."
        />
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-surface rounded-xl p-6 border border-surface-elevated"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-text-muted text-sm">{description}</p>
    </motion.div>
  );
}
```

**Step 2: Run dev server and verify**

Run: `npm run dev`
Expected: Landing page renders with hero and features

**Step 3: Commit**

Run: `git add app/page.tsx && git commit -m "feat: build landing page with hero and feature highlights"`

---

## Phase 5: Dashboard

### Task 9: Dashboard Page

**Files:**
- Create: `app/(main)/layout.tsx`
- Create: `app/(main)/dashboard/page.tsx`
- Create: `components/layout/BottomNav.tsx`
- Create: `components/layout/Header.tsx`
- Create: `components/ui/StreakBadge.tsx`
- Create: `components/ui/ProgressRing.tsx`
- Create: `components/memorization/AyahCard.tsx`

**Step 1: Write dashboard page**

```tsx
// app/(main)/dashboard/page.tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AyahCard } from "@/components/memorization/AyahCard";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dueToday, setDueToday] = useState([]);
  const [memorized, setMemorized] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load from localStorage spaced repetition
    const stored = localStorage.getItem("hifzflow_reviews");
    if (stored) {
      const reviews = JSON.parse(stored);
      const now = new Date().toISOString();
      const due = reviews.filter((r: any) => r.nextReviewAt <= now);
      setDueToday(due.slice(0, 10));
      setMemorized(reviews.filter((r: any) => r.status === "mastered").length);
    }
    const streakCount = localStorage.getItem("hifzflow_streak");
    if (streakCount) setStreak(parseInt(streakCount));
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-24">
      <Header />

      {/* Greeting */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-1">
          Assalamu Alaikum{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-text-muted">Ready to memorize?</p>
      </div>

      {/* Streak + Progress */}
      <div className="px-6 flex gap-6 items-center mb-8">
        <StreakBadge count={streak} />
        <ProgressRing current={memorized} total={30} label="Memorized" />
      </div>

      {/* Review Today */}
      <div className="px-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Flame className="text-accent w-5 h-5" />
          Review Today
        </h2>
        {dueToday.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 text-center border border-surface-elevated">
            <p className="text-text-muted mb-4">No ayahs due for review right now.</p>
            <Button label="Start Memorizing" onClick={() => router.push("/surahs")} />
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {dueToday.map((ayah: any) => (
              <AyahCard key={`${ayah.chapterId}-${ayah.ayahNumber}`} ayah={ayah} compact />
            ))}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div className="px-6 mt-8">
        <Button label="Start Memorizing" onClick={() => router.push("/surahs")} size="lg" className="w-full" />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

Run: `git add app/\(main\)/ && git commit -m "feat: build dashboard with streak, progress ring, and review queue"`

---

## Phase 6: Surah Browser

### Task 10: Surah Browser Page

**Files:**
- Create: `app/(main)/surahs/page.tsx`
- Create: `components/surah/SurahListItem.tsx`
- Create: `components/surah/SurahCard.tsx`

**Step 1: Write surah browser**

```tsx
// app/(main)/surahs/page.tsx
"use client";
import { useEffect, useState } from "react";
import { SurahListItem } from "@/components/surah/SurahListItem";
import { Input } from "@/components/ui/Input";

export default function SurahsPage() {
  const [chapters, setChapters] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/content/chapters")
      .then((r) => r.json())
      .then(setChapters);
  }, []);

  const filtered = chapters.filter(
    (c: any) =>
      c.name_arabic.toLowerCase().includes(search.toLowerCase()) ||
      c.name_complex.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-24">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-4">Surahs</h1>
        <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="px-6">
        {filtered.map((chapter: any) => (
          <SurahListItem key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

Run: `git add app/\(main\)/surahs/ components/surah/ && git commit -m "feat: build surah browser with search"`

---

## Phase 7: Memorization Mode (Core Feature)

### Task 11: Audio Player with Word Sync

**Files:**
- Create: `components/memorization/AudioPlayer.tsx`
- Create: `hooks/useAudioSync.ts`

**Step 1: Write useAudioSync hook**

```typescript
// hooks/useAudioSync.ts
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export function useAudioSync(audioUrl: string, timestamps: WordTimestamp[]) {
  const [playing, setPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (audioUrl) {
      howlRef.current = new Howl({ src: [audioUrl], html5: true });
      howlRef.current.on("timeupdate", () => {
        const currentTime = howlRef.current!.seek() as number;
        setProgress((currentTime / howlRef.current!.duration()) * 100);

        // Find matching word
        const idx = timestamps.findIndex((ts) => currentTime >= ts.start && currentTime < ts.end);
        if (idx !== -1) setCurrentWordIndex(idx);
      });
    }
    return () => howlRef.current?.unload();
  }, [audioUrl, timestamps]);

  const toggle = () => {
    if (!howlRef.current) return;
    if (playing) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
    setPlaying(!playing);
  };

  const seek = (time: number) => {
    howlRef.current?.seek(time);
  };

  return { playing, currentWordIndex, progress, toggle, seek };
}
```

**Step 2: Write AudioPlayer component**

```tsx
// components/memorization/AudioPlayer.tsx
"use client";
import { useAudioSync } from "@/hooks/useAudioSync";
import { Play, Pause, Volume2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AudioPlayerProps {
  audioUrl: string;
  timestamps: { word: string; start: number; end: number }[];
  words: string[];
}

export function AudioPlayer({ audioUrl, timestamps, words }: AudioPlayerProps) {
  const { playing, currentWordIndex, progress, toggle, seek } = useAudioSync(audioUrl, timestamps);

  return (
    <div className="bg-surface rounded-xl p-4 border border-surface-elevated">
      {/* Word highlights */}
      <div className="flex flex-wrap gap-1 mb-4 justify-center font-arabic text-2xl leading-loose" dir="rtl">
        {words.map((word, i) => (
          <span
            key={i}
            className={`transition-all duration-200 ${
              i === currentWordIndex ? "text-accent font-bold" : "text-text-primary"
            } ${i < currentWordIndex ? "text-primary" : ""}`}
          >
            {word}{" "}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-elevated rounded-full mb-3 cursor-pointer" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        seek(pct * (howlRef.current?.duration() || 0));
      }}>
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button label="" onClick={toggle} variant="ghost" className="rounded-full w-12 h-12">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

Run: `git add hooks/useAudioSync.ts components/memorization/AudioPlayer.tsx && git commit -m "feat: add audio player with word-level sync"`

---

### Task 12: Memorization Page

**Files:**
- Create: `app/(main)/memorize/[chapterId]/[ayahNumber]/page.tsx`
- Create: `components/memorization/ChunkNavigator.tsx`
- Create: `components/emotion/EmotionModal.tsx`
- Create: `lib/spaced-repetition.ts`
- Create: `hooks/useMemorization.ts`

**Step 1: Write spaced repetition logic**

```typescript
// lib/spaced-repetition.ts
export interface ReviewItem {
  chapterId: number;
  ayahNumber: number;
  memorizedAt: string;
  nextReviewAt: string;
  reviewCount: number;
  status: "new" | "learning" | "mastered";
}

const REVIEW_INTERVALS = {
  new: 60 * 60 * 1000,        // 1 hour
  1: 24 * 60 * 60 * 1000,      // 1 day
  2: 3 * 24 * 60 * 60 * 1000,  // 3 days
  3: 7 * 24 * 60 * 60 * 1000,  // 7 days
};

export function scheduleReview(item: ReviewItem): ReviewItem {
  const intervals = [REVIEW_INTERVALS.new, REVIEW_INTERVALS[1], REVIEW_INTERVALS[2], REVIEW_INTERVALS[3]];
  const nextInterval = intervals[Math.min(item.reviewCount, 3)];
  const nextReviewAt = new Date(Date.now() + nextInterval).toISOString();
  const reviewCount = Math.min(item.reviewCount + 1, 4);
  const status = reviewCount >= 4 ? "mastered" : "learning";
  return { ...item, nextReviewAt, reviewCount, status };
}

export function saveReview(item: ReviewItem) {
  const stored = localStorage.getItem("hifzflow_reviews");
  const reviews: ReviewItem[] = stored ? JSON.parse(stored) : [];
  const idx = reviews.findIndex((r) => r.chapterId === item.chapterId && r.ayahNumber === item.ayahNumber);
  if (idx !== -1) reviews[idx] = item;
  else reviews.push(item);
  localStorage.setItem("hifzflow_reviews", JSON.stringify(reviews));
}
```

**Step 2: Write EmotionModal**

```tsx
// components/emotion/EmotionModal.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EMOTIONS = [
  { id: "peace", label: "Peace", icon: "🤍" },
  { id: "hope", label: "Hope", icon: "💫" },
  { id: "fear", label: "Fear", icon: "😔" },
  { id: "motivation", label: "Motivation", icon: "💪" },
];

interface EmotionModalProps {
  open: boolean;
  chapterName: string;
  ayahNumber: number;
  onSelect: (emotion: string) => void;
  onSkip: () => void;
}

export function EmotionModal({ open, chapterName, ayahNumber, onSelect, onSkip }: EmotionModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onSkip}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-6 z-50"
          >
            <div className="w-12 h-1 bg-text-muted rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-center mb-1">🎉 MashaAllah!</h2>
            <p className="text-text-secondary text-center mb-6">
              You memorized {chapterName}:{ayahNumber}
            </p>
            <p className="text-center text-text-muted mb-4">What did you feel?</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {EMOTIONS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelect(e.id)}
                  className="bg-surface-elevated rounded-xl p-4 text-left hover:bg-primary/10 transition-colors"
                >
                  <span className="text-2xl mr-2">{e.icon}</span>
                  {e.label}
                </button>
              ))}
            </div>
            <button onClick={onSkip} className="w-full text-center text-text-muted py-2">
              Skip →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 3: Write memorization page**

```tsx
// app/(main)/memorize/[chapterId]/[ayahNumber]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AudioPlayer } from "@/components/memorization/AudioPlayer";
import { ChunkNavigator } from "@/components/memorization/ChunkNavigator";
import { EmotionModal } from "@/components/emotion/EmotionModal";
import { Button } from "@/components/ui/Button";
import { useMemorization } from "@/hooks/useMemorization";

export default function MemorizePage() {
  const { chapterId, ayahNumber } = useParams();
  const router = useRouter();
  const { ayah, chapter, loading, markMemorized } = useMemorization(Number(chapterId), Number(ayahNumber));
  const [showEmotion, setShowEmotion] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center">Loading...</div>;

  const words = ayah?.text.split(" ") || [];
  const timestamps = ayah?.timestamps || [];
  const chunks = words.reduce((acc: string[][], word, i) => {
    const chunkIdx = Math.floor(i / 3);
    if (!acc[chunkIdx]) acc[chunkIdx] = [];
    acc[chunkIdx].push(word);
    return acc;
  }, []);

  const handleMemorized = () => {
    markMemorized();
    setShowEmotion(true);
  };

  const handleEmotionSelect = async (emotion: string) => {
    // Save to User API
    await fetch("/api/user/reflections", {
      method: "POST",
      body: JSON.stringify({
        content_type: "emotion",
        content: { emotion, chapterId, ayahNumber },
      }),
    });
    setShowEmotion(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-text-muted">← Back</button>
        <h1 className="font-semibold">{chapter?.name_complex} {ayahNumber}</h1>
        <div />
      </div>

      {/* Arabic text */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div
          className="font-arabic text-3xl md:text-4xl leading-loose text-center mb-6"
          dir="rtl"
          translate="no"
        >
          {ayah?.text}
        </div>

        {/* Translation */}
        <div className="text-text-secondary text-center mb-8 max-w-lg">
          {ayah?.translation}
        </div>

        {/* Audio */}
        <AudioPlayer audioUrl={ayah?.audioUrl} timestamps={timestamps} words={words} />

        {/* Chunk nav */}
        <ChunkNavigator
          chunks={chunks}
          current={chunkIndex}
          onPrev={() => setChunkIndex((i) => Math.max(0, i - 1))}
          onNext={() => setChunkIndex((i) => Math.min(chunks.length - 1, i + 1))}
        />
      </div>

      {/* Actions */}
      <div className="px-6 py-6 flex gap-4">
        <Button label="Repeat" onClick={() => {}} variant="secondary" className="flex-1" />
        <Button label="Mark Memorized" onClick={handleMemorized} variant="primary" className="flex-1" />
      </div>

      <EmotionModal
        open={showEmotion}
        chapterName={chapter?.name_complex}
        ayahNumber={Number(ayahNumber)}
        onSelect={handleEmotionSelect}
        onSkip={() => { setShowEmotion(false); router.push("/dashboard"); }}
      />
    </div>
  );
}
```

**Step 4: Commit**

Run: `git add lib/spaced-repetition.ts hooks/useMemorization.ts components/memorization/ app/\(main\)/memorize/ && git commit -m "feat: build memorization mode with emotion reflection"`

---

## Phase 8: Recitation Practice

### Task 13: Recitation Practice Page

**Files:**
- Create: `app/(main)/practice/[chapterId]/page.tsx`
- Create: `components/practice/Recorder.tsx`

**Step 1: Write Recorder component**

```tsx
// components/practice/Recorder.tsx
"use client";
import { useState, useRef } from "react";
import { Mic, Square, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export function Recorder({ onRecordingComplete }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks: Blob[] = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRef.current = new MediaRecorder(stream);
    mediaRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      onRecordingComplete(blob);
    };
    mediaRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          recording ? "bg-danger animate-pulse" : "bg-primary"
        }`}
      >
        {recording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-bg" />}
      </button>
      <p className="text-text-muted">{recording ? "Recording... tap to stop" : "Tap to record"}</p>

      {audioUrl && (
        <audio src={audioUrl} controls className="w-full mt-4" />
      )}
    </div>
  );
}
```

**Step 2: Write practice page**

```tsx
// app/(main)/practice/[chapterId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Recorder } from "@/components/practice/Recorder";
import { Button } from "@/components/ui/Button";

export default function PracticePage() {
  const { chapterId } = useParams();
  const router = useRouter();
  const [userAudio, setUserAudio] = useState<Blob | null>(null);
  const [grade, setGrade] = useState<"good" | "needs_practice" | null>(null);

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      <div className="px-6 py-4">
        <h1 className="text-xl font-bold">Recitation Practice</h1>
        <p className="text-text-muted">Surah Al-Fatiha (practice mode)</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Original audio */}
        <div className="w-full">
          <p className="text-text-muted mb-2 text-center">Original Recitation</p>
          <audio controls className="w-full" src="https://verses.quran.com/Alafasy/mp3/001001.mp3" />
        </div>

        {/* Your recording */}
        <div className="w-full">
          <p className="text-text-muted mb-2 text-center">Your Recitation</p>
          <Recorder onRecordingComplete={setUserAudio} />
        </div>
      </div>

      {/* Grade buttons */}
      {userAudio && !grade && (
        <div className="px-6 py-6 flex gap-4">
          <Button
            label="👍 Good"
            onClick={() => setGrade("good")}
            variant="primary"
            className="flex-1"
          />
          <Button
            label="👎 Needs Practice"
            onClick={() => setGrade("needs_practice")}
            variant="secondary"
            className="flex-1"
          />
        </div>
      )}

      {grade && (
        <div className="px-6 py-6">
          <p className="text-center text-lg font-semibold mb-4">
            {grade === "good" ? "👍 Well done!" : "👎 Keep practicing!"}
          </p>
          <Button label="Back to Dashboard" onClick={() => router.push("/dashboard")} className="w-full" />
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit**

Run: `git add app/\(main\)/practice/ components/practice/ && git commit -m "feat: add recitation practice with voice recording"`

---

## Phase 9: Polish & Integration

### Task 14: Navigation Shell + Bottom Nav

**Files:**
- Modify: `app/(main)/layout.tsx`
- Create: `components/layout/BottomNav.tsx`

**Step 1: Write BottomNav**

```tsx
// components/layout/BottomNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic, User } from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/surahs", icon: BookOpen, label: "Surahs" },
  { href: "/practice", icon: Mic, label: "Practice" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-elevated z-50">
      <div className="flex justify-around py-2">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              pathname.startsWith(href) ? "text-primary" : "text-text-muted"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

**Step 2: Update main layout**

```tsx
// app/(main)/layout.tsx
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
```

**Step 3: Commit**

Run: `git add components/layout/BottomNav.tsx app/\(main\)/layout.tsx && git commit -m "feat: add bottom navigation shell"`

---

### Task 15: Environment + Final Verification

**Files:**
- Create: `.env.local.example`
- Verify: all pages render, OAuth flow works, audio plays, emotion modal triggers

**Step 1: Create env example**

```
# Content API
QURAN_CLIENT_ID=your_client_id
QURAN_CLIENT_SECRET=your_client_secret

# Auth
QF_AUTH_URL=https://prelive-oauth2.quran.foundation
NEXT_PUBLIC_QF_AUTH_URL=https://prelive-oauth2.quran.foundation
NEXT_PUBLIC_QF_CLIENT_ID=your_client_id

# API Base
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

Run: `git add .env.local.example && git commit -m "chore: add env example and final polish"`

---

## Task Count: 15
## Estimated Time: 4-6 hours (parallelizable tasks can be split)
## Deadline Alignment: Complete Tasks 1-12 by Day 2, Tasks 13-15 by Day 3

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-04-18-hifzflow-implementation-plan.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**

