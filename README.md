# Run PathAI locally

PathAI is a React website with a Flask API and a local SQLite database. Start the backend and frontend in two separate terminals.

## Required software

- Python 3.10 or newer
- Node.js 20.19 or newer, or 22.12 or newer. npm is included with Node.js.

## First-time setup

Open PowerShell in the project root: `D:\ROADMAP GENRATOR`.

Create the Python environment and install backend packages:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

Install frontend packages once:

```powershell
npm --prefix frontend install
```

You do not need a `.env` file to run the current local skill analysis and roadmap generation. The current backend does not make Gemini model-generation calls, so `GEMINI_API_KEY` does not enable those calls.

## Run the backend

In Terminal 1, from the project root, run:

```powershell
.\.venv\Scripts\python.exe -m flask --app backend/app.py run --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open. The backend API is at `http://127.0.0.1:8000`.

## Run the frontend

In Terminal 2, also from the project root, run:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

This starts Vite from the `frontend` directory. API requests use the Vite proxy to reach the backend on port 8000.

## Open the application

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

The backend health endpoint is [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health).

## Troubleshooting

- If `.venv\Scripts\python.exe` is missing, run the Python environment setup commands again from the project root.
- If Flask reports a missing package, run `.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt`.
- If Vite packages are missing, run `npm --prefix frontend install`.
- If port 8000 or 5173 is already in use, close the other application using that port, then restart the affected service.
- If the frontend cannot reach the API, keep both terminals open and check that Flask is running on port 8000.

## Stop the application

Press **Ctrl+C** in each terminal to stop the frontend and backend.
