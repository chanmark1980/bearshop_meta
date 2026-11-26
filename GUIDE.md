# 毛絨小熊手作屋 — 新手網站架設與維護完全指南

歡迎使用這套專為您打造的傳統多頁式網站！本網站採用純 **HTML、CSS 與 JavaScript** 編寫，無需複雜的開發環境即可直接修改、管理，並上傳至您自己的網域（Domain）。

---

## 一、網站檔案結構說明

解壓縮後，您會看到以下資料夾與檔案：

```text
bear-soft-toys-site/
├── index.html          # 首頁（輪播大圖、品牌特色、人氣精選、新品電郵登記）
├── products.html       # 產品系列頁（支援分類篩選、完整商品價格與規格）
├── about.html          # 關於我頁面（品牌故事、手作理念、新品電郵登記）
├── css/
│   └── style.css       # 全站共用的外觀樣式表（顏色、字體、手機版排版）
├── js/
│   └── main.js         # 全站共用的互動功能（輪播、分類篩選、傳送電郵至試算表）
├── images/             # 所有網站照片存放處
├── gas/
│   └── Code.gs         # Google Apps Script 後端程式碼（用來把電郵存進 Google Sheets）
└── GUIDE.md            # 本新手教學指南
```

### 日後如何輕鬆更新網站？
- **修改單頁文字或新增商品**：用記事本、VS Code 或任何文字編輯器開啟對應的 `.html` 檔（例如只改產品就開 `products.html`），完全不會影響其他頁面。
- **更換照片**：將新照片放進 `images/` 資料夾，並修改 HTML 中 `<img src="images/檔名.jpg" alt="圖片描述">` 的檔名與 `alt` 文字即可。
- **調整全站配色**：開啟 `css/style.css` 最上方的 `:root` 區塊，修改色碼即可一次更新三個頁面的主題顏色。

---

## 二、設定 Google Sheets (`_demo / Contact`) 與安裝 GAS

目前網站上的「訂閱新品通知」電郵表格，需要透過 **Google Apps Script (GAS)** 把顧客填寫的電郵自動寫入您的 Google 試算表。

### 步驟 1：建立 Google 試算表
1. 登入您的 **Google Drive**（雲端硬碟）。
2. 建立（或開啟）名為 **`_demo`** 的資料夾。
3. 進入 `_demo` 資料夾，點選左上角 **「新增」>「Google 試算表」**。
4. 將試算表名稱改為 **`Contact`**。

### 步驟 2：貼上 GAS 程式碼
1. 在 `Contact` 試算表頁面，點選上方選單 **「擴充功能」>「Apps Script」**。
2. 刪除編輯區原本預設的 `function myFunction() {}`。
3. 用記事本開啟本資料夾內的 `gas/Code.gs`，全選並複製所有程式碼，貼到 Apps Script 編輯區。
4. 按上方磁碟片圖示（或 `Ctrl+S` / `Cmd+S`）儲存專案，專案名稱可取為 `Contact Form Handler`。

### 步驟 3：部署為網頁應用程式（Web App）
1. 點選 Apps Script 右上角的藍色按鈕 **「部署」>「新增部署」**。
2. 點選「選取類型」旁的齒輪圖示，選擇 **「網頁應用程式」**。
3. 填寫以下設定：
   - **說明**：`電郵訂閱接收端`
   - **執行身分**：選擇 **「我」**（您的 Google 帳號）
   - **誰可以存取**：選擇 **「所有人」**（這樣訪客填表時才能寫入）
4. 點選 **「部署」**。首次部署時會跳出「授予存取權」視窗：
   - 點選 **「審查權限」** > 選擇您的 Google 帳號。
   - 若出現「Google 尚未驗證這個應用程式」，請點左下角 **「進階」** > **「前往 ...（不安全）」** > **「允許」**。
5. 部署成功後，複製畫面上的 **「網頁應用程式網址」**（結尾通常是 `/exec`）。

### 步驟 4：將網址貼回網站
1. 開啟 `js/main.js`。
2. 找到第 6 行：
   ```javascript
   const GAS_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
   ```
3. 將引號內的文字替換為您剛複製的 `/exec` 網址並儲存。之後訪客送出電郵，就會自動出現在 `_demo/Contact` 試算表中（含香港時間、電郵地址與來源頁面）。

---

## 三、設定 Google Tag Manager (GTM) 與追蹤工具

本網站的 **三個 HTML 頁面**（`index.html`、`products.html`、`about.html`）皆已依 Google 官方建議，在 `<head>` 最頂端與 `<body>` 開頭處放好 GTM 兩段程式碼。

### 步驟 1：取得您的 GTM 容器編號
1. 前往 [Google Tag Manager](https://tagmanager.google.com/) 並登入 Google 帳號。
2. 點選 **「建立帳戶」**，輸入商店名稱與地區（香港），目標平台選擇 **「網站（Web）」**。
3. 建立完成後，畫面右上角會顯示一組以 `GTM-` 開頭的編號（例如 `GTM-AB12CDE`）。

### 步驟 2：更新三個 HTML 檔案中的編號
請分別開啟 `index.html`、`products.html` 與 `about.html`，搜尋 **`GTM-XXXXXXX`**（每個檔案各有 2 處：一處在 `<head>` 內，一處在 `<body>` 的 `<noscript>` 內），全部替換成您的真實 `GTM-` 編號並儲存。

### 步驟 3：在 GTM 內串接 GA4、Google Ads 與 Facebook Pixel
日後您不需要再改網站程式碼，只要在 GTM 後台新增「代碼（Tags）」即可：

1. **Google Analytics 4 (GA4)**
   - 在 GA4 建立資料串流取得「評估 ID（`G-XXXXXXXXXX`）」。
   - 在 GTM 點選「代碼」>「新增」> 代碼類型選 **「Google 代碼（Google Tag）」**，貼上評估 ID，觸發條件選 **「Initialization - All Pages」**。
2. **Google Ads 轉換追蹤**
   - 在 Google Ads 取得「轉換 ID」與「轉換標籤」。
   - 在 GTM 新增代碼選 **「Google Ads 轉換追蹤」**，並可將觸發條件設為「自訂事件：`email_subscribe`」（本網站表單送出成功時會自動發出此事件！）。
3. **Facebook Pixel (Meta Pixel)**
   - 前往 Meta 事件管理工具複製您的 Pixel 程式碼（或使用 GTM 社群範本庫中的 `Facebook Pixel` 範本填入 Pixel ID）。
   - 觸發條件選 **「All Pages」** 追蹤瀏覽；若要追蹤訂閱或點擊 WhatsApp，可分別綁定自訂事件 **`email_subscribe`** 與 **`whatsapp_click`**。
4. 設定完成後，別忘了點選 GTM 右上角的 **「提交（Submit）」>「發布（Publish）」** 才會正式生效！

---

## 四、將網站上傳到您自己的網域（Domain）

因為這套網站是純靜態網頁（HTML + CSS + JS + 圖片），您可以選擇以下任一簡單方式上線：

### 方法 A：使用免費靜態網站託管（推薦新手，免費且自動附帶 HTTPS 安全憑證）
- **Cloudflare Pages** 或 **Netlify**（支援拖曳上傳）：
  1. 註冊並登入 [Netlify](https://www.netlify.com/) 或 [Cloudflare Pages](https://pages.cloudflare.com/)。
  2. 選擇「手動上傳 / Direct Upload」，把整個 `bear-soft-toys-site` 資料夾（注意不要多包一層母資料夾，要讓 `index.html` 在最外層）拖曳進去即可上線。
  3. 進入該服務的 **Domain Settings（網域設定）**，輸入您購買的網域，並依指示在網域商（如 GoDaddy、Namecheap、Cloudflare）修改 DNS 紀錄（`CNAME` 或 `A` 紀錄），等待幾分鐘即可用自己的網址開啟網站。

### 方法 B：使用傳統網頁寄存（cPanel / FTP）
1. 登入您的網頁寄存後台（cPanel）> **檔案管理員（File Manager）**。
2. 進入 `public_html` 資料夾。
3. 將 `index.html`、`products.html`、`about.html`、`css/`、`js/`、`images/` 全部上傳到 `public_html` 內即可（`gas/` 與 `GUIDE.md` 不需要上傳到網站空間）。
