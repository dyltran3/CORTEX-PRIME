# 🖥️ CORTEX-PRIME Desktop Application Installation & Packaging Guide

Chào mừng bạn đến với hướng dẫn triển khai và đóng gói **CORTEX-PRIME** thành ứng dụng Desktop độc lập (`.exe`) trên hệ điều hành Windows! 

Chúng tôi đã thiết lập thành công trình bao bọc gốc **Electron wrapper** và bộ đóng gói **electron-builder**. Điều này cho phép bạn chạy CORTEX-PRIME như một phần mềm máy tính thực thụ (có cửa sổ riêng, ẩn thanh menu mặc định để tăng tính thẩm mỹ lồng kính, hỗ trợ bo góc chuẩn Windows 11) và có thể tự động xuất ra file cài đặt `.exe` để tải về hoặc cài đặt trên bất kỳ máy tính nào.

---

## 🚀 1. Cách Khởi Chạy Ứng Dụng Desktop Ở Chế Độ Phát Triển (Dev Mode)

Nếu bạn muốn chạy thử nhanh giao diện Desktop trực tiếp từ mã nguồn:

1. **Mở Terminal 1** tại thư mục `ui/` và chạy máy chủ Vite:
   ```powershell
   cd c:\GitHub\CORTEX-PRIME\ui
   npm run dev
   ```
2. **Mở Terminal 2** tại thư mục `ui/` và kích hoạt cửa sổ Electron:
   ```powershell
   cd c:\GitHub\CORTEX-PRIME\ui
   npm run electron
   ```

*Cửa sổ CORTEX-PRIME Desktop sang trọng sẽ hiển thị ngay lập tức với công nghệ kết xuất Chromium cực kỳ mượt mà.*

---

## 📦 2. Cách Đóng Gói Thành Tệp Cài Đặt `.exe` (Tải Về Desktop)

Chúng tôi đã cấu hình sẵn bộ đóng gói tự động. Chỉ với một câu lệnh duy nhất, hệ thống sẽ biên dịch mã nguồn React và đóng gói thành tệp thực thi Windows:

1. Mở terminal tại thư mục `ui/` và chạy lệnh đóng gói:
   ```powershell
   cd c:\GitHub\CORTEX-PRIME\ui
   npm run electron-build
   ```
   *Hoặc lệnh tương đương:* `npm run electron:build`

2. **Kết quả đầu ra**:
   Sau khi hoàn tất (khoảng 30-45 giây), thư mục mới `ui/dist-electron/` sẽ được tạo ra chứa các tệp:
   *   **`CortexPrime Setup 1.0.0.exe`**: Tệp cài đặt Windows (NSIS Installer). Bấm đúp vào tệp này để cài đặt CORTEX-PRIME trực tiếp vào hệ thống máy tính của bạn như một phần mềm Windows chính thức (tự động tạo shortcut ngoài màn hình Desktop và trong Start Menu!).
   *   **`CortexPrime 1.0.0.exe` (trong thư mục portable/ nếu có)**: Phiên bản di động (Portable), chạy trực tiếp ngay không cần cài đặt.

---

## 🛠️ 3. Chi Tiết Các Cấu Hình Đã Thiết Lập

1.  **`ui/electron.cjs` (Main Process)**:
    *   Tự động khởi tạo cửa sổ Desktop với kích thước tối ưu `1366x768` (hỗ trợ responsive co giãn mượt mà xuống `1024x600`).
    *   Sử dụng `mainWindow.removeMenu()` để ẩn hoàn toàn thanh Menu bar (File, Edit, View, Help) mặc định cũ kỹ của Electron, giúp ứng dụng có giao diện tràn viền thời thượng.
    *   Thiết lập chế độ kết xuất an toàn (`sandbox: true`, `contextIsolation: true`).
2.  **`ui/preload.cjs` (Preload Script)**:
    *   Cầu nối an toàn giữa Chromium WebView và môi trường Node.js.
3.  **`ui/package.json` (Scripts & Build Metadata)**:
    *   Khai báo `"main": "electron.cjs"` định vị tệp khởi chạy.
    *   Cấu hình `"build"` chi tiết cho `electron-builder`:
        *   `appId`: `com.cortex.prime`
        *   `productName`: `CortexPrime`
        *   Định dạng đầu ra: Hỗ trợ cả trình cài đặt `nsis` và tệp chạy ngay `portable`.
        *   Icon đại diện: Tích hợp favicon chất lượng cao của Cortex làm logo ứng dụng.
4.  **`ui/.gitignore`**:
    *   Thêm `dist-electron` vào danh sách bỏ qua để tránh đẩy tệp `.exe` nặng lên GitHub.

---

## ✨ Trải Nghiệm Desktop Đẳng Cấp

*   **Không phụ thuộc vào trình duyệt**: Chạy độc lập trong tiến trình riêng, không bị ảnh hưởng bởi tab trình duyệt khác.
*   **Hiệu năng vượt trội**: Kết xuất đồ họa GPU Chromium trực tiếp cho các hiệu ứng glassmorphism mờ mượt mà nhất.
*   **Chuẩn ứng dụng chuyên nghiệp**: Biểu tượng icon góc dưới thanh Taskbar, có thể ghim (Pin to Taskbar) và khởi động trực tiếp từ màn hình nền!
