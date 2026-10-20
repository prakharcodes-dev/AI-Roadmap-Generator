import unittest
import json
import os
import sys
import tempfile
from io import BytesIO

sys.path.insert(0, os.path.dirname(__file__))

from app import app
import database
from database import init_db
from ai_engine import analyze_skill_gap, generate_roadmap, explore_careers

def make_text_pdf(text):
    escaped = text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
    stream = f"BT /F1 12 Tf 72 720 Td ({escaped}) Tj ET".encode("ascii")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    ]
    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, body in enumerate(objects, 1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode("ascii") + body + b"\nendobj\n")
    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode("ascii"))
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF".encode("ascii"))
    return bytes(pdf)

class QualityScoreAndSkillSkippingTestCase(unittest.TestCase):

    def setUp(self):
        self.previous_db_path = database.DB_PATH
        self.temp_dir = tempfile.TemporaryDirectory(dir=os.path.dirname(__file__))
        database.DB_PATH = os.path.join(self.temp_dir.name, "test.db")
        init_db()
        app.config['TESTING'] = True
        self.client = app.test_client()

    def tearDown(self):
        database.DB_PATH = self.previous_db_path
        self.temp_dir.cleanup()

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

    def test_health_and_invalid_request_responses(self):
        health = self.client.get('/api/health')
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.get_json()["status"], "ok")
        invalid_json = self.client.post('/api/analyze-gap', data="not json", content_type="text/plain")
        self.assertEqual(invalid_json.status_code, 400)
        self.assertIn("error", invalid_json.get_json())
        invalid_skills = self.client.post('/api/analyze-gap', json={"current_skills": "Python"})
        self.assertEqual(invalid_skills.status_code, 400)
        invalid_duration = self.client.post('/api/analyze-gap', json={"duration_weeks": 12.5})
        self.assertEqual(invalid_duration.status_code, 400)
        missing_user = self.client.post('/api/generate-roadmap', json={})
        self.assertEqual(missing_user.status_code, 400)
        unknown_api = self.client.get('/api/unknown')
        self.assertEqual(unknown_api.status_code, 404)
        self.assertEqual(unknown_api.mimetype, "application/json")
        preflight = self.client.options('/api/analyze-gap', headers={
            "Origin": "http://127.0.0.1:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        })
        self.assertIn("Access-Control-Allow-Origin", preflight.headers)
        rejected_origin = self.client.options('/api/analyze-gap', headers={
            "Origin": "https://example.invalid",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        })
        self.assertNotIn("Access-Control-Allow-Origin", rejected_origin.headers)

    def test_resume_upload_validation_and_text_extraction(self):
        existing_files = set(os.listdir(app.config['UPLOAD_FOLDER']))
        unsupported = self.client.post('/api/resume/upload', data={
            "resume": (BytesIO(b"not a pdf"), "resume.txt")
        }, content_type="multipart/form-data")
        self.assertEqual(unsupported.status_code, 400)

        malformed = self.client.post('/api/resume/upload', data={
            "resume": (BytesIO(b"not a pdf"), "resume.pdf")
        }, content_type="multipart/form-data")
        self.assertEqual(malformed.status_code, 422)
        self.assertIn("error", malformed.get_json())

        empty_text = self.client.post('/api/resume/upload', data={
            "resume": (BytesIO(make_text_pdf("")), "empty.pdf")
        }, content_type="multipart/form-data")
        self.assertEqual(empty_text.status_code, 422)

        oversized = self.client.post('/api/resume/upload', data={
            "resume": (BytesIO(b"0" * (10 * 1024 * 1024 + 1)), "large.pdf")
        }, content_type="multipart/form-data")
        self.assertEqual(oversized.status_code, 413)
        self.assertEqual(oversized.mimetype, "application/json")

        uploaded = self.client.post('/api/resume/upload', data={
            "resume": (BytesIO(make_text_pdf("Python React SQL")), "resume.pdf")
        }, content_type="multipart/form-data")
        self.assertEqual(uploaded.status_code, 200)
        result = uploaded.get_json()
        self.assertEqual(result["skill_count"], 3)
        self.assertEqual(result["extracted_skills"], ["Python", "React", "SQL"])
        self.assertTrue(result["filename"].endswith("_resume.pdf"))
        self.assertEqual(set(os.listdir(app.config['UPLOAD_FOLDER'])), existing_files)

    def test_full_persistence_progress_and_explorer_flow(self):
        analysis = self.client.post('/api/analyze-gap', json={
            "name": "Alex",
            "experience_level": "Intermediate",
            "current_skills": ["Python", "Git"],
            "target_role": "AI / ML Engineer",
            "hours_per_week": 12,
            "duration_weeks": 12
        })
        self.assertEqual(analysis.status_code, 200)
        user_id = analysis.get_json()["user_id"]

        generated = self.client.post('/api/generate-roadmap', json={"user_id": user_id})
        self.assertEqual(generated.status_code, 200)
        roadmap_response = generated.get_json()
        roadmap_id = roadmap_response["roadmap_id"]
        task_id = roadmap_response["roadmap"]["phases"][0]["tasks"][0]["id"]

        roadmap = self.client.get(f'/api/roadmap/{user_id}')
        self.assertEqual(roadmap.status_code, 200)
        self.assertEqual(roadmap.get_json()["roadmap_id"], roadmap_id)

        toggle = self.client.post('/api/progress/toggle', json={
            "user_id": user_id,
            "roadmap_id": roadmap_id,
            "task_id": task_id,
            "is_completed": True
        })
        self.assertEqual(toggle.status_code, 200)
        self.assertEqual(toggle.get_json()["stats"]["completed_tasks"], 1)
        invalid_toggle = self.client.post('/api/progress/toggle', json={
            "user_id": user_id,
            "roadmap_id": roadmap_id,
            "task_id": task_id,
            "is_completed": "false"
        })
        self.assertEqual(invalid_toggle.status_code, 400)
        missing_task = self.client.post('/api/progress/toggle', json={
            "user_id": user_id,
            "roadmap_id": roadmap_id,
            "task_id": "missing-task",
            "is_completed": False
        })
        self.assertEqual(missing_task.status_code, 404)

        dashboard = self.client.get(f'/api/dashboard/{user_id}')
        self.assertEqual(dashboard.status_code, 200)
        self.assertEqual(dashboard.get_json()["overview"]["completed_tasks"], 1)

        careers = self.client.post('/api/career-explorer', json={"input_text": "mathematics and statistics"})
        self.assertEqual(careers.status_code, 200)
        self.assertEqual(len(careers.get_json()["recommendations"]), 5)

if __name__ == '__main__':
    unittest.main()
