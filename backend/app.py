import os
import json
import uuid
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.exceptions import HTTPException, RequestEntityTooLarge
from database import init_db, get_db_connection
from resume_parser import ResumeParseError, parse_resume
from ai_engine import analyze_skill_gap, generate_roadmap, explore_careers

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='')
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173").split(",")
    if origin.strip()
]
CORS(app, resources={r"/api/*": {"origins": cors_origins}})
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure database is initialized on startup
init_db()

def read_json_object():
    if not request.is_json:
        return None
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None

def bounded_integer(data, field, default, minimum, maximum):
    value = data.get(field, default)
    if isinstance(value, bool) or not isinstance(value, (int, str)):
        raise ValueError
    parsed = int(value)
    return max(minimum, min(maximum, parsed))

@app.errorhandler(RequestEntityTooLarge)
def handle_large_request(error):
    return jsonify({"error": "The uploaded file is too large. The maximum size is 10 MB."}), 413

@app.errorhandler(HTTPException)
def handle_http_error(error):
    if request.path.startswith('/api/'):
        return jsonify({"error": error.description}), error.code
    return error

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    logger.exception("Unhandled request error")
    if request.path.startswith('/api/'):
        return jsonify({"error": "An unexpected server error occurred. Check the backend terminal for details."}), 500
    return "An unexpected server error occurred.", 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "AI Roadmap Generator API is running"}), 200

@app.route('/api/career-explorer', methods=['POST'])
def career_explorer_endpoint():
    data = read_json_object()
    if data is None:
        return jsonify({"error": "Send a JSON object in the request body."}), 400
    user_input = data.get("input_text", "")
    if not isinstance(user_input, str):
        return jsonify({"error": "input_text must be a string."}), 400
    if len(user_input) > 5000:
        return jsonify({"error": "input_text must be 5000 characters or fewer."}), 400
    if not user_input.strip():
        user_input = "mathematics, computers, problem solving"

    result = explore_careers(user_input)
    return jsonify(result), 200

@app.route('/api/resume/upload', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400

    safe_filename = secure_filename(file.filename)
    if not safe_filename:
        return jsonify({"error": "The selected PDF filename is not valid."}), 400
    filename = f"{uuid.uuid4().hex[:8]}_{safe_filename}"
    try:
        result = parse_resume(file.stream)
    except ResumeParseError as error:
        return jsonify({"error": str(error)}), 422
    result["filename"] = filename

    return jsonify(result), 200

@app.route('/api/analyze-gap', methods=['POST'])
def analyze_gap_endpoint():
    data = read_json_object()
    if data is None:
        return jsonify({"error": "Send a JSON object in the request body."}), 400

    user_id = data.get("user_id") or f"user_{uuid.uuid4().hex[:8]}"
    name = data.get("name", "User")
    experience_level = data.get("experience_level", "Intermediate")
    current_skills = data.get("current_skills", [])
    target_role = data.get("target_role", "Full-Stack Developer")

    if not isinstance(user_id, str) or not user_id.strip() or len(user_id) > 100:
        return jsonify({"error": "user_id must be a non-empty string of 100 characters or fewer."}), 400
    if not isinstance(name, str) or len(name) > 100:
        return jsonify({"error": "name must be a string of 100 characters or fewer."}), 400
    if not isinstance(experience_level, str) or experience_level not in {"Beginner", "Intermediate", "Advanced"}:
        return jsonify({"error": "experience_level must be Beginner, Intermediate, or Advanced."}), 400
    if not isinstance(target_role, str):
        return jsonify({"error": "target_role must be a string between 2 and 160 characters."}), 400
    target_role = target_role.strip()
    if len(target_role) < 2 or len(target_role) > 160:
        return jsonify({"error": "target_role must be a string between 2 and 160 characters."}), 400
    name = name.strip() or "User"
    if not isinstance(current_skills, list) or len(current_skills) > 100 or any(not isinstance(skill, str) or len(skill) > 100 for skill in current_skills):
        return jsonify({"error": "current_skills must be a list of up to 100 strings, each 100 characters or fewer."}), 400
    current_skills = list(dict.fromkeys(skill.strip() for skill in current_skills if skill.strip()))

    resume_filename = data.get("resume_filename", "")
    if not isinstance(resume_filename, str) or len(resume_filename) > 255:
        return jsonify({"error": "resume_filename must be a string of 255 characters or fewer."}), 400

    try:
        hours_per_week = bounded_integer(data, "hours_per_week", 10, 1, 80)
        duration_weeks = bounded_integer(data, "duration_weeks", 12, 2, 104)
    except (ValueError, TypeError, OverflowError):
        return jsonify({"error": "hours_per_week and duration_weeks must be whole numbers."}), 400

    # Perform analysis
    analysis_result = analyze_skill_gap(current_skills, target_role, experience_level)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Save or update user
    cursor.execute('''
        INSERT OR REPLACE INTO users (id, name, experience_level, current_skills, target_role, hours_per_week, duration_weeks, resume_filename)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id, name, experience_level, json.dumps(current_skills),
        target_role, hours_per_week, duration_weeks, resume_filename
    ))

    # Save skill gap
    gap_id = f"gap_{uuid.uuid4().hex[:8]}"
    cursor.execute('''
        INSERT OR REPLACE INTO skill_gaps (id, user_id, strong_skills, improve_skills, missing_skills, readiness_score, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        gap_id, user_id,
        json.dumps(analysis_result["strong_skills"]),
        json.dumps(analysis_result["improve_skills"]),
        json.dumps(analysis_result["missing_skills"]),
        analysis_result["readiness_score"],
        analysis_result["summary"]
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "user_id": user_id,
        "skill_gap": analysis_result
    }), 200

@app.route('/api/generate-roadmap', methods=['POST'])
def generate_roadmap_endpoint():
    data = read_json_object()
    if data is None:
        return jsonify({"error": "Send a JSON object in the request body."}), 400
    user_id = data.get("user_id")

    if not isinstance(user_id, str) or not user_id.strip() or len(user_id) > 100:
        return jsonify({"error": "user_id must be a non-empty string of 100 characters or fewer."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    user_row = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if not user_row:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    gap_row = cursor.execute('SELECT * FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (user_id,)).fetchone()
    
    user_profile = {
        "experience_level": user_row["experience_level"],
        "target_role": user_row["target_role"],
        "hours_per_week": user_row["hours_per_week"],
        "duration_weeks": user_row["duration_weeks"],
        "current_skills": json.loads(user_row["current_skills"] or "[]")
    }

    skill_gap = {}
    if gap_row:
        skill_gap = {
            "strong_skills": json.loads(gap_row["strong_skills"] or "[]"),
            "improve_skills": json.loads(gap_row["improve_skills"] or "[]"),
            "missing_skills": json.loads(gap_row["missing_skills"] or "[]"),
            "readiness_score": gap_row["readiness_score"],
            "summary": gap_row["summary"]
        }

    # Generate roadmap JSON
    roadmap_data = generate_roadmap(user_profile, skill_gap)

    roadmap_id = f"roadmap_{uuid.uuid4().hex[:8]}"
    cursor.execute('''
        INSERT INTO roadmaps (id, user_id, title, overview, total_weeks, phases_json)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        roadmap_id, user_id,
        roadmap_data.get("title", f"{user_profile['target_role']} Roadmap"),
        roadmap_data.get("overview", ""),
        roadmap_data.get("total_weeks", 12),
        json.dumps(roadmap_data.get("phases", []))
    ))

    task_progress_rows = [
        (f"tp_{uuid.uuid4().hex[:8]}", user_id, roadmap_id, phase.get("phase_id", 1), task.get("id"), task.get("title", ""), 0)
        for phase in roadmap_data.get("phases", [])
        for task in phase.get("tasks", [])
        if task.get("id")
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO task_progress (id, user_id, roadmap_id, phase_id, task_id, task_name, is_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', task_progress_rows)

    conn.commit()
    conn.close()

    return jsonify({
        "roadmap_id": roadmap_id,
        "user_id": user_id,
        "roadmap": roadmap_data
    }), 200

@app.route('/api/roadmap/<user_id>', methods=['GET'])
def get_roadmap_endpoint(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    user_row = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if not user_row:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    roadmap_row = cursor.execute('SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (user_id,)).fetchone()
    gap_row = cursor.execute('SELECT * FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (user_id,)).fetchone()
    
    if not roadmap_row:
        conn.close()
        return jsonify({"error": "No roadmap generated for user"}), 404

    roadmap_id = roadmap_row["id"]
    progress_rows = cursor.execute('SELECT task_id, is_completed FROM task_progress WHERE user_id = ? AND roadmap_id = ?', (user_id, roadmap_id)).fetchall()

    conn.close()

    completed_tasks = {row["task_id"]: bool(row["is_completed"]) for row in progress_rows}
    phases = json.loads(roadmap_row["phases_json"] or "[]")

    total_tasks_count = 0
    completed_count = 0

    for phase in phases:
        for task in phase.get("tasks", []):
            total_tasks_count += 1
            task["is_completed"] = completed_tasks.get(task["id"], False)
            if task["is_completed"]:
                completed_count += 1

    overall_progress = int(round((completed_count / total_tasks_count * 100))) if total_tasks_count > 0 else 0

    from ai_engine import calculate_roadmap_quality
    user_prof = {
        "target_role": user_row["target_role"],
        "duration_weeks": user_row["duration_weeks"],
        "hours_per_week": user_row["hours_per_week"],
        "experience_level": user_row["experience_level"]
    }
    sg_missing = json.loads(gap_row["missing_skills"] or "[]") if gap_row else []
    sg_strong = json.loads(gap_row["strong_skills"] or "[]") if gap_row else []
    quality_score = calculate_roadmap_quality(user_row["target_role"], phases, sg_missing, sg_strong)

    return jsonify({
        "roadmap_id": roadmap_id,
        "user_id": user_id,
        "user_profile": {
            "name": user_row["name"],
            "experience_level": user_row["experience_level"],
            "target_role": user_row["target_role"],
            "hours_per_week": user_row["hours_per_week"],
            "duration_weeks": user_row["duration_weeks"],
            "current_skills": json.loads(user_row["current_skills"] or "[]")
        },
        "skill_gap": {
            "strong_skills": sg_strong,
            "improve_skills": json.loads(gap_row["improve_skills"] or "[]") if gap_row else [],
            "missing_skills": sg_missing,
            "readiness_score": gap_row["readiness_score"] if gap_row else 50,
            "summary": gap_row["summary"] if gap_row else ""
        },
        "roadmap": {
            "title": roadmap_row["title"],
            "overview": roadmap_row["overview"],
            "total_weeks": roadmap_row["total_weeks"],
            "quality_score": quality_score,
            "phases": phases
        },
        "stats": {
            "total_tasks": total_tasks_count,
            "completed_tasks": completed_count,
            "overall_progress": overall_progress
        }
    }), 200

@app.route('/api/progress/toggle', methods=['POST'])
def toggle_progress_endpoint():
    data = read_json_object()
    if data is None:
        return jsonify({"error": "Send a JSON object in the request body."}), 400
    user_id = data.get("user_id")
    roadmap_id = data.get("roadmap_id")
    task_id = data.get("task_id")
    completed_value = data.get("is_completed", False)

    if not all(isinstance(value, str) and value.strip() and len(value) <= 100 for value in (user_id, roadmap_id, task_id)):
        return jsonify({"error": "user_id, roadmap_id, and task_id must be non-empty strings of 100 characters or fewer."}), 400
    if not isinstance(completed_value, (bool, int)) or completed_value not in (False, True, 0, 1):
        return jsonify({"error": "is_completed must be a boolean."}), 400
    is_completed = 1 if completed_value else 0

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE task_progress
        SET is_completed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND roadmap_id = ? AND task_id = ?
    ''', (is_completed, user_id, roadmap_id, task_id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"error": "The requested roadmap task was not found."}), 404

    stats_row = cursor.execute(
        'SELECT COUNT(*) AS total_tasks, COALESCE(SUM(is_completed), 0) AS completed_tasks FROM task_progress WHERE user_id = ? AND roadmap_id = ?',
        (user_id, roadmap_id)
    ).fetchone()
    conn.commit()
    conn.close()

    total_tasks = stats_row["total_tasks"]
    completed_tasks = stats_row["completed_tasks"]
    overall_progress = int(round((completed_tasks / total_tasks * 100))) if total_tasks > 0 else 0

    return jsonify({
        "status": "success",
        "task_id": task_id,
        "is_completed": bool(is_completed),
        "stats": {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "overall_progress": overall_progress
        }
    }), 200

@app.route('/api/dashboard/<user_id>', methods=['GET'])
def get_dashboard_endpoint(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    user_row = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if not user_row:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    roadmap_row = cursor.execute('SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (user_id,)).fetchone()
    gap_row = cursor.execute('SELECT * FROM skill_gaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', (user_id,)).fetchone()

    if not roadmap_row:
        conn.close()
        return jsonify({"error": "No roadmap found for user"}), 404

    roadmap_id = roadmap_row["id"]
    progress_rows = cursor.execute('SELECT task_id, phase_id, task_name, is_completed FROM task_progress WHERE user_id = ? AND roadmap_id = ?', (user_id, roadmap_id)).fetchall()
    conn.close()

    completed_map = {row["task_id"]: bool(row["is_completed"]) for row in progress_rows}
    phases = json.loads(roadmap_row["phases_json"] or "[]")

    total_tasks = 0
    completed_tasks = 0
    next_task = None
    phase_stats = []

    for phase in phases:
        p_total = 0
        p_completed = 0
        for task in phase.get("tasks", []):
            total_tasks += 1
            p_total += 1
            is_done = completed_map.get(task["id"], False)
            if is_done:
                completed_tasks += 1
                p_completed += 1
            elif next_task is None:
                next_task = {
                    "task_id": task["id"],
                    "phase_id": phase["phase_id"],
                    "phase_title": phase["title"],
                    "title": task["title"],
                    "description": task["description"]
                }
        
        p_progress = int(round((p_completed / p_total * 100))) if p_total > 0 else 0
        phase_stats.append({
            "phase_id": phase["phase_id"],
            "title": phase["title"],
            "duration": phase["duration"],
            "total_tasks": p_total,
            "completed_tasks": p_completed,
            "progress_percent": p_progress
        })

    overall_progress = int(round((completed_tasks / total_tasks * 100))) if total_tasks > 0 else 0
    hours_per_week = user_row["hours_per_week"]
    estimated_hours_spent = int(round((completed_tasks / max(1, total_tasks)) * (hours_per_week * user_row["duration_weeks"])))

    readiness_score = gap_row["readiness_score"] if gap_row else 50
    # Dynamic updated readiness based on progress
    current_readiness = min(99, readiness_score + int(round((100 - readiness_score) * (overall_progress / 100))))

    return jsonify({
        "user_id": user_id,
        "user_profile": {
            "name": user_row["name"],
            "target_role": user_row["target_role"],
            "experience_level": user_row["experience_level"],
            "hours_per_week": user_row["hours_per_week"],
            "duration_weeks": user_row["duration_weeks"]
        },
        "overview": {
            "overall_progress": overall_progress,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "hours_spent": estimated_hours_spent,
            "initial_readiness": readiness_score,
            "current_readiness": current_readiness
        },
        "next_task": next_task,
        "phase_stats": phase_stats,
        "skill_breakdown": {
            "strong": json.loads(gap_row["strong_skills"] or "[]") if gap_row else [],
            "improve": json.loads(gap_row["improve_skills"] or "[]") if gap_row else [],
            "missing": json.loads(gap_row["missing_skills"] or "[]") if gap_row else []
        }
    }), 200

# Catch-all route to serve Frontend Single Page Application
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found."}), 404
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Serving frontend from: {FRONTEND_DIST}")
    print(f"Starting AI Roadmap Generator Flask API on http://0.0.0.0:{port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
