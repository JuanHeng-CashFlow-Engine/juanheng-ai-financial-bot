# 涓恆 AI 理財機器人：正式網站部署

## 1. GitHub Pages 前端
1. 將 `juanheng-ai-financial-bot.html` 改名為 `index.html`。
2. 上傳到你的 GitHub Pages repository 根目錄。
3. Commit 後，GitHub Pages 會用 `index.html` 當首頁。

## 2. Supabase Edge Function
建立 Function：`financial-analysis`，內容使用 `supabase/functions/financial-analysis/index.ts`。

在 Supabase 專案設定 Secret：

```bash
supabase secrets set OPENAI_API_KEY=你的_OpenAI_API_Key
```

部署：

```bash
supabase functions deploy financial-analysis
```

部署完成後，會得到類似：

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/financial-analysis
```

## 3. 把前端接到後端
打開 `index.html`，搜尋：

```js
const AI_API_ENDPOINT = "";
```

改成：

```js
const AI_API_ENDPOINT = "https://YOUR_PROJECT_REF.supabase.co/functions/v1/financial-analysis";
```

重新 Commit / Push。

## 4. 安全重點
- 不要把 OpenAI API Key 寫進 HTML 或 GitHub repository。
- API Key 只存 Supabase Secret。
- 若網站要公開給很多人使用，下一步應加入 Supabase Auth、使用量限制（rate limit）和每位使用者配額。
- 「最新行情／最新新聞」不能只靠 AI 模型；要另外串接行情與新聞資料源，並把來源和時間一起傳入 AI。


## 5. Phase 1：共用涓恆會員登入與退休資產

AI 網站與退休金流續航儀使用同一個 Supabase 專案與 Auth。

兩個 GitHub Pages 頁面都位於 `juanheng-cashflow-engine.github.io`，只是路徑不同，因此瀏覽器端可沿用同一個 Supabase session。

「投資組合風險管理」新增「載入我的退休持股」：
- 讀取目前會員的 `user_portfolios`
- 讀取目前會員啟用中的 `user_assets`
- 由 `etf_prices` 補上市價與名稱
- 台股持股市值沿用退休站規則：張數 × 1,000 × 市價
- Phase 1 先維持既有 AI Edge Function 呼叫方式，避免與目前 CORS 設定衝突

安全原則：
- 前端只使用 publishable key
- 不可把 service role / secret key 放進 GitHub Pages
- 個人資料查詢仍由 Supabase RLS 限制，只能讀取自己的資料


## 6. Phase 1.5：AI 後端會員驗證（下一步）

目前正式 `financial-analysis` Edge Function 的 JWT 驗證尚未啟用，而且 CORS 只允許 `content-type`。
在把會員 JWT 帶入 AI 後端以前，應一起完成：

- Edge Function CORS 加入 `authorization, apikey, x-client-info, content-type`
- 將 `financial-analysis` 設為 `verify_jwt = true`
- 前端呼叫 Edge Function 時傳入目前會員 access token
- 驗證未登入者會收到 401，登入者可以正常分析

這一階段應與前端 Authorization header 同時上線，避免只改其中一邊造成瀏覽器 CORS 失敗。


### Phase 1.5 測試端點
Draft PR 測試分支改用：
`https://dhhazovgtpcxunmdnlqd.supabase.co/functions/v1/financial-analysis-auth`

此函式已啟用 `verify_jwt = true`，並允許瀏覽器傳送：
`authorization, apikey, x-client-info, content-type`。

正式 `financial-analysis` 尚未替換，因此正式網站不受影響。
