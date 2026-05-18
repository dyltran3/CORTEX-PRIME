# CORTEX-PRIME — Stitch UI Prompt Pack
> Prompt cho từng màn hình. Copy từng block vào Stitch, giữ nguyên format.
> Design language: Dark tech / Obsidian Blueprint. Dense information, không decorative.

---

## 🎨 MASTER DESIGN SYSTEM PROMPT
> **Paste vào đầu MỌI prompt trong Stitch. Đây là context bất biến.**

```
DESIGN SYSTEM — CORTEX-PRIME Personal OS

Color palette:
- Background primary: #0D0D0F (near-black void)
- Background secondary: #141416 (surface cards)
- Background elevated: #1C1C20 (modals, panels)
- Border subtle: #2A2A30 (dividers)
- Border strong: #3D3D45 (active states)
- Text primary: #F0F0F2 (headings, labels)
- Text secondary: #9090A0 (descriptions, metadata)
- Text muted: #5A5A68 (timestamps, placeholders)
- Accent blue: #3B82F6 (primary actions, active links)
- Accent purple: #8B5CF6 (knowledge nodes, AI actions)
- Accent amber: #F59E0B (warnings, Deep Work badge, deadlines)
- Accent green: #10B981 (success, mastered status, completed)
- Accent red: #EF4444 (burnout alert, security warning)
- Accent teal: #14B8A6 (synergy links, cross-vault connections)

Typography:
- Font family: JetBrains Mono (monospace for data), Inter (UI labels)
- Heading: Inter 600, #F0F0F2
- Body: Inter 400, 14px, #9090A0
- Code/data: JetBrains Mono 400, 13px, #C0C0D0
- Badge: Inter 500, 11px, uppercase

Component style:
- Cards: background #141416, border 1px solid #2A2A30, border-radius 8px, padding 16px
- Buttons primary: background #3B82F6, color white, border-radius 6px, no shadow
- Buttons secondary: background transparent, border 1px solid #3D3D45, color #9090A0
- Input fields: background #0D0D0F, border 1px solid #2A2A30, focus border #3B82F6
- Status badges: rounded-full, 11px uppercase text, specific background per status
  - acquired: background #1E293B, text #60A5FA
  - reviewing: background #292524, text #F59E0B
  - mastered: background #052e16, text #10B981
  - deep: background #1E1B4B, text #818CF8
  - shallow: background #1C1917, text #9090A0
- Sidebar: 240px wide, background #0A0A0C, border-right 1px solid #1C1C20
- No gradients. No shadows. No decorative illustrations. Data density over aesthetics.
```

---

## SCREEN 01 — MAIN DASHBOARD (HOME)
> **Paste vào Stitch sau Master Design System prompt**

```
Design a dark desktop dashboard for CORTEX-PRIME Personal OS.

Layout: Three-column layout.
- Left: 240px sidebar with vault navigation
- Center: main content area (~60% width)
- Right: 280px activity panel

LEFT SIDEBAR:
- App logo "CORTEX-PRIME" at top, monospace font, small version tag "v1.0"
- Navigation items with vault icons:
  [icon] Dashboard (active, highlighted in blue)
  [icon] 00 Inbox (badge showing 3 unprocessed)
  [icon] ⚛ Far-Phy
  [icon] 📐 Far-Math
  [icon] 🥷 Far-Sec (lock icon, different style — encrypted)
  [icon] 🤖 Far-AI
  [icon] 🗣 Far-Lang
  [icon] 📈 Far-Econ
  [icon] ⚖ Far-Law
  [icon] 🔬 Far-Res
  [icon] 09 Meta
- At bottom: small user section, "Script Runner" button

CENTER — TOP ROW (4 metric cards side by side):
- Card 1: "Knowledge Nodes" — large number 847, subtitle "total notes", trend "+12 this week"
- Card 2: "Deep Work Rate" — large number "67%", subtitle "7-day average", trend "↓ from 74%", amber colored number
- Card 3: "Papers in Progress" — number 4, subtitle "active research", status dots
- Card 4: "Mastered Concepts" — number 213, subtitle "flashcard mastered", green colored

CENTER — QUICK CAPTURE WIDGET:
- Prominent input area with placeholder "Brain dump here... (Cmd+K)"
- Below input: toggle chips [Task] [Knowledge] [Reference] [Auto-detect]
- Below: vault selector dropdown showing "Auto-detect by AI"
- Submit button "Process & File →" in accent blue

CENTER — RECENT ACTIVITY TABLE:
- Table title "Recent Notes" with small "View all →" link
- Columns: Title | Vault | Type | Status | Energy | Created
- 5-6 rows of mock data showing different vaults and statuses
- Compact rows, monospace for IDs, badges for status/energy

RIGHT PANEL — BURNOUT RADAR:
- Panel title "Cognitive Load — 7 days"
- Simple bar chart: 7 bars for 7 days, colored by deep/shallow ratio
- Below: "Deep Work Rate: 67%" with amber warning "Threshold: 70%"
- Alert box (subtle amber border): "2 of 3 days below threshold"

RIGHT PANEL — SYNERGY SPARKS:
- Section title "Recent Synergy Sparks"
- 3 connection cards, each showing:
  [vault tag] Far-Math ←→ Far-AI [teal line between]
  "Bayesian inference ↔ Adversarial ML"
  Similarity: 0.83 | [Create Link] button

RIGHT PANEL — TODAY FOCUS:
- "Today: Tuesday, May 15"
- 2 deep work blocks as time-blocked items with color coding
- Progress ring showing 1/2 deep blocks done
```

---

## SCREEN 02 — BRAIN DUMP / QUICK CAPTURE (MODAL)
> **Màn hình quan trọng nhất — xảy ra nhiều nhất trong ngày**

```
Design a full-screen modal overlay for CORTEX-PRIME "Quick Capture" / Brain Dump feature.

Modal: 720px wide, centered, background #1C1C20, rounded-12, subtle border.
Background: blurred dark overlay behind modal.

HEADER:
- Title "Quick Capture" with keyboard shortcut badge "⌘K"
- Close button (X) top right
- Small text: "AI will automatically classify and file your input"

INPUT SECTION:
- Large textarea: full width, min-height 180px, monospace font, background #0D0D0F
- Placeholder text (multi-line): 
  "Paste text, voice transcript, or raw thoughts here...
  
  Examples:
  • 'Need to implement Crank-Nicolson for heat equation PDE project'
  • 'CISG Article 79 exempts force majeure — check against client contract'
  • Paste any article, code snippet, or idea"
- Character counter bottom-right of textarea

AI PROCESSING PREVIEW (appears after user types, 0.5s debounce):
- Section title "AI Analysis Preview" with small "●  Processing" indicator
- Two-column grid showing detected items:
  LEFT — "Tasks found (2)":
    • [tag: Far-Math] [Deep Work] "Implement Crank-Nicolson method"
    • [tag: Far-Res] [Shallow] "Check CISG Art.79 reference"
  RIGHT — "Knowledge found (1)":
    • [tag: Far-Law] "CISG Article 79 — force majeure exemption"
- Detected primary vault: badge "Far-Math" (editable, dropdown)
- Energy level detected: "Deep Work" toggle (user can override)

MANUAL OVERRIDES:
- Row of vault selector chips (all 8 vaults), currently highlighted one
- Energy toggle: [Deep Work] [Shallow Work] — toggleable
- Extra tags input field: "#PDE #heat-equation"

ACTION BUTTONS:
- Primary: "Process & File →" (blue, full-width)
- Secondary: "File to Inbox only" (no AI processing, grey)
- Tertiary: "Save as Draft" (text link)

BOTTOM STATUS BAR:
- Small text: "API: Gemini Flash • Est. cost: $0.00 • Vault: local"
```

---

## SCREEN 03 — PAPER DECONSTRUCTOR
> **Upload PDF → AI phân tích → Note cấu trúc**

```
Design a two-panel desktop interface for CORTEX-PRIME "Paper Deconstructor" feature.

HEADER BAR:
- Breadcrumb: CORTEX-PRIME > Far-Res > Paper Deconstructor
- Right: "Model: Gemini 1.5 Pro" badge, "Free tier: 1.4M/1.5M tokens" progress bar

LEFT PANEL (40% width) — INPUT:
- Panel title "Upload Research Paper"
- Large drag-drop zone: dashed border #3D3D45, upload icon, text "Drop PDF here or click to browse"
- Below drop zone: file info card (show mock loaded state):
  - Filename: "attention_is_all_you_need.pdf"
  - Size: 14.8 MB | Pages: 15 | Status: ✓ Ready
  - Small preview thumbnail of first page (grey rectangle)
- Section "Extraction Settings":
  - Toggle row: [✓] Main Arguments [✓] Formulas (LaTeX) [✓] Research Gaps [  ] Full Summary
  - Target vault: "Far-AI" (auto-detected, dropdown to change)
  - Output format: "Obsidian Note" / "Raw JSON" radio
- Button "Deconstruct Paper →" (large, blue, full-width)
- Processing state (show in progress): animated progress bar, text "Analyzing page 8/15... Extracting formulas..."

RIGHT PANEL (60% width) — OUTPUT:
- Panel title "Extracted Knowledge" with "Copy all" and "Save to Vault" buttons
- Tabbed interface:
  TAB 1 "Summary" (active):
    - Sub-section "Main Thesis" — 2-3 lines of extracted text
    - Sub-section "Methodology" — bullet points
    - Sub-section "Key Results" — bullet points
    - Sub-section "Research Gaps" — 3 gap items with [Create Research Note] button next to each
  
  TAB 2 "Formulas (LaTeX)":
    - Header: "7 formulas extracted"
    - Each formula card:
      LaTeX code block (rendered if possible)
      Below: [tag: Far-Math] [Copy LaTeX] [Open in Jupyter] buttons
      Formula description: "Scaled dot-product attention mechanism"
  
  TAB 3 "Citation":
    - Auto-generated BibTeX block in code box
    - [Copy BibTeX] [Add to Zotero] buttons
    - DOI field, year, authors extracted

  TAB 4 "Raw JSON":
    - Formatted JSON of full extraction result
    - [Copy JSON] button
```

---

## SCREEN 04 — KNOWLEDGE GRAPH VIEW
> **Đồ thị tri thức — Synergy Sparks visualization**

```
Design a full-screen knowledge graph visualization interface for CORTEX-PRIME.

TOOLBAR (top, 48px height, dark bar):
- Left: "Knowledge Graph" title, node count "847 nodes, 1,203 links"
- Center: Search input "Filter nodes..." with vault filter chips:
  [All] [Far-Phy] [Far-Math] [Far-Sec] [Far-AI] [Far-Lang] [Far-Econ] [Far-Law] [Far-Res]
- Right: zoom controls (+/-), [Layout: Force] dropdown, [Export] button

MAIN GRAPH AREA (full remaining height):
- Dark background #0A0A0C
- Force-directed node graph:
  - Nodes: circles, size proportional to connection count
  - Color by vault:
    Far-Phy: #818CF8 (purple-blue)
    Far-Math: #60A5FA (blue)
    Far-Sec: #EF4444 (red — security)
    Far-AI: #A78BFA (purple)
    Far-Lang: #34D399 (green)
    Far-Econ: #F59E0B (amber)
    Far-Law: #F97316 (orange)
    Far-Res: #E2E8F0 (white-ish)
  - Regular links: thin lines #2A2A30
  - Synergy Spark links: thicker teal lines #14B8A6 with glow effect
  - Selected node: white ring around node, brighter
  - Hovered node: shows tooltip with note title, vault, status

GRAPH — CLUSTER VISUALIZATION:
- Show 3-4 obvious clusters (vault groups)
- Several teal cross-cluster synergy lines connecting nodes from different vault groups
- One node highlighted (selected): "Bayesian inference methods" (Far-Math cluster)

RIGHT SIDEBAR (280px, slides in when node selected):
- "Node Details" header with close button
- Selected node info:
  Title: "Bayesian inference methods"
  Vault: [Far-Math badge]
  Status: [reviewing badge]
  Energy: [deep badge]
  Created: 2026-04-12
  Tags: #probability #inference #bayesian
- Section "Connected to (8 nodes)":
  - 5 same-vault connections (list items)
  - 3 Synergy Spark connections in teal:
    • [Far-AI] "Adversarial ML — probabilistic defense" (0.83 similarity)
    • [Far-Res] "Paper: Bayesian Deep Learning survey" (0.79 similarity)
    • [Far-Sec] "Anomaly detection in network traffic" (0.76 similarity)
- Button "Open Note" and "Create Synergy Note"

BOTTOM STATUS BAR:
- "Last updated: 2 hours ago" | "Smart Connections: Active" | "847 nodes indexed"
```

---

## SCREEN 05 — VAULT VIEW (FAR-RES EXAMPLE)
> **Màn hình xem từng vault — dùng Far-Res làm example**

```
Design a vault-specific view for CORTEX-PRIME, showing the "Far-Res" (Research) vault.

HEADER:
- Vault title: "🔬 Far-Res — Research & Papers"
- Stats row: "4 active papers | 47 literature notes | 12 synergy connections"
- Tabs: [Papers] [Literature] [Synergy] [Timeline]

TAB — PAPERS (active):
- Section shows 4 paper project cards in a 2x2 grid
- Each card has:
  - Paper number and short title: "Paper 01 — Thermal Simulation via ML"
  - Progress indicator: "Draft v3 in progress" with a small progress bar (60%)
  - Domain tags: [Far-Phy] [Far-Math] [Far-AI]
  - Last modified: "3 days ago"
  - Action buttons: [Open Draft] [View Notes] [Export PDF]
  - Status badge: "Writing" / "Literature Review" / "Submitted"

BELOW GRID — PAPER TIMELINE:
- Horizontal Gantt-style timeline for 4 papers
- Q3 2026 through Q2 2027 visible
- Color bars showing: Literature Review (blue), Writing (purple), Review (amber), Submitted (green)

RIGHT SIDEBAR:
- "Paper Health" section for currently selected paper:
  - Citation count: 23 references collected
  - LaTeX formulas linked: 8
  - Synergy connections: 5 cross-vault links
  - Word count estimate: ~4,200 words
- "Related Literature (recent)":
  - 3 most recently added paper notes with similarity to current paper
- "Suggested Next Action":
  [AI icon] "3 literature notes from Far-Math have 0.81+ similarity to your Paper 01 — consider cross-referencing"
  [Create Synergy Note] button
```

---

## SCREEN 06 — BURNOUT RADAR (WEEKLY REPORT)
> **Dashboard sức khỏe nhận thức**

```
Design a "Burnout Radar" weekly cognitive load report screen for CORTEX-PRIME.

HEADER:
- Title "Cognitive Load Report — Week 20, 2026"
- Status badge: [⚠️ WARNING] amber colored — "Deep Work rate below threshold"
- "Generated by burnout_radar.py • Sunday 20:00 auto-run"

TOP METRICS ROW (4 cards):
- Card 1 "Deep Work Sessions" — "11 sessions", subtitle "target: 14/week", red colored
- Card 2 "Avg Session Length" — "87 min", subtitle "target: 90 min", green colored  
- Card 3 "Knowledge Notes" — "34 created", subtitle "this week", neutral
- Card 4 "Vault Coverage" — "5/8 vaults", subtitle "touched this week", neutral

MAIN CHART — 7-DAY BREAKDOWN:
- Stacked horizontal bar chart for each day
- Each bar split into: Deep Work (blue) | Shallow Work (grey) | No work (dark)
- Day labels: Mon-Sun with date
- Show percentage label on each segment
- Monday had 0 deep work — full grey bar
- Wednesday and Thursday show good deep/shallow ratio
- Friday shows only shallow work

ALERT BOX (amber bordered card):
- Icon ⚠️ "Burnout Risk Detected"
- "3 consecutive days (Mon, Tue, Fri) below 40% Deep Work threshold"
- Recommendation section:
  "AI Recommendation for next week:"
  • Reduce Deep Work tasks by 30% (target: 10 sessions instead of 14)
  • Add 1 rest day — no Deep Work scheduled for Wednesday
  • Prioritize: Far-Res Paper 01 (most time-sensitive)
  • Defer: Far-AI GPU optimization study (low urgency)
- [Apply to Next Week Template] button (blue)
- [Dismiss Warning] button (ghost)

VAULT DISTRIBUTION CHART:
- Simple horizontal bar chart showing time spent per vault this week
- Far-Res: 40% (longest bar, highlighted)
- Far-Math: 25%
- Far-Phy: 15%
- Far-AI: 10%
- Others: 10%

TREND SECTION (last 4 weeks):
- Simple sparkline for Deep Work rate: shows declining trend
- Annotation: "Peak: Week 17 (82%) → Current: Week 20 (54%)"
```

---

## SCREEN 07 — SETTINGS / CONFIGURATION
> **Cấu hình hệ thống — API keys, thresholds, vault paths**

```
Design a settings page for CORTEX-PRIME with dark theme.

Layout: Left sidebar for settings categories + right content area.

LEFT SIDEBAR (settings nav):
- API Configuration (active)
- Vault Settings
- AI Behaviour
- Burnout Thresholds
- Script Scheduler
- Security (Far-Sec)
- About

RIGHT CONTENT — "API Configuration" (shown):

SECTION "AI Models":
- Card with form:
  Label "Gemini API Key"
  Input: password type, value "AIza••••••••••••••XYZ", [Reveal] [Test Connection] buttons
  Status: ✅ Connected • Last tested: 10 min ago
  
  Label "Primary Model (fast tasks)"
  Dropdown: "gemini-1.5-flash" selected
  
  Label "Primary Model (long context / PDFs)"
  Dropdown: "gemini-1.5-pro" selected
  
  Label "Token Budget per Day"
  Slider: 0 — 1,000,000 with current marker at 500,000
  Text: "Daily usage: 45,230 / 500,000 tokens (9%)"

SECTION "Local LLM (Far-Sec vault)":
- Card:
  Toggle "Enable Local LLM for Far-Sec": ON
  Label "Ollama Endpoint": input "http://localhost:11434"
  Label "Model": dropdown "mistral:7b"
  Status: ⚠️ Offline — Ollama not running
  Button [Start Ollama] (runs shell command)
  Info text: "When enabled, Far-Sec vault content NEVER leaves this machine"

SECTION "AnkiConnect":
- Card:
  Label "AnkiConnect URL": input "http://localhost:8765"
  Label "Default Deck": input "CORTEX-PRIME"
  Status: ✅ Connected • Anki running
  Button [Test Connection]

SECTION "Danger Zone" (red bordered card):
- "Reset all settings to defaults" — [Reset] button
- "Clear AI cache" — [Clear Cache] button
- "Export all settings as JSON" — [Export] button

BOTTOM:
- [Save Changes] primary button
- "Changes save automatically" small text
```

---

## SCREEN 08 — MOBILE QUICK CAPTURE (iOS/Android)
> **Màn hình mobile — compact version của Brain Dump**

```
Design a mobile Quick Capture screen for CORTEX-PRIME, 390px width, dark theme.

This is the most-used screen on mobile — it must be one-handed operable.

HEADER (compact):
- Small "CORTEX-PRIME" wordmark left
- Right: vault indicator current "Auto" and settings gear icon

MAIN INPUT (takes ~50% of screen):
- Large textarea, full width, monospace font
- Placeholder: "Dump your thoughts here..."
- Voice input button (microphone icon) — floating bottom-right of textarea
- Character count: "0 / 5000"

AI PREVIEW STRIP (collapsed by default, expands after 1s of no typing):
- Compact horizontal strip showing:
  "Detected: [Far-Math chip] [Deep Work chip] [2 tasks] [1 knowledge]"
- Tap to expand full preview

VAULT QUICK-SELECT (horizontal scroll):
- Row of vault chips, horizontally scrollable:
  [Auto] [Phy] [Math] [Sec] [AI] [Lang] [Econ] [Law] [Res]
- Currently selected highlighted in blue

BOTTOM ACTION AREA (sticky, above keyboard):
- Full-width button "Process & File →" (blue, 48px height, easy thumb tap)
- Below: two smaller buttons side by side:
  [Inbox only]  [Save draft]

KEYBOARD VISIBLE STATE:
- When keyboard appears, textarea shrinks, action buttons stay visible above keyboard
- Header collapses to just the vault indicator
```

---

## 🔧 STITCH WORKFLOW TIPS

1. **Bắt đầu với Screen 01** (Dashboard) để thiết lập visual language tổng thể
2. **Luôn paste Master Design System** vào đầu mỗi prompt — Stitch không giữ context giữa các màn hình
3. Sau khi có Screen 01, **screenshot và paste vào prompt Screen 02+** để Stitch match style
4. **Thứ tự đề xuất build:** 01 → 02 → 06 → 03 → 04 → 05 → 07 → 08
5. Nếu Stitch generate sai màu, thêm vào cuối prompt: *"Ensure background is #0D0D0F (near-black), not #1A1A2E or any other shade"*
6. Để export code từ Stitch: chọn frame → "Copy as" → React / Tailwind CSS

---

*CORTEX-PRIME Stitch Prompt Pack — v1.0*
*8 screens | 1 master design system | Sẵn sàng để paste*
