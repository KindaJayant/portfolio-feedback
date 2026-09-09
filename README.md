# SuperInvesting Portfolio Research & Feedback Hub

A dedicated, non-slop internal product research & feedback management platform for the **SuperInvesting.ai Product Team**. Built to conduct structured 1-on-1 interviews with top power users, capture portfolio diagnostics pain points, and aggregate high-demand feature requests.

---

## ⚡ Zero-Backend Serverless Architecture
This application is completely self-contained and requires **no custom backend servers**:
- **Offline-First Persistence**: Powered by browser `LocalStorage` / `IndexedDB` with instant cross-tab state syncing.
- **Direct Google Sheets Webhook Sync**: Enter any Google Apps Script / Make.com webhook in Settings to automatically log every completed interview as a row in your team's live Google Sheet.
- **Supabase / Cloud Sync (Optional)**: Direct client-side REST sync support if you wish to link a Supabase table.
- **Instant Vercel Deployment**: Pre-configured with `vercel.json` for 1-click zero-config deployment.

---

## 🚀 Quick Start (Local Run)

```bash
# 1. Navigate to directory
cd portfolio-feedback

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

App runs at `http://localhost:5173`.

---

## 🌐 Deploy to Vercel (1-Click)

### Option A: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B: Via GitHub Repository
1. Push this repository to GitHub: `https://github.com/KindaJayant/portfolio-feedback.git`
2. Go to [vercel.com/new](https://vercel.com/new) and import `portfolio-feedback`.
3. Framework Preset: **Vite**.
4. Click **Deploy**.

---

## 📊 Features & Workflow

1. **Top 10 Power Users Queue**: Pre-seeded with top investors (Gaurav Agrawal, Paresh Shah, Krishna Mohan, etc.) with 1-click **Call (`tel:`)**, **WhatsApp Invitation**, and **Interview Logger**.
2. **Structured Call Logger Modal**: Likert satisfaction ratings (1-5), broker selection, categorized pain points (Syncing, Missing assets, Lack of actionable advice, XIRR confusion, Generic AI summaries), wishlist feature voting, and verbatim quotes.
3. **Aggregated Insights Dashboard**: Live rankings of biggest friction points and feature demand leaderboards.
4. **Self-Serve Questionnaire Mode**: Shareable public feedback form (`/form`) for users who prefer filling out a quick online questionnaire.
5. **CSV & Slack Export**: Download formatted CSV spreadsheet or copy a structured markdown summary report directly to Slack/Notion.

---

## 📝 Google Apps Script for Google Sheets (Optional Webhook)

To automatically push submissions into a Google Sheet:
1. In a Google Sheet, open **Extensions** → **Apps Script**.
2. Paste the following script:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.userName,
    data.userPhone,
    data.userEmail,
    data.satisfactionScore,
    (data.brokers || []).join(', '),
    (data.painPoints || []).join(', '),
    (data.featureRequests || []).join(', '),
    data.verbatimFeedback,
    data.actionItems
  ]);
  return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
}
```
3. Click **Deploy** → **New deployment** → **Web App** (Access: Anyone).
4. Copy the URL and paste it into the **Settings modal** inside the app.
