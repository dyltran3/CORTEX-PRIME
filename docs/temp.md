


CORTEX-PRIME
The Omni-Architect Personal OS

Synthesizing Knowledge, Architecting the Future




Tài liệu
Software Requirements Specification (SRS)
Phiên bản
v1.0 — Draft
Ngày tạo
Tháng 5, 2026
Tác giả
Cá nhân — Polymath Project
Chi phí mục tiêu
0 VND / tháng

Mục lục
1.  Tổng quan dự án...................................... 3
2.  Kiến trúc hệ thống................................... 4
3.  Yêu cầu chức năng chi tiết........................... 5
4.  Yêu cầu phi chức năng................................ 8
5.  Tech Stack & Tool Matrix............................. 9
6.  Lộ trình triển khai 6 tháng.......................... 10
7.  Rủi ro và giải pháp.................................. 11
8.  Phụ lục — API & Data Schema.......................... 12

1. Tổng quan dự án
1.1 Mục tiêu
CORTEX-PRIME là một hệ điều hành cá nhân (Personal OS) được thiết kế cho người học đa ngành (Polymath), tích hợp AI để tự động hoá việc thu thập, phân loại, và kết nối tri thức trên 8 lĩnh vực chuyên môn song song. Toàn bộ hệ thống vận hành với chi phí bằng 0 bằng cách ưu tiên công cụ mã nguồn mở và API tier miễn phí.
1.2 Phạm vi
Loại
Tính năng
Ghi chú
IN SCOPE
Ghi chú tri thức tự động
Hệ thống nhận text/voice thô → AI bóc tách → Markdown
IN SCOPE
Đồ thị tri thức
Canvas Obsidian + plugin Smart Connections
IN SCOPE
Lịch trình nhận thức
Phân biệt Deep Work / Shallow Work, bảo vệ time block
IN SCOPE
Phân tích tài liệu khoa học
Upload PDF → trích xuất ý chính + công thức LaTeX
IN SCOPE
Burnout Radar
Script đo Deep Work rate 7 ngày, cảnh báo tự động
IN SCOPE
Spaced Repetition
Tích hợp Anki qua AnkiConnect API
OUT SCOPE
Mobile native app
Giai đoạn 1-2 chỉ dùng desktop + Obsidian mobile
OUT SCOPE
Cộng tác nhóm
Hệ thống thiết kế cho single-user
OUT SCOPE
Real-time sync cloud
Ưu tiên local-first, sync qua Git thủ công

1.3 Đối tượng người dùng
Hệ thống phục vụ duy nhất một người dùng với các đặc điểm:
Nghiên cứu đồng thời trên 8 mảng: Vật lý, Toán, Bảo mật, AI, Ngôn ngữ, Kinh tế, Luật, Nghiên cứu
Cần viết 4 paper khoa học trong vòng 3 năm
Có kiến thức lập trình Python cơ bản, đủ để chạy script
Máy tính: tối thiểu 8GB RAM (16GB đề xuất cho Local LLM)
Kết nối internet để gọi Gemini API (có thể làm việc offline với phần lớn tính năng)

2. Kiến trúc hệ thống
2.1 Triết lý thiết kế
Nguyên tắc
Diễn giải
Local-First
Toàn bộ dữ liệu lưu local. Cloud chỉ dùng cho AI inference chung. Far-Sec vault không bao giờ chạm cloud.
Zero-Cost Stack
Mọi công cụ phải có tier miễn phí bền vững, không phụ thuộc vào free trial có thời hạn.
Friction Minimum
Từ ý tưởng đến note được lưu < 30 giây. Từ PDF đến knowledge note < 2 phút.
Feedback Loop
Mọi kiến thức phải có trạng thái (acquired/reviewing/mastered) và vòng lặp ôn tập.
Progressive Build
Bắt đầu bằng Obsidian + script Python đơn giản. Mở rộng dần theo nhu cầu thực tế.

2.2 Ba tầng kiến trúc
Tầng 1 — Foundation Layer
Nền tảng lưu trữ và quản lý phiên bản. Không phụ thuộc AI, hoạt động 100% offline.
Công cụ
Chức năng
Chi phí
Obsidian
Vault local, plugin ecosystem, Markdown native
Miễn phí cá nhân
Git + GitHub
Version control cho toàn bộ vault, backup tự động
Miễn phí public/private
Zotero
Quản lý tài liệu PDF, citation, BibTeX export
Miễn phí 300MB
Anki
Spaced repetition flashcard, AnkiConnect REST API
Miễn phí hoàn toàn
Veracrypt
Mã hoá vault Far-Sec (AES-256), air-gapped
Miễn phí mã nguồn mở

Tầng 2 — Intelligence Layer
Xử lý AI và tự động hoá. Ưu tiên Gemini API (1M token/ngày miễn phí).
Công cụ
Chức năng
Chi phí
Gemini 1.5 Flash
Brain Dump → Task/Knowledge tagging, nhanh, rẻ
Free tier: 1M tok/ngày
Gemini 1.5 Pro
PDF Paper Deconstructor (cần context dài),                  Eureka Log
Free tier: 1.5M tok/ngày
Ollama + Mistral
Local LLM cho Far-Sec vault (không cloud)
0 VND, cần ≥16GB RAM
Python Scripts
Automation: Burnout Radar, Anki sync, Git hooks
Miễn phí
Dataview Plugin
Query Markdown như database, dashboard trong Obsidian
Miễn phí

Tầng 3 — Vault Layer (Far-Nodes)
8 vault chuyên biệt, mỗi vault có giao thức bảo mật và tích hợp riêng.
Vault
Nội dung
Stack tích hợp
Bảo mật
⚛ Far-Phy
Vật lý QM, QFT, Cổ điển
Jupyter + SymPy + FEniCS
Standard
📐 Far-Math
PDE, Tensor, Xác suất
Manim + SymPy + Wolfram Alpha free
Standard
🥷 Far-Sec
Web, Firmware, RF, AI Sec
Air-gapped, Veracrypt, offline only
Cao — không cloud
🤖 Far-AI
OpenCL, Fine-tuning, LLM
GitHub + HuggingFace free
Standard
🗣 Far-Lang
HSK 4-6, Academic Writing
Anki + Language Reactor
Standard
📈 Far-Econ
Tài chính, Marketing, Growth
Yahoo Finance API (free)
Standard
⚖ Far-Law
CISG, IP Law, Corporate Law
Zotero + PDFgear
Standard
🔬 Far-Res
4 Paper + Portfolio
Git + Overleaf free + Zotero
Standard


3. Yêu cầu chức năng chi tiết
3.1 Module Semantic Workstream Engine
Đây là điểm tiếp nhận chính của hệ thống. Người dùng nhập thông tin thô (text, voice-to-text, paste từ trình duyệt) và AI tự động xử lý, phân loại.

Yêu cầu chức năng:
ID
Ưu tiên
Mô tả yêu cầu
SWE-01
Must
Nhận đầu vào text tối đa 5000 ký tự, không giới hạn ngôn ngữ (Việt/Anh/Trung)
SWE-02
Must
Bóc tách tự động thành: Task (verb + object), Knowledge (định nghĩa/khái niệm), Reference (URL/citation)
SWE-03
Must
Gán nhãn năng lượng: Deep Work (>70% tập trung) hoặc Shallow Work (<40% tập trung)
SWE-04
Must
Gán vault đích tự động dựa trên keyword (VD: "quantum" → Far-Phy, "CISG" → Far-Law)
SWE-05
Should
Tạo file Markdown theo template chuẩn, tự thêm frontmatter YAML (date, tags, status, energy)
SWE-06
Should
Đề xuất liên kết tới các note hiện có (dùng Smart Connections similarity)
SWE-07
Could
Nhận đầu vào voice (dùng Whisper offline hoặc web speech API)

Luồng xử lý (Happy Path):
Người dùng mở Quick Capture (hotkey Ctrl+Shift+C trong Obsidian)
Paste/gõ text thô vào modal → nhấn Enter
Script Python gọi Gemini Flash API với prompt bóc tách
API trả về JSON: {tasks[], knowledge[], references[], vault, energy_level}
Script tạo file .md trong vault đích với template đúng
Obsidian tự reload, note xuất hiện trong graph ngay lập tức

3.2 Module Burnout Radar
Script Python chạy hàng tuần (cron job), phân tích dữ liệu activity của Obsidian để phát hiện dấu hiệu quá tải nhận thức.

ID
Ưu tiên
Mô tả yêu cầu
BR-01
Must
Đọc file activity log của Obsidian (vault/.obsidian/workspace.json)
BR-02
Must
Đếm số note Deep Work được tạo mỗi ngày trong 7 ngày qua
BR-03
Must
Nếu Deep Work rate < 40% trong 3 ngày liên tiếp → tạo cảnh báo
BR-04
Must
Cảnh báo dạng: tạo note "⚠️ BURNOUT ALERT" trong Obsidian inbox
BR-05
Should
Đề xuất tự động giảm 30% task Deep Work trong template tuần sau
BR-06
Should
Xuất báo cáo tuần: biểu đồ text-based trong Obsidian (Dataview)
BR-07
Could
Tích hợp Git commit frequency như tín hiệu bổ sung


3.3 Module Paper Deconstructor
Người dùng upload PDF → hệ thống trả về note cấu trúc đầy đủ trong Far-Res, bao gồm phân tích và toàn bộ công thức LaTeX.
ID
Ưu tiên
Mô tả yêu cầu
PD-01
Must
Nhận PDF đầu vào tối đa 50 trang, gọi Gemini 1.5 Pro với file upload API
PD-02
Must
Trích xuất: (1) Ý tưởng chính, (2) Phương pháp, (3) Kết quả, (4) Hạn chế của paper
PD-03
Must
Liệt kê tất cả công thức toán học dưới dạng LaTeX code block
PD-04
Must
Tạo BibTeX entry tự động từ metadata PDF (dùng Zotero connector)
PD-05
Should
Gán nhãn từng công thức vào vault phù hợp (VD: PDE → Far-Math)
PD-06
Should
Tạo danh sách câu hỏi nghiên cứu mở từ nội dung paper
PD-07
Could
So sánh với các paper đã có trong vault, chỉ ra điểm tương đồng/khác biệt


3.4 Module Spaced Repetition Sync (Anki Bridge)
ID
Ưu tiên
Mô tả yêu cầu
AR-01
Must
Script scan Obsidian vault tìm note có tag #flashcard
AR-02
Must
Tạo Anki card qua AnkiConnect REST API (localhost:8765)
AR-03
Must
Cập nhật trạng thái note: acquired → reviewing sau khi card được tạo
AR-04
Should
Khi Anki báo card đã "mastered" (interval >21 ngày) → cập nhật note thành mastered
AR-05
Could
Tự động tạo flashcard từ định nghĩa trong note (không cần tag thủ công)


3.5 Module Synergy Sparks (Cross-Vault Links)
Tự động phát hiện điểm giao thoa giữa các vault khác nhau — đây là tính năng đặc trưng của tư duy Polymath.
ID
Ưu tiên
Mô tả yêu cầu
SS-01
Must
Dùng Smart Connections plugin để tính cosine similarity giữa các note
SS-02
Must
Nếu similarity > 0.75 giữa note thuộc 2 vault khác nhau → tạo link #synergy
SS-03
Should
Hàng tuần tạo note "Synergy Report" liệt kê các cặp note có tiềm năng kết nối
SS-04
Could
Gợi ý tiêu đề paper kết hợp từ 2 lĩnh vực (VD: "Bayesian methods in RF signal classification")


4. Yêu cầu phi chức năng
Nhóm
Yêu cầu
Hiệu năng
Brain Dump → note được lưu trong < 30 giây (bao gồm API call)
Hiệu năng
Paper Deconstructor xử lý PDF 30 trang trong < 3 phút
Bảo mật
Far-Sec vault phải air-gapped: không có API call nào được gửi ra ngoài khi đang xử lý nội dung vault này
Bảo mật
API key lưu trong biến môi trường (.env), không bao giờ hardcode trong script
Bảo mật
Vault Veracrypt tự lock sau 10 phút không hoạt động
Độ tin cậy
Script Python phải có error handling rõ ràng, log lỗi vào file ~/cortex/logs/
Khả năng mở rộng
Kiến trúc module: mỗi script độc lập, có thể thêm/bỏ mà không ảnh hưởng hệ thống
Khả năng mở rộng
Định dạng Markdown chuẩn đảm bảo có thể migrate sang công cụ khác trong tương lai
Khả năng dùng
Hotkey cho tất cả tác vụ phổ biến (Quick Capture, Open Today Note, Synergy Report)
Chi phí
Tổng chi phí API và tool không vượt quá 0 VND/tháng trong điều kiện sử dụng thông thường


5. Tech Stack & Tool Matrix
5.1 Quyết định kiến trúc quan trọng
Tại sao Obsidian, không Notion?
Notion lưu dữ liệu trên cloud (vi phạm local-first). Obsidian lưu file .md trên máy, hoạt động offline hoàn toàn, và có thể tích hợp Git.
Tại sao Gemini, không GPT-4?
Gemini 1.5 Flash có free tier 1 triệu token/ngày. GPT-4o mini tính phí từ token đầu tiên. Gemini 1.5 Pro hỗ trợ 1M context — đủ để phân tích toàn bộ PhD thesis trong một lần gọi.
Tại sao Python script, không n8n/Zapier?
n8n cần server riêng hoặc phí cloud. Zapier tính phí theo zap. Python script chạy local hoàn toàn miễn phí, dễ debug, dễ tuỳ chỉnh.
Tại sao Git, không Obsidian Sync?
Obsidian Sync tốn $8/tháng. Git + GitHub hoàn toàn miễn phí, có history đầy đủ, và đồng thời là backup tự động.
Khi nào dùng Ollama local?
Chỉ khi xử lý nội dung Far-Sec vault. Với các vault khác, Gemini API nhanh hơn và không tốn tài nguyên máy. Yêu cầu: RAM ≥ 16GB để chạy Mistral 7B.
5.2 Dependency Matrix
Package / Tool
Loại
Dùng cho
Chi phí/tháng
Python 3.11+
Runtime
Tất cả script
0
google-generativeai
pip package
Gemini API client
0
python-dotenv
pip package
Quản lý API key
0
obsidian-smart-con.
Obsidian plugin
Vector similarity search
0
Dataview
Obsidian plugin
Query vault như database
0
Templater
Obsidian plugin
Template động cho note
0
Calendar
Obsidian plugin
Daily/weekly note navigation
0
AnkiConnect
Anki addon
REST API cho Anki
0
Zotero + Connector
Desktop app
Quản lý tài liệu PDF
0
Git
System
Version control vault
0
Ollama + Mistral 7B
Optional
Local LLM cho Far-Sec
0 (cần GPU/RAM)


6. Lộ trình triển khai 6 tháng
Tháng 1: Foundation Setup
Cài Obsidian, tạo cấu trúc 8 vault theo spec
Cài 5 plugin: Dataview, Templater, Calendar, Canvas, Smart Connections
Tạo template Markdown cho 4 loại note: Task, Knowledge, Paper, Daily
Thiết lập Git repo, cấu hình .gitignore cho Far-Sec vault
Tạo tài khoản Google AI Studio, lấy Gemini API key miễn phí

Tháng 2: Brain Dump Engine
Viết script brain_dump.py: nhận text → gọi Gemini Flash → tạo Markdown
Thiết lập prompt engineering cho bóc tách Task/Knowledge/Reference
Cấu hình hotkey Obsidian gọi script qua terminal (Templater + shell)
Test và tinh chỉnh với 100 note đầu tiên thực tế

Tháng 3: Burnout Radar + Anki Bridge
Viết script burnout_radar.py: đọc vault activity, tính Deep Work rate
Thiết lập cron job chạy hàng tuần (Task Scheduler Windows / crontab Linux)
Cài AnkiConnect, viết script anki_sync.py tạo flashcard từ note #flashcard
Thiết lập vòng lặp: acquired → reviewing → mastered

Tháng 4: Paper Deconstructor
Viết script paper_deconstructor.py: upload PDF → Gemini 1.5 Pro → note
Thiết kế prompt trả về JSON chuẩn với sections: summary, methods, formulas, gaps
Script tự tạo BibTeX entry và thêm vào Zotero library
Test với 5 paper thực tế trong các lĩnh vực nghiên cứu

Tháng 5: Simulation Hub
Thiết lập Jupyter environment với SymPy, NumPy, Matplotlib, FEniCS
Viết template notebook cho mô phỏng FEM nhiệt và chất lưu
Script latex_to_python.py: chuyển công thức LaTeX từ Paper Deconstructor → hàm Python
Tạo "Eureka Log" template: snapshot thông số + kết quả → note Far-Res

Tháng 6: Synergy Sparks + Polish
Cấu hình Smart Connections ngưỡng similarity 0.75 cho cross-vault linking
Viết script synergy_report.py: weekly report về các cặp note tiềm năng
Tạo dashboard Dataview tổng hợp: tasks, knowledge count, burnout status, paper progress
Kiểm tra toàn hệ thống, viết SOP (Standard Operating Procedure) cho từng workflow


7. Rủi ro và giải pháp
ID
Mức độ
Rủi ro
Xác suất
Giải pháp
R-01
Cao
Gemini API thay đổi free tier
Cao
Thiết kế abstraction layer, dễ swap sang OpenRouter (nhiều model free), Groq (Llama 3 free), hoặc Ollama local
R-02
Cao
Máy không đủ RAM cho Ollama
Trung bình
Far-Sec vault: xử lý thủ công hoặc dùng máy tính riêng air-gapped. Không gửi cloud trong mọi trường hợp
R-03
Trung bình
Obsidian thay đổi cấu trúc plugin
Thấp
Core note format là plain Markdown — migrate sang Logseq hoặc Foam trong < 1 giờ nếu cần
R-04
Trung bình
Git vault quá lớn (PDF, Jupyter outputs)
Trung bình
Dùng .gitignore cho binary files. Lưu PDF trong Zotero (sync riêng). Dùng Git LFS nếu cần
R-05
Thấp
Burnout thực sự xảy ra khi build hệ thống này
Cao
Nguyên tắc: luôn bắt đầu với phiên bản đơn giản nhất. Tháng 1 chỉ cần vault + template — đừng code gì cả


8. Phụ lục — API & Data Schema
8.1 Frontmatter YAML chuẩn cho mọi note
---id: PHY-2026-001title: "Tên note"created: 2026-05-15modified: 2026-05-15vault: far-phytype: knowledge          # knowledge | task | paper | daily | synergystatus: acquired         # acquired | reviewing | masteredenergy: deep             # deep | shallowtags: [quantum, entanglement, spin]source: ""               # URL hoặc citation key Zoteroanki_id: null            # Điền sau khi Anki card được tạosynergy_links: []        # List note ID từ vault khácpaper_ref: null          # Citation key nếu từ paper---
8.2 Prompt chuẩn cho Brain Dump (Gemini Flash)
SYSTEM:Bạn là một hệ thống phân loại tri thức cho một Polymath đang nghiên cứu 8 lĩnh vực.Vault mapping: {phy: vật lý/quantum, math: toán/PDE/tensor, sec: bảo mật/hacking,ai: machine learning/GPU, lang: ngôn ngữ/HSK, econ: kinh tế/tài chính, law: luật/CISG, res: paper/nghiên cứu}USER:Phân tích đoạn text sau và trả về JSON:{  "tasks": [{"action": "...", "vault": "...", "energy": "deep|shallow", "deadline": null}],  "knowledge": [{"concept": "...", "definition": "...", "vault": "...", "tags": []}],  "references": [{"title": "...", "url": "...", "vault": "..."}],  "primary_vault": "...",  "energy_level": "deep|shallow",  "summary": "1 câu tóm tắt"}TEXT INPUT:{user_text}
8.3 Acceptance Criteria tổng thể
Hệ thống vận hành 30 ngày liên tiếp không tốn chi phí nào
Brain Dump: 10 test cases đa dạng đều tạo note đúng vault và đúng energy level
Burnout Radar: chạy đúng giờ mỗi tuần và cảnh báo khi điều kiện được kích hoạt
Paper Deconstructor: phân tích được PDF 20+ trang trong < 3 phút
Anki Bridge: card được tạo tự động và trạng thái note được cập nhật đúng
Far-Sec vault: không có traffic mạng nào khi đang xử lý nội dung vault này
Toàn bộ note lưu dưới dạng Markdown thuần, có thể mở bằng bất kỳ text editor nào



— Hết tài liệu — CORTEX-PRIME SRS v1.0 —