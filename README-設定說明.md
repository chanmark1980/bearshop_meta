# Bears & Soft Toys 網站 — 設定說明（繁體中文）

## 📁 檔案結構（上載成個 folder 去你嘅 domain 就得）
```
bears-soft-toys-website/
├── index.html          ← 首頁（獨立檔案）
├── products.html       ← 產品頁（獨立檔案）
├── about.html          ← 關於我（獨立檔案）
├── css/
│   └── style.css       ← 全部 CSS 喺呢度
├── js/
│   └── main.js         ← 全部 JS 喺呢度（輪播、篩選、電郵提交、GTM event）
├── images/             ← 全部相喺呢度
│   ├── hero-bear-shop.webp
│   ├── product-classic-brown-bear.webp
│   ├── product-pink-bunny.webp
│   ├── product-cream-bear.webp
│   ├── product-panda.webp
│   ├── product-bear-keychain.webp
│   ├── product-koala.webp
│   └── workshop-handmade.webp
├── Code.gs             ← Google Sheets Apps Script code
└── README-設定說明.md  ← 呢個檔案
```

## ✅ 上線前必做 3 件事（各 2 分鐘）

### 1) 換 GTM ID（3 頁都要換）
- 去 https://tagmanager.google.com 開一個 GTM 帳戶，抄低你嘅 ID，例如 `GTM-ABC1234`
- 用文字編輯器開 `index.html`、`products.html`、`about.html`
- 搵 `GTM-XXXXXXX` → 全部 Replace 做你嘅真 ID
- 每頁有 2 個位置：`<head>` 最頂嘅 `<script>` 同 `<body>` 一開始嘅 `<noscript>`，兩個都要換

### 2) 換你嘅網址（SEO 用）
- 3 頁入面搵 `https://www.yourdomain.com` → 換成你真正嘅 domain，例如 `https://www.bearsandsofttoys.hk`
- 換嘅地方：`<link rel="canonical">`、`og:url`、`og:image`、JSON-LD 入面嘅 `url`

### 3) 接駁 Google Sheets（電郵 → _demo / Contact）
1. 開你嘅 Google Sheets 試算表 `_demo`
2. 確認入面有一個分頁叫 `Contact`（如果未有，Apps Script 會自動幫你開）
3. 喺 _demo 入面：擴充功能 → Apps Script
4. 將 `Code.gs` 嘅內容貼入去，Save
5. Deploy → New deployment → 類型選 `Web app` → Execute as: Me → Who has access: `Anyone` → Deploy
6. 抄低 Web App URL（`https://script.google.com/macros/s/.../exec`）
7. 開 `js/main.js`，搵 `GOOGLE_SHEETS_WEB_APP_URL`，將 `YOUR_SCRIPT_ID` 換成你抄低嘅 URL
8. 測試：喺網站填一次電郵 → 睇吓 _demo / Contact 有冇多一行

> 測試小貼士：第一次 Deploy 之後，Google 會問你授權，按 Allow 就得。

## 📊 GTM 入面點樣接 GA4 / Facebook Pixel / Google Ads

網站已經喺 `js/main.js` 推咗以下 event 去 dataLayer，你喺 GTM 入面直接用嚟做 Trigger 就得，唔使再改網站 code：

| Event 名 | 幾時觸發 | 建議用途 |
|---|---|---|
| `whatsapp_click` | 撳任何 WhatsApp 連結 / 浮動按鈕 | GA4 事件、Facebook Pixel 自訂事件、Google Ads 轉換 |
| `email_submit` | 電郵表格成功提交 | GA4 事件、Facebook Pixel Lead、Google Ads 轉換（最重要） |
| `product_click` | 撳產品「睇詳情 / 用電郵查詢」 | GA4 產品點擊 |
| `form_view` | 睇到電郵表格 | 量度表格曝光 |
| `product_filter` | 喺產品頁撳篩選 | 了解邊類產品最受歡迎 |

GTM 設定流程（喺 tagmanager.google.com 做）：
1. 新增 Tag → GA4 Configuration / GA4 Event → 填你嘅 GA4 Measurement ID
2. 新增 Tag → Facebook Pixel（Custom HTML 或者用 Community Template）→ 填 Pixel ID
3. 新增 Tag → Google Ads Conversion Tracking → 填 Conversion ID / Label
4. 每個 Tag 嘅 Trigger 選 `Custom Event` → Event 名填上面嘅名，例如 `email_submit`
5. Preview → 測試一次提交 → Publish

## ✏️ 日後點樣獨立更新
- 改首頁文字/相：只開 `index.html`
- 加/減產品：只開 `products.html`，複製一個 `<article class="product-card">` 區塊，換相、名、價錢
- 改關於我：只開 `about.html`
- 改顏色/排版：只開 `css/style.css`
- 改相：將新相放入 `images/`，喺 HTML 換 `src="images/XXX.webp"` 同 `alt="..."` 就得
- 記得每張相都要寫好 `alt`，對 SEO 好重要

## 📱 聯絡設定
- 查詢主渠道：電郵表格 → Google Sheets _demo / Contact
- WhatsApp 只作快速聯絡：852-65424487，已喺全站連結到 https://wa.me/85265424487
- 如需改 WhatsApp 號碼：喺 3 頁 HTML 搵 `85265424487` 全部 Replace + `js/main.js` 入面 `WHATSAPP_NUMBER`

## 🔍 SEO 已經做咗咩
- 每頁獨立 SEO title + meta description + canonical + Open Graph + Twitter Card
- 每張相都有 alt 文字、width/height，Carousel 都有 aria 標籤
- Heading 結構：每頁只有一個 H1，之後 H2 → H3 順序落
- JSON-LD 結構化資料：首頁 Store、產品頁 ItemList/Product、關於頁 AboutPage
- 語言標示 `lang="zh-Hant"` + `og:locale="zh_HK"`
