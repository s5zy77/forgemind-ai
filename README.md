# ForgeMind AI — Industrial Knowledge Intelligence Platform

A full-stack industrial operations SaaS platform built with React, TypeScript, Node.js, Express, Prisma ORM, Socket.IO, and RAG AI Operations reasoning.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Chart.js, Lucide Icons, Socket.IO Client.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Socket.IO, JWT Auth, OpenAI API / LangChain RAG.
- **Database**: Prisma ORM with SQLite (pre-seeded for zero-setup local execution) & PostgreSQL support.
- **Reports**: PDFKit (PDF generation) & json2csv (CSV generation).

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
npm install --workspace=server
npm install --workspace=client
```

### 2. Initialize Database & Seed Industrial Telemetry Data
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Start Development Servers (Backend + Frontend)
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## Architecture Highlights

1. **Operations Brain RAG Pipeline**: Combines multi-sensor asset state, equipment manuals, incident logs, and maintenance schedules into grounded AI responses with confidence scores and source citations. Supports OpenAI GPT models and local industrial fallback logic.
2. **Real-Time Telemetry Digital Twin**: Stream live temperature and vibration fluctuations over Socket.IO WebSockets directly to the interactive 2D plant floor.
3. **Interactive Knowledge Graph**: Render relational node-edge networks connecting assets, engineers, manuals, failure codes, and suppliers.
4. **Predictive Maintenance & RUL**: Algorithmic Remaining Useful Life calculation engine with 90-day probability trend forecasting.
5. **PDF & CSV Report Generator**: One-click downloadable PDF and CSV reports for fleet maintenance, incident logs, and executive summaries.
6. **Global Search (`Cmd+K`)**: Instant search across assets, manuals, incidents, and engineers.
