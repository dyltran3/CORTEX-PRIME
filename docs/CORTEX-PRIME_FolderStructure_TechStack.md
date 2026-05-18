# CORTEX-PRIME — Folder Structure & Tech Stack
> Version 1.0 | Chi phí: 0 VND/tháng | Local-First

---

## 📁 Cấu trúc thư mục đầy đủ

```
~/cortex-prime/
│
├── 📓 vault/                          ← Obsidian vault root (toàn bộ knowledge base)
│   │
│   ├── 00-inbox/                      ← Brain Dump đến đây trước khi phân loại
│   │   ├── _daily/                    ← Daily notes (tạo tự động mỗi ngày)
│   │   │   └── 2026-05-15.md
│   │   └── _quick-capture/            ← Output của brain_dump.py
│   │
│   ├── 01-far-phy/                    ← Vật lý hiện đại & cổ điển
│   │   ├── _index.md                  ← Bản đồ vault (Dataview query)
│   │   ├── quantum/
│   │   │   ├── QM-fundamentals.md
│   │   │   ├── entanglement-bell.md
│   │   │   └── ...
│   │   ├── qft/
│   │   ├── classical/
│   │   └── simulations/               ← Link đến Jupyter notebooks
│   │
│   ├── 02-far-math/                   ← Toán học
│   │   ├── _index.md
│   │   ├── calculus/
│   │   │   ├── PDE-heat-equation.md
│   │   │   └── complex-analysis.md
│   │   ├── tensor/
│   │   ├── probability/
│   │   └── linear-algebra/
│   │
│   ├── 03-far-sec/                    ← Bảo mật (KHÔNG đồng bộ cloud)
│   │   ├── _index.md                  ← Encrypted với Veracrypt
│   │   ├── web/
│   │   ├── firmware/
│   │   ├── rf/
│   │   └── ai-security/
│   │
│   ├── 04-far-ai/                     ← AI & Machine Learning
│   │   ├── _index.md
│   │   ├── gpu-opencl/
│   │   ├── fine-tuning/
│   │   ├── architectures/
│   │   └── papers/                    ← Link tới Far-Res
│   │
│   ├── 05-far-lang/                   ← Ngôn ngữ
│   │   ├── _index.md
│   │   ├── chinese/
│   │   │   ├── HSK4/
│   │   │   ├── HSK5/
│   │   │   └── HSK6/
│   │   └── english/
│   │       ├── academic-writing/
│   │       └── vocabulary/
│   │
│   ├── 06-far-econ/                   ← Kinh tế & Tài chính
│   │   ├── _index.md
│   │   ├── corporate-finance/
│   │   ├── marketing/
│   │   └── growth-models/
│   │
│   ├── 07-far-law/                    ← Pháp lý
│   │   ├── _index.md
│   │   ├── international-trade/
│   │   │   ├── CISG.md
│   │   │   └── incoterms.md
│   │   ├── ip-law/
│   │   └── corporate-law/
│   │
│   ├── 08-far-res/                    ← Nghiên cứu & Papers
│   │   ├── _index.md
│   │   ├── paper-01-[title]/          ← Mỗi paper có folder riêng
│   │   │   ├── draft-v1.md
│   │   │   ├── draft-v2.md
│   │   │   ├── notes.md
│   │   │   └── refs.bib
│   │   ├── paper-02-[title]/
│   │   ├── paper-03-[title]/
│   │   ├── paper-04-[title]/
│   │   ├── literature/                ← Note từ Paper Deconstructor
│   │   └── portfolio.md
│   │
│   ├── 09-meta/                       ← Quản lý hệ thống
│   │   ├── weekly-reviews/            ← Burnout Radar output
│   │   ├── synergy-reports/           ← Cross-vault connection reports
│   │   ├── kanban.md                  ← Kanban board (plugin Kanban)
│   │   └── roadmap.md                 ← 12-quarter roadmap
│   │
│   └── .obsidian/                     ← Obsidian config (commit vào Git)
│       ├── plugins/
│       └── workspace.json
│
├── 🐍 scripts/                        ← Python automation scripts
│   ├── brain_dump.py                  ← Module 1: Semantic Workstream
│   ├── paper_deconstructor.py         ← Module 2: PDF → LaTeX notes
│   ├── burnout_radar.py               ← Module 3: Cognitive load monitor
│   ├── anki_sync.py                   ← Module 4: Spaced repetition bridge
│   ├── synergy_spark.py               ← Module 5: Cross-vault linker
│   ├── git_backup.py                  ← Auto commit & push hàng ngày
│   ├── config.py                      ← Centralized config (paths, thresholds)
│   └── utils/
│       ├── gemini_client.py           ← Wrapper cho Gemini API
│       ├── obsidian_writer.py         ← Helper tạo/đọc Markdown files
│       └── vault_scanner.py           ← Scan và index vault content
│
├── 📓 notebooks/                      ← Jupyter simulation hub
│   ├── templates/
│   │   ├── FEM_heat_template.ipynb
│   │   ├── FEM_fluid_template.ipynb
│   │   └── signal_analysis_template.ipynb
│   ├── far-phy/
│   ├── far-math/
│   └── eureka-log/                    ← Snapshot từ Eureka button
│
├── 📚 zotero-exports/                 ← BibTeX exports từ Zotero
│   └── cortex-prime-library.bib
│
├── 📊 logs/                           ← Script logs
│   ├── brain_dump.log
│   ├── burnout_radar.log
│   └── anki_sync.log
│
├── .env                               ← API keys (KHÔNG commit Git)
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🔐 .gitignore

```gitignore
# API keys và secrets
.env
*.env.local

# Far-Sec vault (KHÔNG bao giờ commit)
vault/03-far-sec/

# Jupyter outputs (lớn, thay đổi liên tục)
notebooks/**/*.ipynb
notebooks/**/output/
!notebooks/templates/*.ipynb

# Logs
logs/*.log

# Python cache
__pycache__/
*.pyc
*.pyo
.pytest_cache/

# OS files
.DS_Store
Thumbs.db

# Zotero storage (PDF files lớn)
zotero-exports/*.pdf
```

---

## 📦 requirements.txt

```txt
# Core AI
google-generativeai>=0.7.0        # Gemini API client
openai>=1.0.0                      # Backup: OpenAI API (nếu cần)

# Obsidian / Markdown processing
python-frontmatter>=1.0.0          # Đọc/ghi YAML frontmatter
markdown>=3.5.0                    # Parse Markdown

# HTTP & API
requests>=2.31.0                   # AnkiConnect, general HTTP
httpx>=0.27.0                      # Async HTTP client

# Data processing
python-dotenv>=1.0.0               # .env file loading
pydantic>=2.0.0                    # Data validation / JSON schema

# File handling
pathlib                            # Built-in, no install needed
watchdog>=4.0.0                    # Watch vault for file changes (optional)

# PDF (nếu cần pre-process trước khi gửi Gemini)
pypdf>=4.0.0                       # Extract text từ PDF locally

# Utilities
rich>=13.0.0                       # Beautiful terminal output / logging
schedule>=1.2.0                    # Cron-style scheduler trong Python
click>=8.1.0                       # CLI interface cho scripts
```

---

## 🛠️ Tech Stack chi tiết

### Layer 1 — Storage & Versioning

| Công cụ | Version | Cài đặt | Dùng cho |
|---------|---------|---------|---------|
| **Obsidian** | Latest free | [obsidian.md](https://obsidian.md) | Vault, editor, graph view |
| **Git** | 2.x | System package | Version control vault |
| **GitHub** | Free | github.com | Remote backup, private repo |
| **Veracrypt** | 1.26+ | [veracrypt.fr](https://veracrypt.fr) | Encrypt Far-Sec vault |
| **Zotero** | 7.x | [zotero.org](https://zotero.org) | PDF management, BibTeX |

### Layer 2 — Obsidian Plugins (Cài qua Community Plugins)

| Plugin | ID | Dùng cho | Bắt buộc? |
|--------|-----|---------|-----------|
| **Dataview** | `blacksmithgu/obsidian-dataview` | Query vault như SQL | ✅ Must |
| **Templater** | `SilentVoid13/Templater` | Template động, gọi script | ✅ Must |
| **Calendar** | `liamcain/obsidian-calendar-plugin` | Daily note navigation | ✅ Must |
| **Smart Connections** | `brianpetro/obsidian-smart-connections` | Vector similarity, Synergy Sparks | ✅ Must |
| **Kanban** | `mgmeyers/obsidian-kanban` | Task board trong vault | ✅ Must |
| **Excalidraw** | `zsviczian/obsidian-excalidraw-plugin` | Vẽ diagram trong vault | Should |
| **Obsidian Git** | `denolehov/obsidian-git` | Auto-commit từ trong Obsidian | Should |
| **Advanced Tables** | `tgrosinger/advanced-tables-obsidian` | Chỉnh sửa bảng dễ dàng | Could |

### Layer 3 — AI & Automation

| Công cụ | API/CLI | Free Tier | Dùng cho |
|---------|---------|-----------|---------|
| **Gemini 1.5 Flash** | REST API | 1M tok/day, 1500 req/day | Brain Dump, tagging nhanh |
| **Gemini 1.5 Pro** | REST API | 1.5M tok/day (preview) | Paper Deconstructor |
| **Ollama + Mistral 7B** | Local CLI | 0 (cần ≥16GB RAM) | Far-Sec vault processing |
| **Python 3.11+** | Runtime | Miễn phí | Tất cả automation scripts |
| **AnkiConnect** | REST localhost:8765 | Miễn phí | Tạo Anki cards từ script |

### Layer 4 — Research & Simulation

| Công cụ | Cài đặt | Dùng cho |
|---------|---------|---------|
| **Jupyter Lab** | `pip install jupyterlab` | Simulation hub, EDA |
| **SymPy** | `pip install sympy` | Symbolic math, giải PDE |
| **NumPy + SciPy** | `pip install numpy scipy` | Numerical computation |
| **Matplotlib + Plotly** | `pip install matplotlib plotly` | Visualization |
| **FEniCS/FEniCSx** | Docker hoặc conda | FEM simulation |
| **Manim** | `pip install manim` | Render math animation |
| **Overleaf** | overleaf.com (free) | LaTeX paper writing, collaboration |

### Layer 5 — Language Learning

| Công cụ | Dùng cho | Chi phí |
|---------|---------|---------|
| **Anki Desktop** | Spaced repetition chính | Miễn phí |
| **AnkiConnect** | REST API bridge với Python | Miễn phí |
| **Language Reactor** | Chrome extension, learn từ video | Free tier đủ dùng |
| **Hanzicraft** | Phân tích chữ Hán | Miễn phí web |

---

## 🗂️ Obsidian Note Templates

### Template: Knowledge Note
```markdown
---
id: {{vault_prefix}}-{{date:YYYY}}-{{timestamp}}
title: "{{title}}"
created: {{date:YYYY-MM-DD}}
modified: {{date:YYYY-MM-DD}}
vault: {{vault}}
type: knowledge
status: acquired
energy: {{energy}}
tags: [{{tags}}]
source: "{{source}}"
anki_id: null
synergy_links: []
---

## Khái niệm

{{definition}}

## Liên kết trong vault

- 

## Câu hỏi mở

- [ ] 

## Flashcard
> #flashcard
> **Q:** {{question}}
> **A:** {{answer}}
```

### Template: Task Note
```markdown
---
id: TASK-{{date:YYYY}}-{{timestamp}}
title: "{{title}}"
created: {{date:YYYY-MM-DD}}
due: {{due_date}}
vault: {{vault}}
type: task
status: todo
energy: {{energy}}
tags: [task, {{tags}}]
---

## Hành động

{{action}}

## Định nghĩa hoàn thành (DoD)

- [ ] 

## Ghi chú
```

### Template: Paper Note (Far-Res)
```markdown
---
id: RES-{{date:YYYY}}-{{timestamp}}
title: "{{paper_title}}"
created: {{date:YYYY-MM-DD}}
vault: far-res
type: paper
status: reading
citation_key: {{bibtex_key}}
doi: "{{doi}}"
tags: [paper, {{domain_tags}}]
---

## Ý tưởng chính

{{main_idea}}

## Phương pháp

{{methods}}

## Công thức chính

$$
{{latex_formula}}
$$

## Hạn chế & Khoảng trống

{{gaps}}

## Câu hỏi nghiên cứu từ paper này

- 

## Link tới vault

- [[Far-Math]] — {{math_connection}}
- [[Far-Phy]] — {{physics_connection}}
```

### Template: Daily Note
```markdown
---
date: {{date:YYYY-MM-DD}}
type: daily
week: {{date:W}}
---

## 🎯 Focus hôm nay

> Deep Work target: **X giờ**

### Deep Work blocks
- [ ] 09:00–11:00 | {{deep_task_1}}
- [ ] 14:00–16:00 | {{deep_task_2}}

### Shallow Work
- [ ] {{shallow_tasks}}

## 📥 Brain Dump

<!-- Paste thô vào đây, script sẽ xử lý -->

## 📊 Cuối ngày

- Deep Work thực tế: X giờ
- Năng lượng tổng thể: 🔴 Thấp / 🟡 Trung bình / 🟢 Cao
- Ghi chú:

## 🔗 Notes được tạo hôm nay

```dataview
LIST
FROM ""
WHERE created = date("{{date:YYYY-MM-DD}}")
SORT file.name ASC
```
```

---

## ⚙️ Cấu hình Gemini API

### Lấy API key miễn phí
1. Truy cập [aistudio.google.com](https://aistudio.google.com)
2. Đăng nhập Google → Get API Key → Create API Key in new project
3. Copy key vào file `.env`:

```bash
# .env
GEMINI_API_KEY=your_key_here
GEMINI_FLASH_MODEL=gemini-1.5-flash
GEMINI_PRO_MODEL=gemini-1.5-pro

# Vault paths
VAULT_ROOT=/path/to/cortex-prime/vault
SCRIPTS_ROOT=/path/to/cortex-prime/scripts
LOGS_ROOT=/path/to/cortex-prime/logs

# Thresholds
BURNOUT_DEEPWORK_THRESHOLD=0.4      # 40% deep work minimum
BURNOUT_CHECK_DAYS=3                # Số ngày liên tiếp để trigger alert
SYNERGY_SIMILARITY_THRESHOLD=0.75  # Ngưỡng similarity cho cross-vault links

# AnkiConnect
ANKI_CONNECT_URL=http://localhost:8765
ANKI_DEFAULT_DECK=CORTEX-PRIME
```

---

## 🗓️ Cron Jobs (Linux/Mac)

```bash
# Mở crontab
crontab -e

# Backup vault hàng ngày lúc 23:00
0 23 * * * cd ~/cortex-prime && python scripts/git_backup.py >> logs/git_backup.log 2>&1

# Burnout Radar mỗi Chủ nhật lúc 20:00
0 20 * * 0 cd ~/cortex-prime && python scripts/burnout_radar.py >> logs/burnout_radar.log 2>&1

# Anki sync mỗi ngày lúc 07:00
0 7 * * * cd ~/cortex-prime && python scripts/anki_sync.py >> logs/anki_sync.log 2>&1

# Synergy Spark mỗi Thứ Sáu lúc 18:00
0 18 * * 5 cd ~/cortex-prime && python scripts/synergy_spark.py >> logs/synergy_spark.log 2>&1
```

### Windows Task Scheduler (thay thế cron)
```powershell
# Tạo task chạy git_backup.py hàng ngày 23:00
schtasks /create /tn "CortexPrime_Backup" /tr "python C:\cortex-prime\scripts\git_backup.py" /sc daily /st 23:00
```

---

## 📐 Dataview Queries hữu ích

### Dashboard tổng hợp (vault/09-meta/dashboard.md)
```dataview
TABLE status, energy, vault, modified
FROM ""
WHERE type = "knowledge"
SORT modified DESC
LIMIT 10
```

### Burnout tracking (7 ngày qua)
```dataview
TABLE length(filter(rows, (r) => r.energy = "deep")) as "Deep", 
      length(filter(rows, (r) => r.energy = "shallow")) as "Shallow"
FROM ""
WHERE created >= date(today) - dur(7 days) AND type = "knowledge"
GROUP BY dateformat(created, "yyyy-MM-dd") as Day
SORT Day DESC
```

### Tất cả note cần review (status = reviewing)
```dataview
LIST
FROM ""
WHERE status = "reviewing"
SORT modified ASC
```

### Paper progress tracker
```dataview
TABLE status, modified, tags
FROM "08-far-res"
WHERE type = "paper"
SORT status ASC
```

---

*CORTEX-PRIME Folder Structure & Tech Stack — v1.0*
*Cập nhật: Tháng 5, 2026*
