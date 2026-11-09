# Ad Network Exporters and Pipeline Guide

UACraft exports creative packages into standardized file formats ready for media buying platforms and creative pipelines.

---

## 1. Meta Ads Manager (Bulk Import CSV)

### File: `<game-id>_meta_ads_bulk.csv`

### Specification Overview
Meta Ads Manager allows advertisers to upload ad sets and ads in bulk through CSV import. UACraft generates columns conforming to standard Meta conventions:
* `Campaign Name`: Grouped by testing cohort (e.g. `UA_GameTitle_Testing`).
* `Ad Set Name`: Grouped by angle and targeting type (e.g. `AS_CHALLENGE-FAIL_Broad`).
* `Ad Name`: Structured unique identifier for each creative variation.
* `Primary Text`: Short primary copy within 125 characters to prevent truncation before the fold.
* `Headline`: Punchy title constrained to 40 characters or fewer.
* `Description`: Subtitle displaying under the headline in mobile feeds.
* `Call to Action`: Supported values such as "Play Game", "Install Now", and "Download Free".
* `Link URL`: Deep link or store destination URL.
* `Angle Category`: Custom tracking parameter for automated reporting.

### Upload Workflow
1. Open Meta Ads Manager.
2. Select your Ad Account.
3. Click More Actions (three dots icon) > Import Ads.
4. Choose "Import Ads in Bulk (CSV)".
5. Select `<game-id>_meta_ads_bulk.csv`.
6. Review the mapped fields and confirm the import.

---

## 2. TikTok Ads Manager (Bulk Import CSV)

### File: `<game-id>_tiktok_ads_bulk.csv`

### Specification Overview
TikTok Ads requires short, high-engagement captions with strict length limits:
* `Campaign`: Campaign identifier for creative hook testing.
* `Ad Group`: Structured by angle and interest category.
* `Ad Name`: Creative variant code.
* `Ad Text`: Captions between 12 and 100 characters.
* `Call To Action`: Standard CTA strings.
* `Video Code / Asset ID`: References the corresponding 15s or 30s video script ID.
* `Landing Page URL`: App Store or Google Play Store link.

### Upload Workflow
1. Log in to TikTok Ads Manager.
2. Navigate to Campaigns > Bulk Creation.
3. Upload the generated CSV file.
4. Attach the rendered video assets corresponding to each row's Video Code.

---

## 3. Google App Campaigns (Google UAC Bulk Import CSV)

### File: `<game-id>_google_uac_bulk.csv`

### Specification Overview
Google App Campaigns automatically rotates text and video assets across Google Search, Google Play, YouTube, and the Google Display Network. Google imposes character constraints:
* `Headline 1` through `Headline 5`: Strictly constrained to 30 characters or fewer.
* `Description 1` through `Description 5`: Strictly constrained to 90 characters or fewer.
* `Final URL`: Store download destination link.

### Upload Workflow
1. In Google Ads, select your App Campaign.
2. Under Ad Groups, navigate to Ads & Assets.
3. Click More > Upload Spreadsheet or paste via Google Ads Editor.
4. Review headlines and descriptions; Google will rotate all combinations automatically.

---

## 4. AppLovin & Unity Ads Interactive Endcards

### Files: `<game-id>_applovin_specs.json`

### Specification Overview
AppLovin and Unity Ads use video combined with interactive MRAID endcards:
* MRAID v3 compliant HTML endcard snippets.
* Mobile portrait (9:16) orientation with auto-redirect button and star ratings.
* Structured JSON payload ready for automated programmatic asset ingestion.

---

## 5. Airtable and Notion Creative Pipelines

### Files: `<game-id>_airtable_cards.csv` and `<game-id>_airtable_cards.json`

### Pipeline Fields
* `Task ID`: Unique tracking key (e.g. `puzzle-script-asmr-satisfying-15s`).
* `Creative Title`: Human-readable task title for motion designers.
* `Angle Category`: Tag for Kanban board grouping.
* `Status`: Set to "Ready for Motion Production".
* `Target Duration`: 15s or 30s.
* `0-3s Visual Hook`: Direct scene instructions for the animator.
* `Text Overlay`: Exact text and styling for the video editor.
* `Audio & SFX Cue`: Sound design reference and voiceover direction.
* `Midjourney Prompt Recipe`: Ready-to-paste prompt for background and 3D asset generation.
* `Designer Notes`: Aspect ratio (9:16) and pacing instructions.

### Upload Workflow for Airtable
1. In Airtable, create a new table or choose an existing Creative Pipeline base.
2. Click Add Data > CSV File.
3. Select `<game-id>_airtable_cards.csv`.
4. Switch the view to "Kanban" grouped by `Angle Category` or `Status`.

---

## 6. Markdown Production Briefs

### File: `<game-id>_CREATIVE_BRIEFS.md`

Contains structured markdown tables for each angle, complete with:
* Timestamped beat breakdown (00:00 - 00:03, 00:03 - 00:08, etc.).
* Voiceover lines and pacing estimates (WPM).
* Visual scene descriptions and camera direction.
* Negative and positive Midjourney prompt blocks.

Can be pasted directly into Jira tickets, GitHub Discussions, or Notion pages.

---

## 7. Standalone Interactive HTML Storyboard with 9:16 Safe Zones

### File: `<game-id>_storyboard.html`

The HTML storyboard operates offline in any browser with zero external dependencies:
* Tab switching between the five psychological angles.
* Integrated audio and visual beat timeline player with play/pause and progress scrubbing.
* Interactive 9:16 mobile mockup mode testing TikTok and Instagram Reels UI safe zones.
* One-click clipboard copy buttons for prompt recipes.
* Character count badges for Meta, Google, and TikTok copy compliance.
