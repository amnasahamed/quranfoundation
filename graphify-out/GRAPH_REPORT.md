# Graph Report - /Users/amnasahamed/Desktop/hifzflow  (2026-04-18)

## Corpus Check
- Corpus is ~6,395 words - fits in a single context window. You may not need a graph.

## Summary
- 38 nodes · 46 edges · 7 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Animation & State|Animation & State]]
- [[_COMMUNITY_Dashboard & UX|Dashboard & UX]]
- [[_COMMUNITY_API & Auth|API & Auth]]
- [[_COMMUNITY_Data & Storage|Data & Storage]]
- [[_COMMUNITY_Audio & Recitation|Audio & Recitation]]
- [[_COMMUNITY_HifzFlow Core|HifzFlow Core]]
- [[_COMMUNITY_Design System|Design System]]

## God Nodes (most connected - your core abstractions)
1. `Spaced Repetition System` - 6 edges
2. `Memorization Mode` - 6 edges
3. `API Routes Architecture` - 5 edges
4. `Emotion Reflection Modal` - 4 edges
5. `Audio Player with Word Sync` - 4 edges
6. `Dashboard` - 4 edges
7. `Framer Motion Animation` - 4 edges
8. `MemorizedAyah Data Model` - 4 edges
9. `ReviewItem Data Model` - 4 edges
10. `Psychologically Optimized Learning` - 4 edges

## Surprising Connections (you probably didn't know these)
- `useMemorization Hook` --uses--> `Spaced Repetition System`  [EXTRACTED]
  docs/plans/2026-04-18-hifzflow-implementation-plan.md → docs/plans/2026-04-18-hifzflow-design.md
- `Dashboard` --references--> `ReviewItem Data Model`  [EXTRACTED]
  docs/plans/2026-04-18-hifzflow-design.md → docs/plans/2026-04-18-hifzflow-implementation-plan.md
- `MemorizedAyah Data Model` --corresponds_to--> `ReviewItem Data Model`  [INFERRED]
  docs/plans/2026-04-18-hifzflow-design.md → docs/plans/2026-04-18-hifzflow-implementation-plan.md
- `useAuth Hook` --uses--> `API Routes Architecture`  [EXTRACTED]
  docs/plans/2026-04-18-hifzflow-implementation-plan.md → docs/plans/2026-04-18-hifzflow-design.md
- `HifzFlow Implementation Plan` --implements--> `HifzFlow`  [EXTRACTED]
  docs/plans/2026-04-18-hifzflow-implementation-plan.md → docs/plans/2026-04-18-hifzflow-design.md

## Hyperedges (group relationships)
- **HifzFlow Core Memorization Loop** — memorization_mode, audio_player_word_sync, chunk_navigator, emotion_reflection_modal, spaced_repetition_system [EXTRACTED 0.90]
- **HifzFlow Authentication Stack** — oauth2_pkce, useauth_hook, api_routes, quran_foundation_api [EXTRACTED 0.95]
- **HifzFlow UI Component Library** — button_component, ayah_card, streak_counter, bottom_nav, chunk_navigator, emotion_reflection_modal, audio_player_word_sync [EXTRACTED 0.85]

## Communities

### Community 0 - "Animation & State"
Cohesion: 0.29
Nodes (8): Button Component, Chunk Navigator, Emotion Reflection Modal, Emotional Encoding for Memory, Framer Motion Animation, Memorization Mode, Next.js 15, Zustand State Management

### Community 1 - "Dashboard & UX"
Cohesion: 0.29
Nodes (8): AyahCard Component, Bottom Navigation, Dark Mode Default, Dashboard, Mobile-First Design, Progress and Profile, Psychologically Optimized Learning, Streak Counter

### Community 2 - "API & Auth"
Cohesion: 0.38
Nodes (7): API Routes Architecture, Landing Page, OAuth2 PKCE Authentication, @quranjs/api SDK, Quran Foundation API, Surah Browser, useAuth Hook

### Community 3 - "Data & Storage"
Cohesion: 0.4
Nodes (6): localStorage Offline-First Storage, MemorizedAyah Data Model, ReviewItem Data Model, Spaced Repetition System, 2-Minute Quick Memorization Mode, useMemorization Hook

### Community 4 - "Audio & Recitation"
Cohesion: 0.67
Nodes (4): Audio Player with Word Sync, Howler.js Audio, Recitation Practice, useAudioSync Hook

### Community 5 - "HifzFlow Core"
Cohesion: 0.67
Nodes (3): HifzFlow, HifzFlow Design Document, HifzFlow Implementation Plan

### Community 6 - "Design System"
Cohesion: 1.0
Nodes (2): HifzFlow Color Palette, Tailwind CSS

## Knowledge Gaps
- **16 isolated node(s):** `HifzFlow Design Document`, `HifzFlow Implementation Plan`, `Chunk Navigator`, `Surah Browser`, `Recitation Practice` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Design System`** (2 nodes): `HifzFlow Color Palette`, `Tailwind CSS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Memorization Mode` connect `Animation & State` to `Data & Storage`, `Audio & Recitation`?**
  _High betweenness centrality (0.441) - this node is a cross-community bridge._
- **Why does `Spaced Repetition System` connect `Data & Storage` to `Animation & State`, `Dashboard & UX`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Why does `Emotion Reflection Modal` connect `Animation & State` to `API & Auth`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **What connects `HifzFlow Design Document`, `HifzFlow Implementation Plan`, `Chunk Navigator` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._