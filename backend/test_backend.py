import unittest
import json
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from database import init_db
from ai_engine import analyze_skill_gap, generate_roadmap

class BackendTestCase(unittest.TestCase):

    def setUp(self):
        init_db()
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_health_check(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "ok")

    def test_analyze_skill_gap_logic(self):
        result = analyze_skill_gap(
            current_skills=["HTML", "CSS", "JavaScript", "React"],
            target_role="Full-Stack Developer",
            experience_level="Intermediate"
        )
        self.assertIn("strong_skills", result)
        self.assertIn("missing_skills", result)
        self.assertGreater(result["readiness_score"], 0)
        self.assertLessEqual(result["readiness_score"], 100)

    def test_generate_roadmap_logic(self):
        profile = {
            "target_role": "Frontend Developer",
            "duration_weeks": 8,
            "hours_per_week": 15,
            "experience_level": "Beginner"
        }
        gap = {
            "missing_skills": ["TypeScript", "Next.js", "Redux"],
            "improve_skills": ["CSS", "React"],
            "strong_skills": ["HTML", "JavaScript"]
        }
        roadmap = generate_roadmap(profile, gap)
        self.assertEqual(len(roadmap["phases"]), 4)
        self.assertEqual(roadmap["total_weeks"], 8)

    def test_end_to_end_flow(self):
        # 1. Analyze gap
        gap_resp = self.client.post('/api/analyze-gap', json={
            "name": "Test Alex",
            "experience_level": "Intermediate",
            "current_skills": ["Python", "Flask", "SQL"],
            "target_role": "Backend Developer",
            "hours_per_week": 12,
            "duration_weeks": 10
        })
        self.assertEqual(gap_resp.status_code, 200)
        gap_data = json.loads(gap_resp.data)
        user_id = gap_data["user_id"]

        # 2. Generate roadmap
        rm_resp = self.client.post('/api/generate-roadmap', json={"user_id": user_id})
        self.assertEqual(rm_resp.status_code, 200)
        rm_data = json.loads(rm_resp.data)
        roadmap_id = rm_data["roadmap_id"]

        # 3. Get roadmap
        get_rm = self.client.get(f'/api/roadmap/{user_id}')
        self.assertEqual(get_rm.status_code, 200)

        # 4. Toggle progress
        task_id = rm_data["roadmap"]["phases"][0]["tasks"][0]["id"]
        prog_resp = self.client.post('/api/progress/toggle', json={
            "user_id": user_id,
            "roadmap_id": roadmap_id,
            "task_id": task_id,
            "is_completed": True
        })
        self.assertEqual(prog_resp.status_code, 200)

        # 5. Fetch dashboard
        dash_resp = self.client.get(f'/api/dashboard/{user_id}')
        self.assertEqual(dash_resp.status_code, 200)
        dash_data = json.loads(dash_resp.data)
        self.assertGreater(dash_data["overview"]["completed_tasks"], 0)

if __name__ == '__main__':
    unittest.main()
