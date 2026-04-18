# HifzFlow — Design Document

**Date:** 2026-04-18
**Status:** Approved
**Goal:** Hackathon MVP demo — polished, impressive, mobile-first

---

## 1. Concept & Vision

HifzFlow is a psychologically optimized Quran memorization platform that transforms rote memorization into an emotionally engaging, scientifically-backed learning experience. It feels like a premium meditation app — calm, focused, and rewarding — not a flashcards app with Islamic branding bolted on. Every interaction is designed to create micro-moments of joy and reflection, building a lasting habit.

**Tagline:** "Every ayah, closer to heart."

---

## 2. Design Language

### Aesthetic Direction
Modern minimal — inspired by Headspace/Calm apps. Ultra-clean surfaces, generous whitespace, soft animations. Traditional Islamic elements are present but subtle: a geometric border here, a calligraphic heading there. Gold accents reserved for moments of achievement.

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0F1A14` | Deep forest dark, default dark mode |
| Surface | `#1A2E22` | Cards, modals, panels |
| Surface Elevated | `#243828` | Hover states, active cards |
| Primary | `#4ADE80` | Soft green — main actions, progress |
| Accent | `#D4A843` | Warm gold — highlights, celebrations |
| Accent Dim | `#A8882F` | Secondary gold for borders |
| Text Primary | `#F0F4F0` | Off-white, high readability |
| Text Secondary | `#A8B8A8` | Muted green-gray |
| Text Muted | `#6B7B6B` | Labels, captions |
| Danger | `#EF6B6B` | Errors, needs practice |
| Success | `#4ADE80` | Completed, mastered |

### Typography
- **Arabic Display:** `Amiri Quran` (Google Fonts) — the gold standard for Quranic text rendering, excellent elongation and diacritic support
- **Arabic UI:** `Scheherazade New` — for small Arabic labels, readable at small sizes
- **English UI:** `Inter` — clean, modern, highly legible
- **Arabic line-height:** 2.2x for memorization readability
- **English line-height:** 1.5x

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Card padding: 24px
- Mobile margins: 16px sides
- Border radius: 12px (cards), 8px (buttons), 24px (modals)

### Motion Philosophy
- **Purposeful, not decorative** — every animation communicates state change
- Page transitions: 200ms fade + 8px vertical slide
- Modal entry: 300ms slide up from bottom with spring easing
- Word highlights: 200ms glow pulse
- Streak increment: 400ms bounce + confetti burst
- Button press: 100ms scale(0.97) + haptic-like feedback
- Audio progress: smooth linear scrub

### Visual Assets
- Icons: Lucide React (consistent stroke weight)
- Audio visualization: Custom wave-style bars
- Decorative: Subtle geometric Islamic pattern (SVG, low opacity) on landing hero only
- No emoji in UI — use Lucide icons exclusively

---

## 3. Layout & Structure

### Mobile-First (375px baseline, scales to 428px and desktop)

```
/ (Landing)
  └─ Hero with tagline + CTA
  └─ Feature highlights (3 cards)
  └─ "Start Free" button → OAuth flow

/dashboard (Authenticated home)
  └─ Greeting header with streak
  └─ "Review Today" — due ayahs (horizontal scroll cards)
  └─ Quick Start button
  └─ Progress ring (memorized / in-progress)
  └─ Recent reflections (last 3)

/surahs (Surah browser)
  └─ List of 114 surahs
  └─ Each shows: name, ayah count, revelation type
  └─ Search/filter bar

/memorize/[chapterId]/[ayahNumber] (Memorization mode)
  └─ Single ayah focus view (the main feature)
  └─ Audio player with word sync
  └─ Chunk navigation
  └─ Repeat / Mark memorized actions

/practice/[chapterId] (Recitation practice)
  └─ Record button
  └─ Side-by-side playback
  └─ Self-grade UI

/profile (Settings + stats)
  └─ Streak calendar
  └─ Memorized ayahs list
  └─ Preferences
```

### Responsive Strategy
- Mobile: Single column, stacked cards, bottom navigation bar
- Tablet (768px+): 2-column dashboard, side panel for surah list
- Desktop (1024px+): 3-column layout, persistent sidebar navigation, keyboard shortcuts

### Navigation
- **Mobile:** Bottom tab bar (4 tabs: Home, Surahs, Practice, Profile)
- **Desktop:** Left sidebar (collapsible)
- Floating "Start Memorizing" FAB on dashboard (mobile only)

---

## 4. Features & Interactions

### 4.1 Authentication — Quran Foundation OAuth2
- **Entry:** "Sign In with Quran Foundation" button on landing
- **Flow:** PKCE generation in browser → Quran Foundation hosted login → callback → backend token exchange
- **Scopes requested:** `openid user bookmark collection reading_session goal streak`
- **Tokens:** Stored in HTTP-only cookies (session) + refresh token in secure cookie
- **Error:** If auth fails, show friendly "Couldn't sign in — try again" with retry
- **Logged-out state:** Can browse surahs, cannot memorize or track progress

### 4.2 Dashboard
- **Streak counter:** Prominent display with flame icon, animates on daily return
- **"Review Today":** Horizontal scroll of ayah cards (chapter:ayah, first few words)
- **Empty state:** "Your first ayah awaits — start memorizing!" with CTA
- **Quick Start:** Starts memorization at last position or Surah Al-Fatiha ayah 1

### 4.3 Surah Browser
- **List:** 114 surahs with Arabic name, English name, ayah count
- **Surah card tap:** Expands inline to show first ayah preview + "Start Memorizing" button
- **Filter:** Search by Arabic name, English name, or ayah number
- **Juz marker:** Subtle dividers between juz sections

### 4.4 Memorization Mode (Core Feature)
**Layout — single ayah, maximum focus:**
1. **Header:** Surah name + "Ayah X of Y" + close button
2. **Arabic display:** Large, centered, word-wrapped
3. **Translation:** Smaller, below Arabic, muted color
4. **Audio bar:** Wave visualization + play/pause, scrubber, volume
5. **Word highlights:** Active word glows gold (#D4A843) during playback
6. **Chunk navigation:** Left/right arrows below audio, shows "chunk 2 of 5"
7. **Action buttons:** "Repeat" (loop icon), "Next Chunk" (arrow), "Mark Memorized" (checkmark)

**Interactions:**
- Play button → audio plays with word sync
- Each word highlights in time with audio timestamps from API
- After audio ends → loops automatically if repeat is on
- "Next Chunk" → advances to next word/phrase chunk
- "Mark Memorized" → saves to local + User API, triggers emotion modal
- Swipe left/right on mobile → prev/next ayah

**Chunk logic:** API word-level timestamps determine chunk boundaries. Each word (or group of 2-3 short words) is a chunk.

### 4.5 Emotion Reflection Modal
- **Trigger:** After marking ayah as memorized
- **Animation:** Slides up from bottom, backdrop dims to 50% black
- **Content:**
  ```
  🎉 MashaAllah!
  You memorized [Surah:Ayah]

  What did you feel?

  [ 🤍 Peace    ]  [ 💫 Hope     ]
  [ 😔 Fear     ]  [ 💪 Motivation ]

  [ Skip → ]
  ```
- **On select:** Saves reflection via Post API, shows brief checkmark, closes
- **Skip:** Closes without saving

### 4.6 Spaced Repetition System
- **Algorithm:**
  - New ayah → queue for 1 hour later
  - 1st review → 1 day later
  - 2nd review → 3 days later
  - 3rd review → 7 days later
  - 4th review → marked "memorized long-term"
- **Storage:** localStorage for offline-first + synced to User API when online
- **Review queue:** Sorted by overdue time (most overdue first)
- **2-minute mode:** Shows 5 ayahs back-to-back, no emotion prompts

### 4.7 Recitation Practice
- **Record button:** Hold to record, release to stop
- **Playback:** Original audio and user recording shown as dual waveforms
- **Grade UI:** "👍 Good" / "👎 Needs Practice" buttons
- **Result:** "Needs Practice" → re-queues for review; "Good" → advances spaced repetition

### 4.8 Progress & Profile
- **Streak calendar:** GitHub-style contribution grid (dark green intensity)
- **Stats:** Total memorized, current streak, longest streak, review accuracy
- **Memorized list:** Searchable list of all memorized ayahs with chapter/ayah reference
- **Settings:** Notification preferences, audio autoplay toggle, dark/light mode (dark default)

---

## 5. Component Inventory

### Core Components

**AyahCard** — Used in Review Today and dashboard
- States: default (muted border), active (primary border + glow), completed (gold checkmark)
- Shows: Arabic snippet (truncated), translation snippet, chapter:ayah label
- Tap → navigates to memorization mode

**AudioPlayer** — Quran audio with word sync
- States: idle, playing, paused, loading, error
- Word-level highlight spans below the waveform
- Scrubber is draggable, shows current time / total time

**ChunkNavigator** — Word-by-word chunk control
- Shows current chunk index / total chunks
- Left/right arrows, disabled at boundaries
- Current chunk text highlighted in Arabic

**EmotionModal** — Post-memorization celebration
- States: entering (slide up), idle, selecting (button press), exiting (slide down)
- Four emotion buttons in 2x2 grid
- Skip link at bottom

**StreakBadge** — Streak display
- Flame icon + number
- States: active (flame animation), at-risk (dim), broken (grayscale)

**ProgressRing** — Circular progress indicator
- Shows memorized / total goal
- Animates on value change

**SurahListItem** — Surah browser row
- Arabic name (right-aligned), English name, ayah count badge
- Tap → inline expand with preview + CTA

### Form Components

**Button** — Primary action
- Variants: primary (green fill), secondary (outline), ghost (text only), danger (red)
- States: default, hover (lift + brighter), active (press), disabled (50% opacity), loading (spinner)

**Input** — Text field
- States: default, focused (green border glow), error (red border + message below), disabled

**Modal** — Overlay dialog
- Backdrop click to dismiss (unless `persistent`)
- Slide-up entry on mobile, fade-in on desktop

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS custom properties for theme
- **Animation:** Framer Motion
- **State:** Zustand (client), React Context (auth), cookies (session)
- **Audio:** Howler.js (reliable cross-browser audio)
- **Icons:** Lucide React

### Quran Foundation API Integration

**Content API — @quranjs/api SDK:**
```typescript
// Initialize once, SDK handles token cache + refresh
const client = new QuranClient({
  clientId: process.env.QURAN_CLIENT_ID,
  clientSecret: process.env.QURAN_CLIENT_SECRET,
  defaults: { language: Language.ENGLISH }
});
```
- `client.chapters.findAll()` — get all 114 surahs
- `client.verses.findByChapter(chapterId)` — get ayahs for a surah
- `client.verses.findOne(id)` — single ayah with translation
- Audio URLs from verse response (`audio_url`, `timestamped_audio_url`)

**User API — OAuth2 Authorization Code + PKCE:**
- Auth URL: `https://prelive-oauth2.quran.foundation` (prelive) / `https://oauth2.quran.foundation` (prod)
- Token endpoint: `POST /oauth2/token`
- PKCE: `S256` method, generated in browser via `crypto.subtle`
- Tokens stored in HTTP-only cookies, refresh on backend

### API Routes
```
POST /api/auth/callback     — Exchange code for tokens, set cookies
POST /api/auth/refresh      — Refresh access token
GET  /api/auth/me           — Return current user from id_token

GET  /api/content/chapters  — Proxy to Content API (adds x-auth-token)
GET  /api/content/verses/[id] — Proxy to Content API

GET  /api/user/bookmarks    — User API /auth/v1/bookmarks
POST /api/user/bookmarks    — Create bookmark
GET  /api/user/reflecti ons  — User API /auth/v1/reflections
POST /api/user/reflections  — Create reflection (emotion data)
GET  /api/user/streak       — User API /auth/v1/streak
```

### Data Model (localStorage + User API)

```typescript
// localStorage: offline-first memorization state
interface MemorizedAyah {
  chapterId: number;
  ayahNumber: number;
  memorizedAt: string; // ISO timestamp
  nextReviewAt: string; // ISO timestamp
  reviewCount: number; // 0-4
  emotion?: 'peace' | 'hope' | 'fear' | 'motivation';
  status: 'new' | 'learning' | 'mastered';
}

// Session: OAuth tokens (HTTP-only cookies)
// id_token payload: { sub, name, email, ... }
```

### Key Implementation Details
- Word-level timestamps from API's `timestamped_audio_url` → parse to `{ word, start, end }[]`
- Audio sync: `howler.js` `seek()` + `timeupdate` event, compare current time to timestamp ranges
- Dark mode default: no flash of light theme — set `class="dark"` on `<html>` in SSR
- Arabic text: always render RTL direction, `translate="no"` for Google Translate exclusion
- Mobile audio: handle autoplay restrictions with explicit play button

### File Structure
```
/app
  layout.tsx              — Root layout, fonts, theme
  page.tsx                — Landing page
  /api
    /auth/[...route]/route.ts
    /content/[...route]/route.ts
    /user/[...route]/route.ts
  /(main)                 — Group route for authenticated pages
    /layout.tsx           — Auth check + navigation shell
    /dashboard/page.tsx
    /surahs/page.tsx
    /memorize/[chapterId]/[ayahNumber]/page.tsx
    /practice/[chapterId]/page.tsx
    /profile/page.tsx
/components
  /ui                     — Base components (Button, Input, Modal, Card)
  /memorization           — AudioPlayer, ChunkNavigator, AyahDisplay
  /emotion                — EmotionModal
  /layout                 — BottomNav, Sidebar, Header
  /surah                  — SurahListItem, SurahCard
/lib
  /quran.ts               — @quranjs/api client
  /auth.ts                — PKCE helpers, token management
  /spaced-repetition.ts   — Review scheduling logic
  /local-storage.ts       — Offline memorization state
/hooks
  /useAudioSync.ts        — Word-level highlight sync hook
  /useMemorization.ts     — Memorization session state
  /useAuth.ts             — Auth state hook
  /useSpacedRepetition.ts — Review queue hook
/styles
  /globals.css            — Tailwind base + CSS custom properties
```

---

## 7. Implementation Priority (Hackathon Deadline)

**Must have (demo-critical):**
1. Landing page + OAuth2 login flow
2. Dashboard with streak display
3. Surah browser
4. Memorization mode with audio + word highlights
5. Mark as memorized → Emotion modal
6. Spaced repetition review queue
7. Dark mode throughout

**Should have (impressiveness):**
8. Recitation practice (record + playback)
9. Progress dashboard
10. 2-minute quick memorization mode

**Nice to have (if time):**
- Daily goal system
- Light mode toggle
- Keyboard shortcuts (desktop)
- Confetti on streak increment

---

## 8. Success Criteria

- [ ] User can sign in via Quran Foundation OAuth
- [ ] User sees dashboard with streak + review queue
- [ ] User can browse surahs and select an ayah
- [ ] Audio plays with word-level highlights during playback
- [ ] User can mark ayah memorized and select an emotion
- [ ] Spaced repetition schedules review at correct intervals
- [ ] App works on mobile (375px) with touch-friendly interactions
- [ ] Dark mode default, elegant Islamic-inspired aesthetic
- [ ] All Quran Foundation API calls go through backend (no client_secret exposure)
- [ ] Demo is smooth, fast, and emotionally engaging
