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
