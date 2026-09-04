import os
import json
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from database import init_db, get_db_connection
from resume_parser import parse_resume
from ai_engine import analyze_skill_gap, generate_roadmap, explore_careers

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='')
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure database is initialized on startup
init_db()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "AI Roadmap Generator API is running"}), 200

@app.route('/api/career-explorer', methods=['POST'])
def career_explorer_endpoint():
    data = request.json or {}
    user_input = data.get("input_text", "")
    
    if not (user_input.strip() if isinstance(user_input, str) else ""):
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

    filename = secure_filename(f"{uuid.uuid4().hex[:8]}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    result = parse_resume(filepath)
    result["filename"] = filename

    return jsonify(result), 200

@app.route('/api/analyze-gap', methods=['POST'])
def analyze_gap_endpoint():
    data = request.json or {}

    user_id = data.get("user_id", f"user_{uuid.uuid4().hex[:8]}")
    name = data.get("name", "User")
    experience_level = data.get("experience_level", "Intermediate")
    current_skills = data.get("current_skills", [])
    target_role = data.get("target_role", "Full-Stack Developer")
    hours_per_week = int(data.get("hours_per_week", 10))
    duration_weeks = int(data.get("duration_weeks", 12))
    resume_filename = data.get("resume_filename", "")

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
    data = request.json or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

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

    # Initialize Task Progress items
    for phase in roadmap_data.get("phases", []):
        phase_id = phase.get("phase_id", 1)
        for task in phase.get("tasks", []):
            task_id = task.get("id")
            task_name = task.get("title", "")
            if task_id:
                cursor.execute('''
                    INSERT OR IGNORE INTO task_progress (id, user_id, roadmap_id, phase_id, task_id, task_name, is_completed)
                    VALUES (?, ?, ?, ?, ?, ?, 0)
                ''', (f"tp_{uuid.uuid4().hex[:8]}", user_id, roadmap_id, phase_id, task_id, task_name))

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
    data = request.json or {}
    user_id = data.get("user_id")
    roadmap_id = data.get("roadmap_id")
    task_id = data.get("task_id")
    is_completed = 1 if data.get("is_completed") else 0

    if not user_id or not roadmap_id or not task_id:
        return jsonify({"error": "user_id, roadmap_id, and task_id are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE task_progress
        SET is_completed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND roadmap_id = ? AND task_id = ?
    ''', (is_completed, user_id, roadmap_id, task_id))

    # Recalculate stats
    progress_rows = cursor.execute('SELECT is_completed FROM task_progress WHERE user_id = ? AND roadmap_id = ?', (user_id, roadmap_id)).fetchall()
    conn.commit()
    conn.close()

    total_tasks = len(progress_rows)
    completed_tasks = sum(1 for row in progress_rows if row["is_completed"])
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
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Serving frontend from: {FRONTEND_DIST}")
    print(f"Starting AI Roadmap Generator Flask API on http://0.0.0.0:{port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
