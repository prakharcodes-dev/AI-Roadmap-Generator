# PathAI — Multi-Career AI Learning Roadmap Platform

🚀 **Live Demo:** [https://ai-roadmap-generator-v3y5.onrender.com](https://ai-roadmap-generator-v3y5.onrender.com)

PathAI is a full-stack, AI-powered career guidance and learning roadmap platform. It analyzes user experience, current skills, target career roles, duration constraints, and uploaded PDF resumes to perform an AI Skill-Gap Analysis, generate domain-specific multi-phase learning roadmaps, self-critique roadmap quality, and track learning progress in real-time.

---

## ✨ Key Features

### 1. 🌐 Multi-Career Roadmap Support
Supports **any professional career field** with tailored domain-specific roadmap structures instead of one-size-fits-all generic templates:
- **Chartered Accountancy (CA / CS / CMA)**: *Foundation & Eligibility → Intermediate Groups → Articleship & Practical Training → CA Final & Qualification.*
- **Law & Legal Practice**: *Legal Entrance & CLAT → Substantive Statutory Laws → Courtroom Internships & Legal Drafting → Bar Examination & Enrollment.*
- **Medicine & Healthcare**: *Pre-Clinical Sciences → Para-Clinical Diagnostic Foundations → Clinical Rotations → Hospital Internship & Medical Licensing.*
- **Engineering (Civil / Mechanical / Electrical)**: *Engineering Math & Physics → Discipline Core & CAD/FEA → Applied Field Projects → Professional Accreditation.*
- **Software / AI / Data Science**: *CS Fundamentals → Data Structures & Algorithms → Production CI/CD & Testing → Flagship Capstone & Technical Interviews.*
- **Finance & Investment Banking**: *Accounting Standards → Financial Modeling & Valuation → Portfolio Management → Professional Credentials (CFA/FRM).*
- **Business / MBA, Marketing, Teaching, Government & Custom Careers**: Dynamically generates tailored roadmap phases for any user-typed profession.

### 2. 🧠 AI Skill Skipping Personalization
- Explicitly separates **"What You Already Know"** (verified skills matching target role) from **"What You Need to Learn"** (unmastered skills).
- Automatically **skips already known topics** in the generated roadmap so no time is wasted re-learning concepts the user has already mastered.

### 3. ⭐ AI Roadmap Quality Score (Self-Critique Matrix)
Evaluates every generated roadmap across 4 core quality dimensions before displaying:
- **Goal Alignment** (e.g. `94%`)
- **Difficulty Flow** (e.g. `88%`)
- **Prerequisites Integrity** (e.g. `92%`)
- **Practical Value** (e.g. `95%`)
- **Overall Rating**: Rendered as a prominent quality score card (e.g. **`92 / 100`**).

### 4. 🔍 Career Explorer (For Undecided Users)
An interactive AI career guidance tool for users who aren't sure which path to pursue:
- Accepts natural language inputs or 1-click preset interest chips (*"I like coding & math"*, *"I enjoy law & debating"*, *"I like medicine & biology"*, *"I like finance"*).
- Suggests top 5 suitable careers and provides explicit **"Why this matches you"** explanations with salary ranges and key skill tags.
- Features 1-click **"Build Roadmap for [Role] →"** action that pre-fills onboarding instantly.

### 5. 📄 PDF Resume Skill Extraction
- Drag-and-drop resume PDF upload during onboarding.
- Automatically parses text using `pypdf` and matches keywords against a canonical technical & professional skill taxonomy to auto-fill current skills.

### 6. 🚀 Interactive Vertical Roadmap & Checklist
- 4 logical milestone phases matching target duration and commitment.
- Topic pills, actionable task checklists with real-time SQLite DB toggle sync, hands-on capstone projects, and curated learning resource links.
- Celebratory confetti effects upon completing tasks.

### 7. 📊 Real-Time Progress Dashboard
- Analytics metrics grid: Overall Progress %, Tasks Completed, Time Invested, Job Readiness Growth, Roadmap Quality Score.
- **Next Up Task Widget** with one-click completion.
- Phase momentum progress bars & target skill mastery breakdown.

---

## 🔄 Roadmap Generation Flow

The end-to-end pipeline processes user profile data through 4 automated stages:

```text
┌───────────────────────────┐      ┌───────────────────────────┐
│ 1. User Input & PDF Resume │ ───► │ 2. Skill-Gap & Skipping   │
│ (Role, Skills, Duration)  │      │ (Known vs Missing Skills) │
└───────────────────────────┘      └─────────────┬─────────────┘
                                                 │
┌───────────────────────────┐      ┌─────────────▼─────────────┐
│ 4. Interactive Roadmap UI │ ◄─── │ 3. AI Generation & Score  │
│ (Checklists, DB Sync)     │      │ (Phase Blueprints, Matrix)│
└───────────────────────────┘      └───────────────────────────┘
```

1. **User Profile & Resume Input**: Collects target role, experience level, time commitment, and extracts skills from uploaded PDF resumes.
2. **AI Skill-Gap & Skill Skipping**: Compares known skills against domain requirements, calculating readiness % and skipping mastered skills.
3. **AI Generation & Self-Critique**: Structures 4 milestone phases with actionable tasks and evaluates a 4-dimension Roadmap Quality Score (Goal Alignment, Difficulty Flow, Prerequisites, Practical Value).
4. **Interactive Timeline & DB Sync**: Saves roadmap to SQLite database (`roadmap_generator.db`) and renders vertical checklist timeline with task toggle sync.

---

## 🏗️ System Architecture & Tech Stack

```text
       ┌───────────────────────────────────────────────────┐
       │             React Frontend (Vite SPA)             │
       │   Modern SaaS Dark Theme (#090D16) + Vanilla CSS  │
       └─────────────────────────┬─────────────────────────┘
                                 │ REST API
       ┌─────────────────────────▼─────────────────────────┐
       │                Flask REST API Backend             │
       │          Python 3 • SQLAlchemy • SQLite DB        │
       └─────┬───────────────────┬───────────────────┬─────┘
             │                   │                   │
   ┌─────────▼─────────┐ ┌───────▼────────┐ ┌────────▼─────────┐
   │ PDF Resume Parser │ │ Skill-Gap      │ │ AI Roadmap      │
   │   (pypdf engine)  │ │ Analyzer Engine│ │ Generator       │
   └───────────────────┘ └────────────────┘ └─────────────────┘
```

- **Frontend**: React, Vite, Lucide Icons, Canvas-Confetti, Vanilla CSS System (Modern Dark Theme, Glassmorphic cards, responsive design).
- **Backend**: Flask REST API (Python 3), Flask-CORS.
- **Database**: SQLite (`roadmap_generator.db`) storing Users, Skill Gaps, Roadmaps, and Task Progress.
- **AI Integration**: Google Gemini LLM API with structured domain heuristic engine fallback.

---

## ⚡ React + Vite Frontend Infrastructure

This application uses a high-performance React setup powered by Vite with HMR and Oxlint / SWC rules.

### Official Plugins Used
- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) using [Oxc](https://oxc.rs/)
- [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) using [SWC](https://swc.rs/)

---

## 📁 Project Directory Structure

```text
├── backend/
│   ├── app.py                # Flask REST API server & static frontend host
│   ├── ai_engine.py          # Skill gap analyzer, quality score matrix & roadmap engine
│   ├── resume_parser.py      # PDF text extractor & skill taxonomy matcher
│   ├── database.py           # SQLite database setup & schemas
│   ├── test_backend.py       # Automated backend test suite
│   └── uploads/              # Uploaded PDF resumes directory
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Glassmorphic header navigation bar
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Hero section, 3-step guide & quick career badges
│   │   │   ├── CareerExplorerPage.jsx # Career discovery & match rationale UI
│   │   │   ├── OnboardingPage.jsx   # 3-Step wizard & resume uploader
│   │   │   ├── AnalysisPage.jsx     # Readiness gauge & skill skipping breakdown
│   │   │   ├── RoadmapPage.jsx      # Vertical roadmap timeline, Quality Score card & checklist
│   │   │   └── DashboardPage.jsx    # Progress analytics & Next Task card
│   │   ├── App.jsx                  # Main router & localStorage state manager
│   │   ├── index.css                # SaaS dark design tokens & styles
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile                # Production multi-stage Docker build
├── .dockerignore
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Clone Workspace
```bash
git clone https://github.com/prakharcodes-dev/AI-Roadmap-Generator.git
cd AI-Roadmap-Generator
```

### 2. Backend Setup
```bash
# Install Python dependencies
python -m pip install flask flask-cors pypdf google-generativeai python-dotenv gunicorn

# Run Flask Backend API (Runs on http://localhost:5000)
python backend/app.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Run Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

---

## 🐳 Running with Docker

Build and run using the single-container production `Dockerfile`:

```bash
# Build Docker Image
docker build -t roadmap-generator .

# Run Docker Container
docker run -d -p 5000:5000 -e PORT=5000 --name roadmap-app roadmap-generator
```

---

## 🌐 Accessing the Web Application

- **Live Render Deployment**: **[https://ai-roadmap-generator-v3y5.onrender.com](https://ai-roadmap-generator-v3y5.onrender.com)**
- **Local Application Server**: **[http://localhost:5000](http://localhost:5000)** *(Flask serves REST API + compiled React SPA)*
- **Vite Development Server**: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | API health status check |
| `POST` | `/api/career-explorer` | Analyzes interests & strengths; returns 5 career recommendations with fit rationale |
| `POST` | `/api/resume/upload` | Parses PDF resume file and returns extracted technical skills |
| `POST` | `/api/analyze-gap` | Saves user profile, computes skill gap, and returns readiness score |
| `POST` | `/api/generate-roadmap` | Generates structured multi-phase AI roadmap tailored to target career with quality score |
| `GET` | `/api/roadmap/<user_id>` | Fetches user roadmap, phase tasks, quality score matrix, and completion status |
| `POST` | `/api/progress/toggle` | Toggles task completion state and recalculates progress % |
| `GET` | `/api/dashboard/<user_id>` | Returns dashboard metrics, next pending task, quality rating, and phase momentum stats |

---

## 🧪 Running Automated Tests

Run backend unit tests:
```bash
python backend/test_backend.py
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
