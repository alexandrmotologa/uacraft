import { CreativePackage, AngleTypeLabels } from "../../types";

export function exportHtmlStoryboard(pkg: CreativePackage): string {
  const jsonPayload = JSON.stringify(pkg);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UACraft Storyboard: ${pkg.gameTitle}</title>
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --text-bright: #f0f6fc;
      --accent: #58a6ff;
      --accent-hover: #1f6feb;
      --success: #238636;
      --warning: #d29922;
      --danger: #f85149;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-family);
      line-height: 1.5;
      padding: 24px;
    }

    header {
      max-width: 1200px;
      margin: 0 auto 24px auto;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    h1 {
      font-size: 24px;
      color: var(--text-bright);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #21262d;
      color: var(--accent);
      border: 1px solid var(--border);
    }

    .metrics-bar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .metric-pill {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
    }

    .metric-pill strong {
      color: var(--text-bright);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .tab-btn {
      background: var(--card-bg);
      color: var(--text);
      border: 1px solid var(--border);
      padding: 10px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      border-color: var(--accent);
      color: var(--text-bright);
    }

    .tab-btn.active {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    .section-title {
      font-size: 18px;
      color: var(--text-bright);
      margin: 24px 0 12px 0;
      border-left: 4px solid var(--accent);
      padding-left: 10px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #21262d;
      padding-bottom: 8px;
    }

    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-bright);
    }

    .text-overlay-box {
      background: #090d13;
      border-left: 3px solid var(--warning);
      padding: 10px 14px;
      border-radius: 4px;
      font-weight: 600;
      color: #ffd33d;
      font-size: 14px;
    }

    .audio-box {
      font-size: 13px;
      color: #8b949e;
      background: #11161d;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px dashed var(--border);
    }

    .char-badge {
      font-size: 11px;
      color: #8b949e;
      float: right;
    }

    /* Script timeline player */
    .timeline-container {
      background: #090d13;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .timeline-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .play-btn {
      background: var(--success);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .play-btn:hover {
      background: #2ea043;
    }

    .progress-bar-container {
      flex: 1;
      height: 8px;
      background: #21262d;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
    }

    .progress-bar {
      height: 100%;
      background: var(--accent);
      border-radius: 4px;
      width: 0%;
      transition: width 0.1s linear;
    }

    .timer-display {
      font-family: monospace;
      font-size: 14px;
      color: var(--text-bright);
      min-width: 60px;
    }

    .beats-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .beat-row {
      display: grid;
      grid-template-columns: 100px 120px 1fr 1fr;
      gap: 12px;
      padding: 10px 14px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    .beat-row.active {
      border-color: var(--accent);
      background: #1b263b;
    }

    .copy-btn {
      background: #21262d;
      border: 1px solid var(--border);
      color: var(--text-bright);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      align-self: flex-start;
    }

    .copy-btn:hover {
      background: #30363d;
      border-color: var(--accent);
    }

    pre {
      background: #090d13;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 12px;
      border: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>UACraft Storyboard: ${pkg.gameTitle} <span class="badge">v${pkg.engineVersion}</span></h1>
      <p style="color: #8b949e; font-size: 13px; margin-top: 4px;">Provider: ${pkg.providerUsed} | Generated ${pkg.generatedAt}</p>
    </div>
    <div class="metrics-bar">
      <div class="metric-pill">Hooks: <strong>${pkg.summary.totalHooks}</strong></div>
      <div class="metric-pill">Copies: <strong>${pkg.summary.totalCopies}</strong></div>
      <div class="metric-pill">Scripts: <strong>${pkg.summary.totalScripts}</strong></div>
      <div class="metric-pill">Prompts: <strong>${pkg.summary.totalPrompts}</strong></div>
      <div class="metric-pill">Testing Window: <strong>${pkg.summary.estimatedTestingDurationDays}d</strong></div>
    </div>
  </header>

  <div class="container">
    <div class="tabs" id="angleTabs"></div>
    <div id="contentArea"></div>
  </div>

  <script>
    const packageData = ${jsonPayload};
    const angleLabels = ${JSON.stringify(AngleTypeLabels)};
    let currentAngle = packageData.anglesGenerated[0] || 'asmr-satisfying';
    let playbackInterval = null;
    let playbackSeconds = 0;
    let currentScriptDuration = 15;

    function renderTabs() {
      const tabsEl = document.getElementById('angleTabs');
      tabsEl.innerHTML = '';
      packageData.anglesGenerated.forEach(angle => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (angle === currentAngle ? ' active' : '');
        btn.textContent = angleLabels[angle] || angle;
        btn.onclick = () => {
          stopPlayback();
          currentAngle = angle;
          renderTabs();
          renderContent();
        };
        tabsEl.appendChild(btn);
      });
    }

    function copyToClipboard(text, btn) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = '#3fb950';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.color = '';
        }, 1500);
      });
    }

    function startPlayback(durationSec, beats) {
      stopPlayback();
      const playBtn = document.getElementById('playBtn');
      const progressBar = document.getElementById('progressBar');
      const timerDisplay = document.getElementById('timerDisplay');
      currentScriptDuration = durationSec;

      if (playBtn) playBtn.textContent = 'Pause';

      playbackInterval = setInterval(() => {
        playbackSeconds += 0.2;
        if (playbackSeconds > durationSec) {
          playbackSeconds = 0;
        }

        const pct = (playbackSeconds / durationSec) * 100;
        if (progressBar) progressBar.style.width = pct + '%';
        if (timerDisplay) timerDisplay.textContent = playbackSeconds.toFixed(1) + 's / ' + durationSec + 's';

        // Highlight active beat
        let accumulated = 0;
        beats.forEach((beat, idx) => {
          const row = document.getElementById('beat-row-' + idx);
          const start = accumulated;
          const end = accumulated + beat.durationSec;
          accumulated = end;

          if (row) {
            if (playbackSeconds >= start && playbackSeconds < end) {
              row.classList.add('active');
            } else {
              row.classList.remove('active');
            }
          }
        });
      }, 200);
    }

    function stopPlayback() {
      if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
      }
      const playBtn = document.getElementById('playBtn');
      if (playBtn) playBtn.textContent = 'Play Script';
    }

    function renderContent() {
      const area = document.getElementById('contentArea');
      const hooks = packageData.hooks.filter(h => h.angle === currentAngle);
      const copies = packageData.copies.filter(c => c.angle === currentAngle);
      const scripts = packageData.scripts.filter(s => s.angle === currentAngle);
      const prompts = packageData.visualPrompts.filter(p => p.angle === currentAngle);

      let html = '';

      // Hooks Section
      html += '<h2 class="section-title">3-Second Opening Thumbstop Hooks</h2>';
      html += '<div class="grid-2">';
      hooks.forEach(hook => {
        html += \`
          <div class="card">
            <div class="card-header">
              <span class="card-title">\${hook.headline}</span>
              <span class="badge">Thumbstop: \${hook.thumbstopScoreEstimate}/100</span>
            </div>
            <div class="text-overlay-box">"\${hook.textOverlay}"</div>
            <p style="font-size: 13px;"><strong>Visual Action:</strong> \${hook.visualAction}</p>
            <div class="audio-box"><strong>Audio/SFX:</strong> \${hook.audioDirection}</div>
            <p style="font-size: 12px; color: #8b949e;"><strong>Driver:</strong> \${hook.psychologyBreakdown}</p>
          </div>
        \`;
      });
      html += '</div>';

      // Scripts Section & Timeline Player
      if (scripts.length > 0) {
        const activeScript = scripts[0];
        html += '<h2 class="section-title">Interactive Script Timeline (' + activeScript.durationSec + 's)</h2>';
        html += \`
          <div class="timeline-container">
            <div class="timeline-controls">
              <button class="play-btn" id="playBtn" onclick="togglePlay()">Play Script</button>
              <div class="progress-bar-container" onclick="seek(event)">
                <div class="progress-bar" id="progressBar"></div>
              </div>
              <div class="timer-display" id="timerDisplay">0.0s / \${activeScript.durationSec}s</div>
            </div>
            <div class="beats-list">
        \`;

        activeScript.beats.forEach((b, idx) => {
          html += \`
            <div class="beat-row" id="beat-row-\${idx}">
              <div><strong>\${b.timestamp}</strong><br><span style="color:#8b949e;">\${b.segment}</span></div>
              <div><strong style="color: #ffd33d;">"\${b.textOverlay}"</strong></div>
              <div>\${b.visualScene}</div>
              <div><em style="color:#58a6ff;">VO:</em> \${b.voiceover || '(No VO)'}<br><span style="color:#8b949e; font-size:11px;">SFX: \${b.audioSFX}</span></div>
            </div>
          \`;
        });

        html += '</div></div>';
      }

      // Ad Copy Variations
      html += '<h2 class="section-title">Ad Copy Variations (Meta & TikTok)</h2>';
      html += '<div class="grid-2">';
      copies.forEach(copy => {
        html += \`
          <div class="card">
            <div class="card-header">
              <span class="card-title">\${copy.targetNetwork.toUpperCase()} Format</span>
              <span class="badge">\${copy.callToAction}</span>
            </div>
            <p style="font-size: 14px; font-weight: 600; color: #f0f6fc;">
              Headline: \${copy.headline}
              <span class="char-badge">\${copy.headline.length}/40</span>
            </p>
            <p style="font-size: 13px;">
              Primary Text: \${copy.primaryTextShort}
              <span class="char-badge">\${copy.primaryTextShort.length}/125</span>
            </p>
            <details style="font-size: 12px; margin-top: 6px;">
              <summary style="cursor:pointer; color: #58a6ff;">View Long Primary Text</summary>
              <pre style="margin-top: 8px;">\${copy.primaryTextLong}</pre>
            </details>
          </div>
        \`;
      });
      html += '</div>';

      // Visual Prompts
      html += '<h2 class="section-title">Motion Designer Prompt Recipes (Midjourney / Flux)</h2>';
      html += '<div class="grid-2">';
      prompts.forEach((p, idx) => {
        html += \`
          <div class="card">
            <div class="card-header">
              <span class="card-title">\${p.assetType.toUpperCase()} (\${p.aspectRatio})</span>
              <button class="copy-btn" onclick="copyToClipboard(this.getAttribute('data-prompt'), this)" data-prompt="\${p.prompt.replace(/"/g, '&quot;')}">Copy Prompt</button>
            </div>
            <pre>\${p.prompt}</pre>
            <p style="font-size: 12px; color: #8b949e;"><strong>Notes:</strong> \${p.designNotes}</p>
          </div>
        \`;
      });
      html += '</div>';

      area.innerHTML = html;
    }

    function togglePlay() {
      const scripts = packageData.scripts.filter(s => s.angle === currentAngle);
      if (scripts.length === 0) return;
      const activeScript = scripts[0];

      if (playbackInterval) {
        stopPlayback();
      } else {
        startPlayback(activeScript.durationSec, activeScript.beats);
      }
    }

    function seek(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const scripts = packageData.scripts.filter(s => s.angle === currentAngle);
      if (scripts.length === 0) return;
      playbackSeconds = pct * scripts[0].durationSec;
      if (!playbackInterval) {
        togglePlay();
      }
    }

    renderTabs();
    renderContent();
  </script>
</body>
</html>`;
}
