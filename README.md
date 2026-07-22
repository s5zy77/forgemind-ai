# ForgeMind AI — Industrial Knowledge Intelligence Platform

ForgeMind AI is an enterprise-grade Decision Intelligence Platform designed to unify industrial telemetry, process documentation, incident logs, and maintenance records. It empowers site reliability engineers, plant operators, and maintenance managers with real-time diagnostics, predictive analytics, and grounded AI recommendations.

---

## 📋 Problem Statement

Modern manufacturing facilities and chemical plants produce vast arrays of data across disparate silos:
1. **IoT Sensor Feeds**: Streams of temperature, pressure, and vibration metrics that require continuous monitoring.
2. **Relational Knowledge Silos**: Vendor-supplied equipment manuals, standard operating procedures (SOPs), safety protocols, and supply-chain databases.
3. **Operational Logs**: Historical records of unplanned outages, service reports, and technician notes.

Without an integrated platform, engineers must manually cross-reference these silos during a critical trip, leading to increased **Mean Time To Repair (MTTR)**, excessive maintenance overhead, and catastrophic equipment failures.

---

## 💡 The ForgeMind AI Solution

ForgeMind AI resolves industrial data fragmentation through a cohesive three-tier architecture:
- **Operations Brain (AI RAG)**: A Retrieval-Augmented Generation (RAG) assistant that queries real-time telemetry, PDF manuals, and incident logs to deliver grounded, citation-backed failure diagnostics.
- **Interactive Digital Twin**: A live 2D plant floor grid utilizing WebSocket telemetry streams to visually flash risk halos on vibrating or overheating machinery.
- **Relational Knowledge Graph**: A visual map charting directed nodes (Assets, Engineers, Documents, Failures, Suppliers) for complete relational traceability.
- **Predictive Remaining Useful Life (RUL)**: Mathematical forecasting calculating health decay curves and warning of overdue services before breakdowns occur.

---

## 🛠️ Tech Stack

### Frontend
- **React & TypeScript**: Single-page application logic and data binding.
- **Vite**: High-performance module bundler.
- **Tailwind CSS & CSS Variables**: Sleek modern interface conforming to the original design layout. Supports dynamic Light Mode & Dark Mode toggles.
- **Framer Motion**: Smooth transitions, drawer sliders, and loading shimmers.
- **Chart.js & React-Chartjs-2**: High-density analytics charts (utilized fleet metrics, downtime causes, cost trends, and risk radar).
- **Socket.IO Client**: Live WebSocket subscription to telemetry broadcasts.

### Backend
- **Node.js & Express (TypeScript)**: REST APIs and Socket.IO server.
- **Prisma ORM**: Relational database client.
- **Socket.IO**: Real-time event emitter streaming sensor updates.
- **PDFKit & json2csv**: Document generation and exporting.
- **OpenAI API & LangChain**: RAG semantic document querying.

### Database
- **SQLite**: Local development database pre-configured out-of-the-box.
- **PostgreSQL**: Production database supported via `.env` toggle.

---

## 🔒 Security Architecture

ForgeMind AI implements robust enterprise-grade security protocols:
- **Helmet**: Secures HTTP response headers against clickjacking, XSS, and sniff sniffing.
- **JWT Authentication & RBAC**: Stateless token validation enforcing role-based permissions (`ADMIN`, `ENGINEER`, `OPERATOR`).
- **Express Rate Limiting**: Mitigates brute-force attacks by limiting API calls per client IP.
- **CORS White-listing**: Strictly allows configured request origins.
- **Password Hashing**: Uses `bcryptjs` for secure user password storage.

---

## 📂 Folder Structure

```
forgemind-ai/
├── client/                 # Vite React application
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Sidebar, Topbar, Modals)
│   │   ├── context/        # Auth, Socket, Theme state providers
│   │   ├── pages/          # Layout views (Dashboard, Brain, Assets, Twin, Graph)
│   │   ├── services/       # Axios API client setup
│   │   └── index.css       # Layout styles & theme variables
│   └── package.json
├── server/                 # Express backend server
│   ├── src/
│   │   ├── controllers/    # API controllers (AI, Assets, Incidents)
│   │   ├── middleware/     # JWT verification & rate-limiting guards
│   │   ├── services/       # RUL math calculations, PDF/CSV reporters
│   │   ├── routes/         # Express router endpoints
│   │   └── index.ts        # HTTP server entrypoint
│   └── package.json
├── prisma/
│   ├── schema.prisma       # Relational models
│   └── seed.ts             # Rich database seed file
├── shared/                 # TypeScript interfaces shared between tiers
└── README.md
```

---

## ⚙️ Environment Variables

Copy the `.env.example` file and configure:

```ini
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="forgemind_super_secret_jwt_key_2026"
OPENAI_API_KEY="your-openai-api-key"
NODE_ENV="development"
```

*Note: If no `OPENAI_API_KEY` is provided, ForgeMind AI automatically falls back to its local industrial semantic logic matrix, meaning all AI features remain fully functional without external key costs.*

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Database & Seed Data
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Run Development Servers
```bash
npm run dev
```
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔮 Future Roadmap

1. **Multi-modal RAG**: Parse CAD drawings and process piping diagrams (P&IDs) directly in the Operations Brain.
2. **Edge Telemetry Connectors**: Build native MQTT, OP-UA, and Modbus ingestion adapter pipelines.
3. **VR Plant Integration**: Support WebXR for immersive digital twin visual walkthroughs.

---

## 📄 License

This project is licensed under the MIT License.
