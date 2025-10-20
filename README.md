# 草莓病蟲害辨識系統 - 前端介面 (Vue.js)

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-%E2%9A%A1%EF%B8%8F-blue?logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple?logo=bootstrap)](https://getbootstrap.com/)
[![Axios](https://img.shields.io/badge/Axios-Networking-lightgrey?logo=axios)](https://axios-http.com/)

這是草莓病蟲害辨識系統的前端使用者介面，使用 Vue.js 3 和 Vite 建構。它與後端的 Django RESTful API 互動，提供圖片上傳、結果展示、歷史紀錄查詢等功能。

**後端專案連結:**
* [StrawberryDetect_Web (Django Backend)](https://github.com/Nick921003/StrawberryDetect_Web.git)

---

## ✨ 主要功能

* **圖片上傳:**
    * 支援點擊選擇或拖曳上傳單張或多張圖片 (JPG, PNG)。
    * 上傳進度狀態顯示。
    * 成功上傳後自動切換至結果視圖。
* **辨識結果展示:**
    * 使用卡片 (`ResultCard`) 清晰展示原始圖片與標註後圖片。
    * 顯示辨識出的物件類別、信心度（帶顏色徽章）。
    * 顯示綜合嚴重程度評分與文字描述。
    * 提供「繼續上傳」按鈕返回上傳介面。
* **歷史紀錄:**
    * 區分「手動上傳」與「批次任務」歷史紀錄。
    * 列表展示歷史紀錄摘要（ID, 時間, 狀態/嚴重程度）。
    * **支援分頁**瀏覽所有歷史紀錄。
    * 點擊列表項可查看單筆或批次的完整詳情。
* **詳細視圖:**
    * 單筆紀錄詳情頁：重用 `ResultCard` 顯示完整資訊。
    * 批次任務詳情頁：顯示批次摘要，並列表展示該批次包含的所有紀錄 (`ResultCard`)。
* **S3 批次觸發:**
    * 提供表單介面，可手動輸入 S3 儲存桶和資料夾路徑，觸發後端批次處理任務。
    * 顯示任務提交狀態與 Celery Task ID。
    * 提供快捷連結至批次歷史頁面。
* **使用者體驗優化:**
    * 全域統一的視覺風格 (基於 Bootstrap 5)。
    * 頁面之間平滑的淡入淡出轉場動畫。

## 🛠️ 技術棧

* **框架:** [Vue.js 3](https://vuejs.org/) (Composition API)
* **建構工具:** [Vite](https://vitejs.dev/)
* **路由:** [Vue Router](https://router.vuejs.org/)
* **狀態管理:** [Pinia](https://pinia.vuejs.org/) (已安裝，主要使用組件內狀態)
* **HTTP 客戶端:** [Axios](https://axios-http.com/)
* **UI/樣式:** [Bootstrap 5](https://getbootstrap.com/) (主要使用 CSS Class)

## 🚀 本地開發設定

**環境需求:**

* [Node.js](https://nodejs.org/) (建議 LTS 版本)
* [npm](https://www.npmjs.com/) (通常隨 Node.js 安裝) 或 [yarn](https://yarnpkg.com/)

**步驟:**

1.  **Clone 儲存庫:**
    ```bash
    git clone [https://github.com/Nick921003/Strawberry-detect-frontend.git](https://github.com/Nick921003/Strawberry-detect-frontend.git)
    cd Strawberry-detect-frontend
    ```

2.  **安裝依賴:**
    ```bash
    npm install
    # 或
    # yarn install
    ```

3.  **設定環境變數:**
    * 在專案根目錄建立一個 `.env` 檔案。
    * 加入後端 API 的基礎 URL：
        ```env
        VITE_API_BASE_URL=http://localhost:8000/api/process/
        ```
        *(請確保後端 Django 服務運行在 `http://localhost:8000`)*

4.  **啟動開發伺服器:**
    ```bash
    npm run dev
    # 或
    # yarn dev
    ```
    應用程式將運行在 `http://127.0.0.1:5173` (或 Vite 指定的其他端口)。

## 📦 可用腳本

* `npm run dev`: 以開發模式啟動應用程式，支援熱重載。
* `npm run build`: 將應用程式打包成用於生產環境的靜態檔案 (輸出至 `dist` 資料夾)。
* `npm run preview`: 在本地預覽生產環境打包後的結果。
* `npm run lint`: 執行 ESLint 檢查程式碼風格。

---

*(你可以視情況補充更多資訊，例如部署說明、未來計畫等)*
