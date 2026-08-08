import json
import sqlite3
from datetime import datetime

DB_PATH = 'roadmap_generator.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
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

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")
