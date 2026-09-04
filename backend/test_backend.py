import unittest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app import app
from database import init_db
from ai_engine import analyze_skill_gap, generate_roadmap, explore_careers

class QualityScoreAndSkillSkippingTestCase(unittest.TestCase):

    def setUp(self):
        init_db()
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_skill_skipping_logic(self):
        profile = {
            "target_role": "AI Engineer",
            "duration_weeks": 12,
            "hours_per_week": 10,
            "experience_level": "Intermediate"
        }
        gap = {
            "strong_skills": ["Python", "Git", "SQL", "Basic ML"],
            "missing_skills": ["Deep Learning", "Transformers", "RAG"],
            "improve_skills": []
        }
        roadmap = generate_roadmap(profile, gap)
        
        # Verify Quality Score is present
        self.assertIn("quality_score", roadmap)
        qs = roadmap["quality_score"]
        self.assertIn("overall", qs)
        self.assertIn("goal_alignment", qs)
        self.assertIn("difficulty_flow", qs)
        self.assertIn("prerequisites", qs)
        self.assertIn("practical_value", qs)
        self.assertGreaterEqual(qs["overall"], 80)

        # Verify already known skills (Python, Git, SQL) are SKIPPED from phase topics
        all_topics = []
        for p in roadmap["phases"]:
            all_topics.extend([t.lower() for t in p.get("topics", [])])

        self.assertNotIn("git", all_topics)
        self.assertNotIn("sql", all_topics)

    def test_end_to_end_roadmap_quality_api(self):
        gap_resp = self.client.post('/api/analyze-gap', json={
            "name": "Alex",
            "experience_level": "Intermediate",
            "current_skills": ["Python", "Git"],
            "target_role": "AI / ML Engineer",
            "hours_per_week": 12,
            "duration_weeks": 12
        })
        self.assertEqual(gap_resp.status_code, 200)
        user_id = json.loads(gap_resp.data)["user_id"]

        rm_resp = self.client.post('/api/generate-roadmap', json={"user_id": user_id})
        self.assertEqual(rm_resp.status_code, 200)
        rm_data = json.loads(rm_resp.data)["roadmap"]
        
        self.assertIn("quality_score", rm_data)
        self.assertGreaterEqual(rm_data["quality_score"]["overall"], 75)

if __name__ == '__main__':
    unittest.main()
