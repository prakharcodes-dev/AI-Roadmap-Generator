import json
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'roadmap_generator.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # User Profile table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            experience_level TEXT,
            current_skills TEXT,
            target_role TEXT,
            hours_per_week INTEGER,
            duration_weeks INTEGER,
            resume_filename TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Skill Gap Analysis table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS skill_gaps (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            strong_skills TEXT,
            improve_skills TEXT,
            missing_skills TEXT,
            readiness_score INTEGER,
            summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Roadmap table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT,
            overview TEXT,
            total_weeks INTEGER,
            phases_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Task Progress table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS task_progress (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            roadmap_id TEXT,
            phase_id INTEGER,
            task_id TEXT,
            task_name TEXT,
            is_completed INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, roadmap_id, task_id)
        )
    ''')

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_skill_gaps_user_created ON skill_gaps(user_id, created_at DESC)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_roadmaps_user_created ON roadmaps(user_id, created_at DESC)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_task_progress_user_roadmap ON task_progress(user_id, roadmap_id)')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")
