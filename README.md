# ETH/USDT 技術指標儀表板

一個純前端的技術指標儀表板，用於顯示從 [Taapi.io](https://taapi.io/) API 獲取的 ETH/USDT 交易對的 **KDJ、RSI、MACD** 三大技術指標。

[psar](https://taapi.io/indicators/parabolic-sar/)  
[bbands](https://taapi.io/indicators/bollinger-bands/)  
[keltnerchannels](https://taapi.io/indicators/keltner-channels/)  
[atr](https://taapi.io/indicators/average-true-range/)  
[mfi](https://taapi.io/indicators/money-flow-index/)  
[dmi](https://taapi.io/indicators/directional-movement-index/)  

## ✨ 核心功能

- **三指標顯示**：KDJ、RSI、MACD 三個重要技術指標的即時數據
- **智能整點更新**：只在跨越新整點時自動獲取最新數據，節省API配額
- **累積式記錄**：數據會持續累積，可查看完整歷史記錄
- **智能緩存**：使用瀏覽器 IndexedDB 本地存儲，支援離線查看
- **速率限制優化**：序列化API請求 + 延遲機制，有效避免429錯誤
- **零後端架構**：純前端實現，可直接在瀏覽器運行

## 如何使用

### 1. 配置 API 金鑰（必需）

有3種方式設定您的 [Taapi.io](https://taapi.io/) API 金鑰：

#### 🔧 方式1：環境變量（推薦 - Vercel/Netlify）
```bash
# 複製環境變量範本
cp .env.example .env

# 編輯 .env 文件，設置您的API金鑰
TAAPI_API_KEY=your_actual_api_key_here

# 建構專案（會自動注入API金鑰）
npm run build
```

#### 📝 方式2：直接編輯 config.js（本地開發）
```javascript
const CONFIG = {
    TAAPI_API_KEY: 'your_actual_api_key_here', // 取消註釋並設置
};
```

#### 🌐 方式3：瀏覽器輸入（GitHub Pages）
無需預先設置，首次訪問時會提示您輸入API金鑰，儲存在瀏覽器本地。

### 2. 運行應用程式

只需在任何現代網頁瀏覽器中打開 `index.html` 文件即可。應用程式將自動獲取並顯示數據。

## 📁 專案結構

```
Taapi/
├── index.html              # 主頁面
├── script.js               # 主要邏輯
├── api-client-bulk.js      # API客戶端（支援三指標）
├── indexeddb-storage.js    # 本地存儲管理
├── config.js               # 配置文件
├── config.example.js       # 配置範例
├── README.md               # 說明文件
└── CLAUDE.md               # Claude Code 指引
```

## 🚀 部署

將所有文件上傳到任何靜態託管服務即可：

- **GitHub Pages**
- **Vercel** 
- **Netlify**
- **或直接本地運行**

## 安全注意事項

⚠️ 這是一個客戶端應用程式。您的 `TAAPI_API_KEY` 將在瀏覽器的源代碼中可見。為安全起見，建議使用權限受限的 API 金鑰，並監控其使用情況。
