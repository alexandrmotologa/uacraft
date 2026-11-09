# UACraft Architecture and Design Blueprint

UACraft is a command-line utility and TypeScript engine built to generate, mutate, and export ad creative variations for mobile user acquisition teams. It accepts game mechanics profiles and performance metrics to generate opening video hooks, copy variations, timed scripts, and concept art prompts.

---

## 1. System Overview

```
                      ┌──────────────────────────────────────┐
                      │             Input Sources            │
                      ├──────────────────────────────────────┤
                      │ • Game Profile (JSON)                │
                      │ • Ad Performance Logs (JSON)         │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          UACraft CLI Core            │
                      ├──────────────────────────────────────┤
                      │ uacraft init | generate | mutate     │
                      │ uacraft export | analyze | validate  │
                      └──────────────────┬───────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│       Dual Execution Engine          │    │      Creative Fatigue Analyzer       │
├──────────────────────────────────────┤    ├──────────────────────────────────────┤
│ 1. Built-in Heuristic Synthesizer    │    │ • 3s Thumbstop Rate Decay Analysis   │
│    (Deterministic Grammar & Timing)  │    │ • CTR and CPI Outlier Detection      │
│ 2. Multi-Provider LLM Suite          │    │ • Days-Active Saturation Scoring     │
│    (Gemini, OpenAI, Anthropic)       │    │ • Angle Rotation Recommendations     │
└──────────────────┬───────────────────┘    └──────────────────┬───────────────────┘
                   │                                           │
                   ▼                                           ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│      5 Psychological Frameworks      │    │         Diagnostic Reports           │
├──────────────────────────────────────┤    └──────────────────────────────────────┘
│ • ASMR & Tactile Satisfaction        │
│ • Challenge & Rage Bait (Misplay)    │
│ • Curiosity Gap & Inverted Logic     │
│ • Storyline & Character Dilemma      │
│ • Competitive Flex & Mastery         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             Multi-Format Exporters                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ • Meta Ads Manager Bulk CSV (RFC 4180 escaped, 40-char headline bounds)          │
│ • TikTok Ads Manager Bulk CSV (short captions, video asset references)           │
│ • Airtable Kanban CSV & JSON (ready for motion designer production boards)       │
│ • Markdown Production Briefs (timed beat tables, SFX cues, VO scripts)           │
│ • Standalone Interactive HTML Storyboard (scrubber player, prompt copy tools)    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### 2.1 Game Profile Schema
A game profile defines the source data for generation:
- Identity and taxonomy: ID, title, genre, subgenre, visual style, theme.
- Mechanics: Primary actions, hazard systems, fluid simulations, physics interactions.
- Emotional moments: Fail states (how players lose) and satisfying moments (how players win).
- Target audience: Demographics and core player motivations (relaxation, mastery, adrenaline, drama).
- Historical context: Past winning hooks, fatigued angles, target ad networks, benchmark CPI/CTR.

### 2.2 Dual Execution Strategy
UACraft operates in two generation modes without requiring hardcoded placeholders:
1. **Built-in Heuristic Synthesis Engine**: Operates completely offline with zero API keys. It uses structured combinatorial grammar, mobile gaming psychological rules, and pacing formulas to produce valid, production-ready creative assets.
2. **Multi-Provider LLM Engine**: When configured with API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or custom OpenAI-compatible proxies), the engine generates dynamic creative variants using structured JSON output prompts. If a network call fails, the engine falls back to the heuristic synthesizer automatically.

### 2.3 Psychological Angle Strategies
The engine separates creative generation into five discrete behavioral drivers:
- `asmr-satisfying`: Visual alignment, clutter clearing, tactile audio pops, and stress relief.
- `challenge-fail`: Intentional rookie blunders, buzzer sound cues, and ego activation ("99% fail on level 4").
- `curiosity-gap`: Inverted mechanics, hidden developer shortcuts, and counter-intuitive physics.
- `story-drama`: High-stakes dilemmas, freezing cold room renovations, and urgent choice countdowns.
- `competitive-flex`: Speedruns, combo counters, world record leaderboards, and "Noob vs Pro" comparisons.

### 2.4 Timed Script Algebra
Video scripts are generated for standard 15-second and 30-second mobile ad durations. Each script breaks into structured beats:
- Hook (0-3s): High thumbstop visual action + on-screen text overlay + audio SFX cue.
- Setup (3-8s): Mechanics introduction and initial gameplay progress.
- Escalation (8-12s): Rising stakes, combo accumulation, or intentional blunder setup.
- Climax or Fail (12-14s): Resolution, explosive win, or comic disaster.
- CTA End Card (14-15s / 27-30s): Pulsing install prompt, app store badges, and final voiceover instruction.

Voiceover speed is constrained between 110 and 175 words per minute to maintain natural speech cadence on mobile feeds.

### 2.5 Creative Fatigue Diagnosis
The fatigue analyzer processes performance records (spend, impressions, clicks, installs, 3-second thumbstop rate, video completion rate, active days) and computes a composite fatigue score from 0 to 100:
- Thumbstop rate degradation below 24% adds 35 points.
- CTR degradation below 1.8% adds 30 points.
- CPI inflation above $2.80 adds 25 points.
- Longevity exceeding 12 active days adds 15 points.

Angles scoring 60 or above are flagged as `fatigued` with an instruction to pause or reduce budget. Healthy angles with efficient CPI are flagged to `scale`, and untested angles are flagged to `produce`.
