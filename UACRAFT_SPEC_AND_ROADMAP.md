# Engineering Specification & Implementation Blueprint: UACraft
> Multi-Angle Ad Creative, Video Hook & Copy Mutation Engine for Mobile User Acquisition

---

## 1. Executive Summary & Problem Space

### 1.1 The Creative Fatigue Problem in Mobile User Acquisition
For mobile apps and games operating at high scale, paid user acquisition (Meta Ads, TikTok Ads, AppLovin, Google App Campaigns, Unity Ads) is the primary revenue engine. However, high ad spend burns through creative concepts rapidly:
* Winning ad creatives experience performance decay (**creative fatigue**) within **7 to 14 days**, causing Click-Through Rates (CTR) to drop and Cost Per Install (CPI) to surge.
* To maintain profitable ad spend, growth teams must test **30 to 50 new creative variations per week** across different player psychologies (competition, relaxation, curiosity gap, humor, frustration/fail mechanics).
* Growth marketing teams spend 15-20 hours a week manually brainstorming new video hooks, rewriting ad copy variations, and preparing creative briefs for motion designers.

### 1.2 The Solution: UACraft
**UACraft** is an automated creative generation and ad copy mutation engine built in **TypeScript and Node.js** that transforms winning historical ad data and core game mechanics into dozens of production-ready ad creative briefs and copy variations.

* **Multi-Angle Psychological Framework:** Analyzes top-performing historical ads and generates variants across 5 proven mobile gaming angles:
  1. *Curiosity Gap / Inverted Logic:* "Why does 99% fail on level 4?"
  2. *Satisfying / ASMR:* Highlighting smooth visual physics and relaxing mechanics.
  3. *Competitive Challenge:* Highlighting skill expression and leaderboards.
  4. *Fake Playable / Rage Bait:* Deliberate player error prompting viewers to download and "do it right".
  5. *Storyline / Problem-Solving:* Character mini-narratives and dramatic stakes.
* **Granular Asset Generation:** For each angle, UACraft outputs:
  * 3-Second Opening Hooks (video action description + visual text overlay).
  * Short Ad Copy (1-line punchy captions for TikTok/Reels).
  * Long Ad Copy (social proof and feature highlights for Facebook).
  * AI Prompt Recipes (Midjourney / Flux / ComfyUI prompts for 2D/3D background concepts).
* **Direct Growth Team Export:** Formats results directly into CSV for bulk upload to Meta Ads Manager, or pushes structured cards to Notion / Airtable boards for motion designers.

---

## 2. Technical Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          UACraft Architecture                          │
└────────────────────────────────────────────────────────────────────────┘

[ Historical Winners & Core Mechanics ] ---> [ UACraft CLI: npx uacraft generate ]
                                                         │
                                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      UACraft Core Mutation Engine                      │
├────────────────────────────────────────────────────────────────────────┤
│  1. Ingestion & Angle Decomposition                                    │
│     ├── Game genre profile (e.g. puzzle, runner, simulation)           │
│     └── Winning elements (top CTR hooks, key visual moments)           │
├────────────────────────────────────────────────────────────────────────┤
│  2. Multi-Angle Generative LLM Suite (Claude 3.5 Sonnet / GPT-4o)      │
│     ├── Hook Generator: Visual action + text overlay (0-3s)            │
│     ├── Scriptwriter: 15s & 30s voiceover & gameplay directions        │
│     ├── Copy Mutator: 20 short/long headline variants                  │
│     └── Visual Asset Prompter: Flux / Midjourney concept prompts       │
├────────────────────────────────────────────────────────────────────────┤
│  3. Formatter & Exporter                                               │
│     ├── Formats CSV for Meta Ads Manager / TikTok Ads Bulk Import      │
│     └── Dispatches creative board updates to Notion / Airtable         │
└────────────────────────────────────────────────────────────────────────┘
                                                         │
                                                         ▼
[ Output: Meta Bulk CSV ] + [ Motion Designer Briefs in Notion / Airtable ]
```

---

## 3. Directory & File Structure

```
uacraft/
├── bin/
│   └── uacraft.js                  # CLI executable entry point
├── src/
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── generate.ts         # uacraft generate --game-profile game.json
│   │   │   └── export-csv.ts       # uacraft export-csv --results run.json
│   │   └── index.ts
│   ├── core/
│   │   ├── angles/
│   │   │   ├── asmr-satisfying.ts  # Satisfying physics & visual flow angle
│   │   │   ├── challenge-fail.ts   # Rage bait and challenge angle
│   │   │   ├── curiosity-gap.ts    # Unresolved question & intrigue angle
│   │   │   └── story-drama.ts      # Narrative character hook angle
│   │   ├── generator/
│   │   │   ├── copy-generator.ts   # Headlines and primary text variants
│   │   │   ├── hook-generator.ts   # 3-second visual opening hooks
│   │   │   └── script-writer.ts    # 15s/30s voiceover and action beats
│   │   ├── prompts/
│   │   │   └── visual-assets.ts    # Flux / Midjourney asset prompt recipes
│   │   └── exporters/
│   │       ├── airtable-sync.ts    # Posts cards to Airtable creative pipeline
│   │       └── meta-csv.ts         # Generates Meta Ads bulk import CSV
│   └── types/
│       └── index.ts
├── examples/
│   └── sample-game-profile.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. 2-Minute Elevator Pitch for Interviews

* **Where data comes from (Source):** A short JSON profile describing the game's core gameplay loop and historical winning ads (what worked in the past).
* **How it is processed (Logic):** Claude 3.5 Sonnet applies 5 proven mobile gaming psychological angles (Curiosity Gap, Rage Bait/Fail, ASMR/Satisfying, Competitive, Storyline). It generates 10 distinct 3-second opening hooks, 20 ad headline variations, and full 15-second video script beats with corresponding visual prompt recipes for designers.
* **Where data lands (Destination):** Direct CSV export ready for Meta Ads Manager bulk upload, plus automatic cards pushed to the motion designers' Notion or Airtable board.
* **Cost & Time Impact:** Generates a full week's testing pipeline of 50 creative variants in **40 seconds** for roughly **$0.05 in API tokens**, eliminating 15+ hours of manual creative brainstorming every single week.
