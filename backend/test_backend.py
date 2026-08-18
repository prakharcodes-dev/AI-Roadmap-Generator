import unittest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app import app
from database import init_db
from ai_engine import analyze_skill_gap, generate_roadmap, explore_careers

class MultiCareerTestCase(unittest.TestCase):

    def setUp(self):
        init_db()
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_career_explorer_logic(self):
        res = explore_careers("I like mathematics, computers and problem solving.")
        self.assertIn("recommendations", res)
        self.assertGreater(len(res["recommendations"]), 0)
        roles = [r["role"] for r in res["recommendations"]]
        self.assertTrue(any("Data" in r or "Software" in r or "Quant" in r for r in roles))
        # Ensure rationale is present
        self.assertTrue("why" in res["recommendations"][0])

    def test_multi_career_ca_roadmap(self):
        profile = {"target_role": "Chartered Accountant (CA)", "duration_weeks": 16, "hours_per_week": 15, "experience_level": "Beginner"}
        gap = analyze_skill_gap(["Accounting Standards", "Basic Taxation"], "Chartered Accountant (CA)", "Beginner")
        rm = generate_roadmap(profile, gap)
        self.assertEqual(len(rm["phases"]), 4)
        # Check CA specific structure terms
        titles = " ".join([p["title"] for p in rm["phases"]])
        self.assertTrue("Foundation" in titles or "Articleship" in titles or "Final" in titles)

    def test_multi_career_law_roadmap(self):
        profile = {"target_role": "Corporate Lawyer", "duration_weeks": 12, "hours_per_week": 10, "experience_level": "Intermediate"}
        gap = analyze_skill_gap(["Constitutional Law"], "Corporate Lawyer", "Intermediate")
        rm = generate_roadmap(profile, gap)
        self.assertEqual(len(rm["phases"]), 4)
        titles = " ".join([p["title"] for p in rm["phases"]])
        self.assertTrue("Legal" in titles or "Bar" in titles or "Courtroom" in titles or "Statutory" in titles)

    def test_career_explorer_api_endpoint(self):
        resp = self.client.post('/api/career-explorer', json={"input_text": "I enjoy physics, building structures, and mathematics"})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertIn("recommendations", data)

if __name__ == '__main__':
    unittest.main()
