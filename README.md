# 涓恆 AI 理財機器人

獨立 GitHub Pages 專案。

## 專案結構
- `index.html`：網站首頁，可直接由 GitHub Pages 發布
- `supabase/functions/financial-analysis/index.ts`：AI 分析後端範例
- `DEPLOY.md`：部署與 Supabase 設定說明
- `.nojekyll`：讓 GitHub Pages 直接發布靜態檔案

## GitHub Pages
建立公開 Repository：`juanheng-ai-financial-bot`

將本專案全部檔案上傳到 `main` 分支後，在：

`Settings → Pages → Build and deployment → Deploy from a branch`

選擇：
- Branch: `main`
- Folder: `/ (root)`

發布後網址通常會是：

`https://<你的GitHub帳號>.github.io/juanheng-ai-financial-bot/`

## 安全提醒
不要把 OpenAI API Key 寫入 `index.html`。API Key 應存放在 Supabase Secrets，並由 Edge Function 呼叫 AI。
