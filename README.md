# CORTEX-PRIME 🧠⚡

**CORTEX-PRIME** là một hệ điều hành cá nhân (**Personal OS**) cục bộ, mã nguồn mở, được tối ưu hóa cho **Polymath** quản lý tri thức, lịch trình học tập và nghiên cứu chuyên sâu chéo 8 lĩnh vực chuyên biệt. 

Hệ thống hoạt động theo triết lý **Local-First (Ưu tiên cục bộ)** và **Zero-Cost (Chi phí 0đ)**, kết hợp sức mạnh ghi chép liên kết của **Obsidian**, các kịch bản tự động hóa bằng **Python standalone**, và khả năng phân tích ngôn ngữ hàng đầu của **Google Gemini API** (sử dụng gói Free Tier 1M+ tokens/ngày).

---

## 🌟 Tính Năng Cốt Lõi

1. **Quick Capture & Brain Dump**: Tự động phân loại ghi chép hỗn hợp từ dòng suy nghĩ thô thành ghi chú tri thức sâu sắc hoặc tác vụ hành động tương ứng trong từng vault chuyên biệt.
2. **Semantic Knowledge Linker (Synergy Spark)**: Khám phá liên kết ẩn giữa các lĩnh vực nghiên cứu khác nhau sử dụng **Gemini Text Embeddings (`gemini-embedding-001`)** với thuật toán Cosine Similarity và cơ chế **caching thông minh** tránh lãng phí API.
3. **Burnout Radar**: Theo dõi và giám sát mức độ nỗ lực học tập sâu (deep work) liên tục, cảnh báo kiệt sức nếu tỷ lệ làm việc sâu suy giảm quá ngưỡng an toàn.
4. **Local Anki Sync**: Quét các thẻ ghi nhớ (`#flashcard`) được tạo trực tiếp trong Obsidian ghi chú, đồng bộ tự động lên Anki thông qua AnkiConnect.
5. **Paper Deconstructor**: Phân tích, tóm tắt cấu trúc và bóc tách các bài báo khoa học chất lượng cao từ Zotero thành các ghi chú chuyên sâu gọn gàng.
6. **Auto Git Backup**: Tự động hóa quá trình đồng bộ và sao lưu lịch sử ghi chép lên GitHub riêng tư định kỳ, bảo vệ an toàn tuyệt đối các tệp mật (`03-far-sec` luôn được bỏ qua qua `.gitignore`).

---

## 📁 Bản Đồ Thư Mục Cấu Trúc (Vault Map)

Cấu trúc thư mục được thiết kế chặt chẽ theo dạng chuyên gia hóa, cô lập các lớp dữ liệu bảo mật và tối ưu hóa cho khả năng duyệt ghi chú nhanh:

```text
CORTEX-PRIME/
├── .env                       # File cấu hình biến môi trường cục bộ
├── README.md                  # Hướng dẫn vận hành chi tiết (tài liệu này)
├── requirements.txt           # Danh sách các thư viện Python phụ thuộc
├── logs/                      # Chứa toàn bộ file log của hệ thống
│   ├── git_backup.log
│   └── embeddings_cache.json  # Bộ đệm lưu trữ vector nhúng của ghi chú
├── scripts/                   # Thư mục chứa kịch bản Python tự động hóa
│   ├── utils/
│   │   ├── gemini_client.py   # Wrapper điều phối Gemini API (Retry + Structured JSON)
│   │   ├── obsidian_writer.py # Hỗ trợ đọc/ghi Markdown kèm YAML frontmatter
│   │   └── vault_scanner.py   # Quét và truy xuất siêu dữ liệu từ ghi chú
│   ├── setup.py               # Script khởi tạo toàn bộ cấu trúc thư mục ban đầu
│   ├── brain_dump.py          # Quick capture phân tích nội dung hỗn hợp
│   ├── burnout_radar.py       # Theo dõi và giám sát sức bền tinh thần
│   ├── synergy_spark.py       # Khám phá liên kết tri thức ngữ nghĩa chéo vault
│   ├── anki_sync.py           # Tự động đồng bộ flashcard sang Anki
│   ├── paper_deconstructor.py # Bóc tách cấu trúc tài liệu PDF/Zotero
│   ├── latex_to_python.py     # Chuyển đổi công thức toán học LaTeX sang Python
│   └── git_backup.py          # Tự động sao lưu mã nguồn và vault lên GitHub
├── vault/                     # Không gian lưu trữ Obsidian chính
│   ├── 00-inbox/              # Nơi tiếp nhận thông tin thô, ghi chú hằng ngày
│   ├── 01-far-phy/            # [Vật lý Chuyên sâu] Quantum, QFT, Classical
│   ├── 02-far-math/           # [Toán học Nâng cao] Calculus, Tensor, Algebra
│   ├── 03-far-sec/            # [An Ninh Mạng] Hacking, AI Security (Local ONLY)
│   ├── 04-far-ai/             # [Trí Tuệ Nhân Tạo] GPU, Architectures, Fine-tuning
│   ├── 05-far-lang/           # [Ngôn Ngữ] HSK4-6 Chinese, Academic English
│   ├── 06-far-econ/           # [Kinh Tế Học] Growth Models, Finance, Marketing
│   ├── 07-far-law/            # [Pháp Luật] IP Law, Trade, Corporate Law
│   ├── 08-far-res/            # [Nghiên Cứu] Tài liệu khoa học, Thư mục bài báo
│   └── 09-meta/               # Siêu dữ liệu hệ thống (Weekly Reviews, Templates, Reports)
└── zotero-exports/            # Nơi lưu trữ tài liệu thô được xuất từ Zotero
```

---

## 🛠 Hướng Dẫn Cài Đặt & Cấu Hình

### 1. Yêu cầu hệ thống
* Hệ điều hành: Windows 10/11 hoặc Linux/macOS.
* Phiên bản Python: **Python 3.11** trở lên.
* Công cụ ghi chép: **Obsidian** (khuyến nghị).

### 2. Cài đặt các thư viện Python
Mở terminal/PowerShell tại thư mục gốc của dự án và chạy:
```powershell
pip install -r requirements.txt
```

### 3. Cấu hình tệp môi trường `.env`
Sao chép hoặc chỉnh sửa file `.env` tại thư mục gốc và cung cấp các khóa cần thiết:
```ini
# Lấy API Key miễn phí tại https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

GEMINI_FLASH_MODEL=gemini-2.5-flash
GEMINI_PRO_MODEL=gemini-2.5-pro

# Ngưỡng an toàn burnout (Tỷ lệ deep work tối thiểu trên tổng khối lượng việc)
BURNOUT_DEEPWORK_THRESHOLD=0.4
BURNOUT_CHECK_DAYS=3

# Ngưỡng tương đồng phát hiện liên kết tri thức (Cosine Similarity)
SYNERGY_SIMILARITY_THRESHOLD=0.75

# AnkiConnect URL mặc định
ANKI_CONNECT_URL=http://localhost:8765
ANKI_DEFAULT_DECK=CORTEX-PRIME
```

### 4. Khởi chạy thiết lập ban đầu (Setup)
Chạy lệnh sau để tự động tạo cấu trúc các vault con, meta templates, và kiểm tra kết nối API:
```powershell
$env:PYTHONIOENCODING="utf-8"; python scripts/setup.py
```

### 5. Khởi chạy & Đóng gói ứng dụng Desktop (Electron App)
Chúng tôi đã tích hợp sẵn bộ bao bọc **Electron** và trình đóng gói **electron-builder** cho phép bạn khởi chạy hoặc đóng gói CORTEX-PRIME thành phần mềm Windows (.exe) cài đặt trực tiếp trên desktop:

* **Chạy thử chế độ phát triển (Dev Mode)**:
  Mở terminal tại thư mục `ui/` và chạy:
  ```powershell
  npm run dev
  # Trong một cửa sổ terminal khác tại thư mục ui/:
  npm run electron
  ```
* **Đóng gói thành tệp cài đặt (.exe) tải về Desktop**:
  Mở terminal tại thư mục `ui/` và chạy:
  ```powershell
  npm run electron:build
  ```
  Sau khi hoàn tất, tệp cài đặt chính thức `CortexPrime Setup 1.0.0.exe` và bản chạy ngay portable sẽ được tạo ra tại thư mục `ui/dist-electron/` để bạn cài đặt/tải về desktop!
* Xem hướng dẫn chi tiết tại: [DESKTOP_INSTALLATION.md](file:///c:/GitHub/CORTEX-PRIME/docs/DESKTOP_INSTALLATION.md).

---


## 🚀 Hướng Dẫn Vận Hành Các Module

### 🧠 1. Brain Dump (Quick Capture)
Phân tích một đoạn văn bản thô (ghi chú nhanh, ý tưởng chợt lóe lên) thông qua trí tuệ nhân tạo để bóc tách thành các ghi chú Kiến thức (`type: knowledge`) hoặc Nhiệm vụ (`type: task`) chuyên biệt.

* **Cách chạy**:
  ```powershell
  python scripts/brain_dump.py "Học khái niệm Quantum Superposition trong vật lý lượng tử, đây là hiện tượng hạt tồn tại ở nhiều trạng thái đồng thời trước khi đo. Cần làm bài tập tính toán xác suất biên độ trước ngày mai."
  ```
* **Kết quả**:
  - Tạo ghi chú nhiệm vụ `TASK-YYYY-xxxx.md` trong `vault/01-far-phy` với `energy: deep` và deadline cụ thể.
  - Tạo ghi chú kiến thức `PHY-YYYY-xxxx_Quantum_Superposition.md` chứa định nghĩa và flashcard tự động tạo.

---

### 🧠 2. Synergy Spark (Semantic Knowledge Linker)
Quét toàn bộ ghi chú thuộc loại kiến thức (`type: knowledge`) chéo giữa 8 vault chuyên sâu, tính toán sự tương đồng ngữ nghĩa bằng mô hình nhúng **Gemini Embeddings** để phát hiện các mối liên kết ngầm phi hiển nhiên.

* **Cách chạy**:
  ```powershell
  $env:PYTHONIOENCODING="utf-8"; python scripts/synergy_spark.py
  ```
* **Tính năng tối ưu**:
  - Sử dụng cơ chế lưu trữ đệm trong `logs/embeddings_cache.json` dựa trên `modified_time`. Vector nhúng của ghi chú cũ không bị tính toán lại, giảm 99% số cuộc gọi API.
  - Tự động fallback sang tính toán độ trùng lặp nhãn (Jaccard Tag Similarity) nếu không có internet hoặc thiếu API key.
  - Tạo báo cáo liên kết tuyệt đẹp tại `vault/09-meta/synergy-reports/Synergy_Report_YYYY-MM-DD.md`.

---

### 🧠 3. Burnout Radar
Đọc toàn bộ ghi chú được tạo trong khoảng `BURNOUT_CHECK_DAYS` gần đây, đánh giá tỷ lệ các phiên làm việc sâu (`energy: deep`) so với các phiên làm việc nông (`energy: shallow`). Tránh cạn kiệt năng lượng tinh thần.

* **Cách chạy**:
  ```powershell
  python scripts/burnout_radar.py
  ```
* **Kết quả**: Nếu tỷ lệ làm việc sâu liên tục vượt quá ngưỡng an toàn mà không có các hoạt động phục hồi hoặc tỷ lệ công việc sâu sụt giảm đột ngột báo hiệu sự chán nản, hệ thống sẽ tạo cảnh báo sức khỏe tinh thần tại `vault/00-inbox/BURNOUT-ALERT-YYYY-MM-DD.md`.

---

### 🧠 4. Anki Sync
Quét các ghi chú mới trong vault để tìm ký hiệu flashcard học tập nhanh:
```markdown
> #flashcard
> **Q:** Câu hỏi cần ghi nhớ?
> **A:** Câu trả lời tương ứng.
```
Tự động đồng bộ các câu hỏi này sang phần mềm Anki Desktop để thực hiện ôn tập ngắt quãng (Spaced Repetition).

* **Cách chạy**: (Đảm bảo ứng dụng Anki đang chạy và cài đặt add-on AnkiConnect)
  ```powershell
  python scripts/anki_sync.py
  ```

---

### 🧠 5. Paper Deconstructor
Hỗ trợ giải cấu trúc bài báo khoa học. Chuyển đổi siêu dữ liệu từ Zotero thô hoặc nội dung PDF nghiên cứu thành cấu trúc tóm tắt Markdown chuẩn mực của hệ thống.

* **Cách chạy**:
  ```powershell
  python scripts/paper_deconstructor.py path/to/scientific_paper.pdf
  ```

---

### 🧠 6. Git Auto-Backup
Tự động quét toàn bộ các thay đổi mới nhất trong không gian lưu trữ cá nhân, tạo commit an toàn và đẩy lên kho lưu trữ GitHub cá nhân.

* **Cách chạy**:
  ```powershell
  python scripts/git_backup.py
  ```
* **Bảo mật tuyệt đối**: Ghi chú nhạy cảm thuộc thư mục `vault/03-far-sec/` được đưa vào `.gitignore` cục bộ, đảm bảo **không bao giờ** bị đẩy lên đám mây.

---

## 🕒 Hướng Dẫn Cấu Hình Tự Động Hóa Định Kỳ trên Windows

Để CORTEX-PRIME hoạt động như một hệ điều hành thực thụ, hãy thiết lập để các script tự động chạy ngầm trong Windows Task Scheduler:

### Tự động sao lưu định kỳ (Git Backup) vào 23:00 hàng ngày:
1. Nhấn `Windows + R`, gõ `taskschd.msc` và nhấn Enter để mở **Task Scheduler**.
2. Tại cột bên phải, chọn **Create Basic Task...**
3. Điền tên tác vụ: `CORTEX-PRIME-AutoBackup`.
4. Trigger: Chọn **Daily**, thiết lập thời gian bắt đầu vào lúc **23:00**.
5. Action: Chọn **Start a program**.
6. Điền các tham số:
   * **Program/script**: `python`
   * **Add arguments**: `scripts/git_backup.py`
   * **Start in (optional)**: Điền đường dẫn tuyệt đối đến thư mục chứa dự án (ví dụ `C:\GitHub\CORTEX-PRIME`).
7. Nhấn **Finish**.

### Tự động quét liên kết tri thức (Synergy Spark) vào 08:00 hàng sáng:
Thực hiện tương tự như trên với các cấu hình:
* Tên tác vụ: `CORTEX-PRIME-SynergySpark`
* Trigger: **Daily** lúc **08:00**
* Program/script: `python`
* Add arguments: `scripts/synergy_spark.py`
* Start in: `C:\GitHub\CORTEX-PRIME`

---

## 🔌 Tối Ưu Hóa Trải Nghiệm Trên Obsidian

Khuyên dùng kết hợp các plugin cộng đồng sau để có trải nghiệm Personal OS trọn vẹn nhất:

1. **Templater**: Tự động chèn siêu dữ liệu frontmatter động khi tạo ghi chú mới. Các mẫu ghi chú chuẩn hóa được đặt tại `vault/09-meta/templates/`.
2. **Dataview**: Tạo bảng điều khiển (Dashboard) động tổng hợp các tác vụ cần làm hoặc hiển thị các ghi chú có độ tương đồng cao.
3. **Smart Connections**: Tích hợp hiển thị các ghi chú liên quan trực tiếp ở thanh sidebar bên phải.
4. **Anki Integration / Flashcards**: Hỗ trợ xem trực quan và ôn tập trực tiếp các câu hỏi dạng thẻ ghi nhớ trong Obsidian.

### Phím tắt khuyên dùng trong Obsidian (Hotkeys):
* `Ctrl + N`: Tạo ghi chú nhanh trong Inbox.
* `Alt + S`: Mở bảng điều khiển tìm kiếm chéo vault.
* `Ctrl + Shift + A`: Kích hoạt đồng bộ hóa flashcard thủ công sang Anki.