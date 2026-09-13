# AI + API + Cloud Startup Idea Generator and Validator

A full-stack prototype implementing the flow:

```
User Input → AI Idea Generation → API Data Collection → Market Validation
           → Cloud Storage & Processing → Final Startup Report
```

## Architecture

```
startup-idea-validator/
├── server/
│   ├── server.js                 # Express app entry point
│   ├── routes/
│   │   └── ideaRoutes.js         # /api/ideas endpoints
│   ├── controllers/
│   │   └── ideaController.js     # Orchestrates the 5-step flow
│   ├── services/
│   │   ├── aiService.js          # Step 1: AI idea generation (Claude API)
│   │   ├── marketService.js      # Step 2: market/competitor data (mocked, pluggable)
│   │   ├── validationService.js  # Step 3: feasibility scoring, audience, revenue, tech stack
│   │   └── storageService.js     # Step 4: cloud storage layer (JSON file stand-in)
│   └── data/
│       └── ideas.json            # Legacy local store; reports now use MongoDB
├── public/
│   ├── index.html                # Input form + report UI
│   ├── css/style.css
│   └── js/script.js               # Calls the API, renders the report
├── package.json
└── .env.example
```

## How each step maps to code

| Flow Step | File | What it does |
|---|---|---|
| User Input | `public/index.html`, `public/js/script.js` | Form collects interests/skills/domain/budget, POSTs to `/api/ideas/generate` |
| AI Idea Generation | `server/services/aiService.js` | Sends a structured prompt to Claude, returns 3 startup ideas as JSON |
| API Data Collection | `server/services/marketService.js` | Fetches (or here, simulates) trend score, competition level, market size, competitors per idea |
| Market Validation | `server/services/validationService.js` | Computes a feasibility score, risk level, target audience, revenue models, tech stack |
| Cloud Storage & Processing | `server/services/storageService.js` | Persists reports in MongoDB through Mongoose |
| Final Startup Report | `server/controllers/ideaController.js` returns it; `public/js/script.js` renders it | JSON report with ranked, validated ideas |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and configure MongoDB plus your AI API key:
   ```bash
   cp .env.example .env
   ```
   For a local MongoDB server, keep:
   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/startup-idea-validator
   ```
   For MongoDB Atlas, use the connection string provided by Atlas, for example:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
   ```
   The server connects before accepting requests and creates the default admin user in MongoDB when the users collection is empty.
3. Run the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:5000` in your browser.

## Swapping in real cloud/API services

- **Market data**: replace the mock logic in `marketService.js` with real calls to Google Trends (via SerpApi), Crunchbase, ProductHunt, or NewsAPI. The function signature (`getMarketData(idea)`) stays the same.
- **Storage**: `storageService.js` uses MongoDB Atlas or a local MongoDB instance through the Mongoose models. The exported functions (`saveReport`, `getReport`, `listReports`, and `deleteReport`) are the interface the rest of the app depends on.
- **Scaling**: since storage and market data are isolated behind clean service interfaces, you can move this to a serverless setup (e.g. AWS Lambda + API Gateway) with minimal changes to the controller layer.

## API Endpoints

- `POST /api/ideas/generate` — body: `{ interests, skills, domain, budget }` → returns a full validated report
- `GET /api/ideas` — list saved report summaries
- `GET /api/ideas/:id` — fetch one full report
