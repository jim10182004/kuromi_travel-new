# 庫洛米旅行社 Kuromi Travel 🌍✈️

一個功能完整的旅行社網站，採用 Sanrio 庫洛米暗黑風格設計。

## 📦 專案內容

```
kuromi_travel/
├── app.py                      # Flask 後端應用程式
├── requirements.txt            # Python 依賴套件
├── templates/
│   ├── index.html             # 主要網頁（3700+ 行完整功能）
│   ├── hotel_search.js        # 飯店搜尋邏輯
│   └── hotel_booking.js       # 飯店預訂邏輯
└── README.md                   # 本說明文件
```

## ✨ 功能特色

### 🌐 全球化內容
- **20 個精選行程** - 涵蓋五大洲：
  - 🌏 亞洲 5 個（東京、首爾、曼谷、新加坡等）
  - 🌍 歐洲 6 個（柏林、巴黎、布拉格、阿姆斯特丹、冰島）
  - 🌎 美洲 4 個（紐約、洛杉磯、墨西哥、里約）
  - 🏝️ 大洋洲 2 個（雪梨、奧克蘭）
  - 🕌 非洲與中東 4 個（開羅、杜拜、摩洛哥、南非）

- **100+ 全球飯店** - 覆蓋 29 個國家
- **9 家 Sanrio 主題航空公司**

### 🎨 設計特色
- **暗黑哥德風格** - 紫黑色系，符合庫洛米品牌
- **響應式設計** - 支援桌面、平板、手機
- **流暢動畫** - 平滑過渡效果與互動動畫
- **單頁應用 (SPA)** - 無需換頁的流暢體驗

### 🛠️ 完整功能
- ✅ 行程搜尋與篩選
- ✅ 飯店搜尋與預訂
- ✅ 機票搜尋
- ✅ 購物車系統
- ✅ 結帳流程
- ✅ 收藏功能
- ✅ 訂單管理

## 🚀 安裝與執行

### 系統需求
- Python 3.7+
- pip

### 步驟 1: 解壓縮
```bash
unzip kuromi_travel_website.zip
cd kuromi_travel
```

### 步驟 2: 創建虛擬環境（建議）
```bash
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# 或
venv\Scripts\activate     # Windows
```

### 步驟 3: 安裝依賴
```bash
pip install -r requirements.txt
```

### 步驟 4: 啟動網站
```bash
python app.py
```

### 步驟 5: 訪問網站
打開瀏覽器，訪問：
```
http://127.0.0.1:5000/
```

## 📱 使用說明

### 首頁
- 瀏覽精選行程
- 快速搜尋機票/飯店
- 查看熱門目的地

### 行程搜尋
- 點擊「團體旅遊」進入搜尋頁
- 瀏覽 20 個全球精選行程
- 點擊任一行程查看詳情
- 可加入購物車或收藏

### 飯店訂房
- 點擊「訂房」標籤
- 選擇國家（29 個國家可選）
- 選擇飯店
- 選擇入住/退房日期
- 查看房型與價格

### 機票搜尋
- 點擊「找機票」標籤
- 輸入出發地/目的地
- 選擇日期
- 可選擇航空公司（9 家可選）

### 購物車與結帳
- 查看已加入的行程/飯店/機票
- 修改數量
- 填寫訂購資訊
- 完成預訂

## 🎨 設計系統

### 主要色彩
- **主色**: `#9B72AA` (庫洛米紫)
- **背景**: `#1A1A1A` (深黑)
- **強調色**: `#E94560` (粉紅)

### 字體
- **標題**: Noto Sans TC
- **內文**: Noto Sans TC

### 圖示
- Font Awesome 6.4.0

## 🔧 技術架構

### 前端
- **HTML5** - 語義化結構
- **Tailwind CSS 3.3** - 實用優先的 CSS 框架
- **Vanilla JavaScript** - 純 JS，無框架依賴
- **SVG Data URL** - 內聯圖片，無外部依賴

### 後端
- **Flask** - 輕量級 Python Web 框架
- **Jinja2** - 模板引擎

### 特殊功能
- **SPA 路由系統** - 客戶端路由，無需重載頁面
- **本地儲存** - 購物車與收藏使用 localStorage
- **SVG 圖片生成** - 動態生成彩色占位圖

## 📂 文件說明

### app.py
Flask 後端應用，負責：
- 提供靜態文件服務
- 渲染主頁面
- 處理路由

### templates/index.html
主要網頁文件，包含：
- 完整 HTML 結構（3700+ 行）
- 內嵌 CSS 樣式
- 內嵌 JavaScript 邏輯
- 所有頁面內容（首頁、搜尋、飯店、機票、購物車、結帳等）

### requirements.txt
Python 依賴套件：
- Flask

## 🌟 特色功能詳解

### 1. 內聯 SVG 圖片系統
不依賴外部圖片服務，使用 JavaScript 動態生成 SVG Data URL：
```javascript
function generateColoredImage(color, text, width, height) {
    // 生成彩色 SVG 背景 + 文字
    // 轉換為 Base64 Data URL
    // 100% 可靠，無網絡依賴
}
```

### 2. 全球化數據
- 20 個手工策劃的行程，每個都有獨特主題和詳細每日行程
- 100+ 飯店選項，涵蓋亞洲、歐洲、美洲、大洋洲、非洲
- 9 家 Sanrio 角色主題航空公司

### 3. 購物車系統
- 支援多種商品類型（行程、飯店、機票）
- 數量調整
- 即時價格計算
- LocalStorage 持久化

### 4. 響應式設計
- 桌面端（1920px+）：三欄佈局
- 平板端（768px-1919px）：兩欄佈局
- 手機端（<768px）：單欄佈局

## 🐛 已知問題與限制

### 模擬數據
- 所有行程、飯店、機票數據為模擬數據
- 無真實後端 API 連接
- 訂單僅保存在瀏覽器本地

### 付款功能
- 付款僅為模擬界面
- 無實際支付處理

## 🛠️ 自定義與擴展

### 修改行程數據
編輯 `templates/index.html` 中的 `generateItineraries()` 函數

### 修改飯店數據
編輯 `templates/index.html` 中的 `hotelsData` 對象

### 修改航空公司
編輯 `templates/index.html` 中的 `airlinesData` 對象

### 修改主題顏色
搜尋 `index.html` 中的顏色代碼並替換：
- `#9B72AA` - 主紫色
- `#E94560` - 粉紅色
- `#1A1A1A` - 背景黑色

## 📄 授權

本專案僅供學習與展示用途。

Sanrio 角色（庫洛米、美樂蒂等）為 Sanrio Company, Ltd. 所有。

## 🙏 致謝

- **Sanrio** - 角色與品牌靈感
- **Tailwind CSS** - CSS 框架
- **Font Awesome** - 圖示庫
- **Flask** - Web 框架

## 📞 支援

如有問題或建議，歡迎聯繫！

---

**享受您的庫洛米旅行社體驗！** 🖤💜✨
