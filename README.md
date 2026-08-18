# PathAI — Multi-Career AI Learning Roadmap Platform

PathAI is a full-stack, AI-powered career guidance and learning roadmap platform. It analyzes user experience, current skills, target career roles, duration constraints, and uploaded PDF resumes to perform an AI Skill-Gap Analysis, generate domain-specific multi-phase learning roadmaps, and track progress in real-time.

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

### 2. 🔍 Career Explorer (For Undecided Users)
An interactive AI career guidance tool for users who aren't sure which path to pursue:
- Accepts natural language inputs (e.g., *"I like mathematics, computers and problem solving."* or *"I enjoy finance, stock markets and numbers."*).
- Analyzes interests, favorite subjects, and strengths across all industries.
- Suggests 4-5 suitable careers and provides explicit **"Why this matches you"** explanations:
  > **Data Scientist** — *Recommended because you enjoy mathematics, computers, and analytical problem solving.*
- Features a **"Select & Build Career Roadmap →"** action that pre-fills the onboarding wizard with the chosen profession.

### 3. 🎯 AI Skill-Gap & Readiness Analysis
- Computes an interactive **Job Readiness Score (%)** gauge.
- Categorizes skills into 3 distinct cards:
  - 🟢 **Strong Skills** (verified skills matching target role)
  - 🟡 **Skills to Improve** (foundational skills needing depth)
  - 🔴 **Missing Skills** (critical target role requirements to learn)
- Generates strategic AI mentor career advice.

### 4. 📄 PDF Resume Skill Extraction
- Drag-and-drop resume PDF upload.
- Automatically parses text using `pypdf` and matches keywords against a technical & professional skill taxonomy to auto-fill current skills during onboarding.

### 5. 🚀 Interactive Vertical Roadmap & Checklist
- 4 logical milestone phases matching target duration.
- Topic pills, actionable task checklists with real-time SQLite DB toggle sync, hands-on capstone projects, and curated learning resource links.
- Celebratory confetti effects upon completing tasks.

### 6. 📊 Real-Time Progress Dashboard
- Analytics metrics grid: Overall Progress %, Tasks Completed, Time Invested, Job Readiness Growth.
- **Next Up Task Widget** with one-click completion.
- Phase momentum progress bars & target skill mastery breakdown.

---

## 🏗️ System Architecture & Tech Stack

```text
       ┌───────────────────────────────────────────────────┐
       │             React Frontend (Vite SPA)             │
       │   Modern SaaS Dark Theme (#0B0F17) + Vanilla CSS  │
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

## 📁 Project Directory Structure

```text
├── backend/
│   ├── app.py                # Flask REST API server & static frontend host
│   ├── ai_engine.py          # Skill gap analyzer, multi-career blueprints & career explorer
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
│   │   │   ├── LandingPage.jsx      # Hero section & multi-career badges
│   │   │   ├── CareerExplorerPage.jsx # Career discovery & match rationale UI
│   │   │   ├── OnboardingPage.jsx   # Multi-career profile & resume uploader
│   │   │   ├── AnalysisPage.jsx     # Readiness gauge & skill gap breakdown
│   │   │   ├── RoadmapPage.jsx      # Vertical roadmap timeline & checklist
│   │   │   └── DashboardPage.jsx    # Progress analytics & Next Task card
│   │   ├── App.jsx                  # Main router & global state manager
│   │   ├── index.css                # SaaS dark design tokens & styles
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Clone & Setup Workspace
```bash
git clone https://github.com/prakharcodes-dev/AI-Roadmap-Generator.git
cd AI-Roadmap-Generator
```

### 2. Backend Setup
```bash
# Install Python dependencies
python -m pip install flask flask-cors pypdf google-generativeai python-dotenv

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

## 🌐 Accessing the Web Application

Once the servers are running, open your web browser:
- **Primary Application Server**: **[http://localhost:5000](http://localhost:5000)** *(Flask serves both REST API + compiled React SPA)*
- **Vite Development Server**: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | API health status check |
| `POST` | `/api/career-explorer` | Analyzes interests & strengths; returns 5 career recommendations with fit rationale |
| `POST` | `/api/resume/upload` | Parses PDF resume file and returns extracted technical skills |
| `POST` | `/api/analyze-gap` | Saves user profile, computes skill gap, and returns readiness score |
| `POST` | `/api/generate-roadmap` | Generates structured multi-phase AI roadmap tailored to target career |
| `GET` | `/api/roadmap/<user_id>` | Fetches user roadmap, phase tasks, and completion status |
| `POST` | `/api/progress/toggle` | Toggles task completion state and recalculates progress % |
| `GET` | `/api/dashboard/<user_id>` | Returns dashboard metrics, next pending task, and phase momentum stats |

---

## 🧪 Running Automated Tests

Run backend unit tests:
```bash
python backend/test_backend.py
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
