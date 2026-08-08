import os
import json
import uuid
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Baseline skill requirements for popular tech roles
ROLE_REQUIREMENTS = {
    "Full-Stack Developer": [
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express",
        "REST API", "PostgreSQL", "MongoDB", "Git", "Docker", "CI/CD", "Testing"
    ],
    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS",
        "Redux", "REST API", "GraphQL", "Vite", "Performance Optimization", "Accessibility (a11y)", "Git"
    ],
    "Backend Developer": [
        "Python", "Node.js", "Django", "Flask", "FastAPI", "SQL", "PostgreSQL",
        "Redis", "REST API", "Microservices", "Docker", "Kubernetes", "Git", "Security"
    ],
    "AI / ML Engineer": [
        "Python", "Math & Statistics", "Data Analysis", "NumPy", "Pandas",
        "Scikit-Learn", "PyTorch", "TensorFlow", "Deep Learning", "NLP",
        "LLMs", "LangChain", "Model Deployment", "Docker", "Git"
    ],
    "DevOps Engineer": [
        "Linux", "Bash", "Python", "Docker", "Kubernetes", "AWS", "CI/CD",
        "Terraform", "Ansible", "Monitoring (Prometheus/Grafana)", "Networking", "Git", "Security"
    ],
    "Data Engineer": [
        "Python", "SQL", "PostgreSQL", "Apache Spark", "Airflow", "Kafka",
        "Data Warehousing (BigQuery/Snowflake)", "Docker", "Git", "ETL Pipelines"
    ]
}

def analyze_skill_gap(current_skills, target_role, experience_level):
    """Calculate skill gap analysis: Strong, To Improve, Missing, Readiness %."""
    current_set = set(s.strip() for s in current_skills if s.strip())
    
    # Match role requirements or fallback to general tech baseline
    req_skills = ROLE_REQUIREMENTS.get(target_role, [
        "Core Fundamentals", "Language Proficiency", "Web APIs", "Databases", "Version Control (Git)",
        "System Design", "Testing", "Deployment & CI/CD"
    ])

    req_set = set(req_skills)

    strong = []
    improve = []
    missing = []

    for req in req_skills:
        req_lower = req.lower()
        matched = False
        for curr in current_set:
            if curr.lower() == req_lower:
                matched = True
                break
            elif curr.lower() in req_lower or req_lower in curr.lower():
                matched = "partial"
                break
        
        if matched is True:
            strong.append(req)
        elif matched == "partial":
            improve.append(req)
        else:
            missing.append(req)

    # Any extra current skills not directly required are added to strong
    for curr in current_skills:
        if curr not in strong and curr not in improve and curr not in missing:
            strong.append(curr)

    total_reqs = len(req_skills)
    matched_score = len(strong) * 1.0 + len(improve) * 0.5
    readiness_score = int(min(98, max(15, round((matched_score / total_reqs) * 100))))
    
    # Adjust by experience level
    if experience_level == "Beginner" and readiness_score > 60:
        readiness_score = max(40, readiness_score - 15)
    elif experience_level == "Advanced" and readiness_score < 80:
        readiness_score = min(92, readiness_score + 15)

    summary = (
        f"Based on your current skill set and target role as a {target_role}, "
        f"you are currently estimated at {readiness_score}% job readiness. "
        f"You possess strong foundations in {', '.join(strong[:3]) if strong else 'basic tools'}, "
        f"and focusing on missing core areas like {', '.join(missing[:3]) if missing else 'advanced concepts'} "
        f"will rapidly elevate your portfolio."
    )

    return {
        "strong_skills": strong,
        "improve_skills": improve,
        "missing_skills": missing,
        "readiness_score": readiness_score,
        "summary": summary
    }

def generate_roadmap(user_profile, skill_gap):
    """Generate a structured multi-phase learning roadmap."""
    target_role = user_profile.get("target_role", "Software Engineer")
    duration_weeks = user_profile.get("duration_weeks", 12)
    hours_per_week = user_profile.get("hours_per_week", 10)
    exp_level = user_profile.get("experience_level", "Intermediate")
    missing_skills = skill_gap.get("missing_skills", [])
    improve_skills = skill_gap.get("improve_skills", [])
    strong_skills = skill_gap.get("strong_skills", [])

    # Try Gemini LLM if key is configured
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
You are an expert tech career mentor. Generate a detailed, highly actionable, personalized learning roadmap for a user aiming to become a {target_role}.

User Context:
- Experience Level: {exp_level}
- Hours Available Per Week: {hours_per_week} hours
- Target Duration: {duration_weeks} weeks
- Strong Skills: {', '.join(strong_skills)}
- Skills to Improve: {', '.join(improve_skills)}
- Missing Skills to Master: {', '.join(missing_skills)}

Return ONLY a valid JSON object matching this EXACT schema:
{{
  "title": "{target_role} Mastery Roadmap",
  "overview": "High-level strategic plan tailored to your profile...",
  "total_weeks": {duration_weeks},
  "phases": [
    {{
      "phase_id": 1,
      "title": "Phase 1 Title",
      "duration": "Weeks 1-3 (3 Weeks)",
      "focus": "Core focus of this phase",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "tasks": [
        {{"id": "p1_t1", "title": "Task title", "description": "Short action item"}},
        {{"id": "p1_t2", "title": "Task title 2", "description": "Short action item"}}
      ],
      "project": {{
        "title": "Hands-on Project Name",
        "description": "Clear description of real-world mini project",
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      }},
      "resources": [
        {{"name": "Resource Title", "type": "Documentation/Course", "url": "https://example.com"}}
      ]
    }}
  ]
}}
Ensure exactly 4 logical phases spanning the requested total duration ({duration_weeks} weeks).
Do NOT include markdown formatting backticks outside the JSON.
"""
            response = model.generate_content(prompt)
            clean_text = response.text.strip()
            if clean_text.startswith("```"):
                clean_text = clean_text.split("```")[1]
                if clean_text.startswith("json"):
                    clean_text = clean_text[4:]
            
            roadmap_json = json.loads(clean_text)
            return roadmap_json
        except Exception as e:
            print(f"Gemini generation fallback due to: {e}")

    # Deterministic Heuristic AI Generator (Fallback)
    p1_weeks = max(1, round(duration_weeks * 0.25))
    p2_weeks = max(1, round(duration_weeks * 0.35))
    p3_weeks = max(1, round(duration_weeks * 0.25))
    p4_weeks = max(1, duration_weeks - (p1_weeks + p2_weeks + p3_weeks))

    primary_focus = missing_skills[:2] if missing_skills else ["Core Architecture", "Advanced Tools"]
    secondary_focus = missing_skills[2:5] if len(missing_skills) > 2 else ["Best Practices", "Testing & Performance"]

    phases = [
        {
            "phase_id": 1,
            "title": f"Foundations & Essential Prerequisites",
            "duration": f"Weeks 1-{p1_weeks} ({p1_weeks} {'Week' if p1_weeks == 1 else 'Weeks'})",
            "focus": f"Strengthen core fundamentals in {', '.join(strong_skills[:2]) if strong_skills else 'programming'} and bridge initial gaps.",
            "topics": [
                f"Core Principles of {target_role}",
                f"Modern Setup & Workflow Optimization",
                f"Fundamentals of {improve_skills[0] if improve_skills else 'Version Control & CLI'}"
            ],
            "tasks": [
                {"id": "p1_t1", "title": "Setup local development environment", "description": "Configure IDE, version control git, and essential linting tools."},
                {"id": "p1_t2", "title": f"Build foundation exercise in {improve_skills[0] if improve_skills else 'Core Language'}", "description": "Complete 5 hands-on practice problems targeting foundational concepts."},
                {"id": "p1_t3", "title": "Implement clean code patterns", "description": "Refactor initial script to follow industry standard code style."}
            ],
            "project": {
                "title": f"{target_role} Utility Starter",
                "description": f"Build a practical baseline application utilizing {strong_skills[0] if strong_skills else 'core skills'} demonstrating solid architecture.",
                "deliverables": ["Clean Git repository with documentation", "Functional core feature", "Unit test suite"]
            },
            "resources": [
                {"name": "Official Documentation", "type": "Documentation", "url": "https://developer.mozilla.org/"},
                {"name": "Interactive Fundamentals Guide", "type": "Interactive Course", "url": "https://freecodecamp.org"}
            ]
        },
        {
            "phase_id": 2,
            "title": f"Core Skill Gaps Mastery",
            "duration": f"Weeks {p1_weeks+1}-{p1_weeks+p2_weeks} ({p2_weeks} Weeks)",
            "focus": f"Deep dive into critical missing competencies: {', '.join(primary_focus)}.",
            "topics": [
                f"In-depth {primary_focus[0]} Implementation",
                f"Integration of {primary_focus[1] if len(primary_focus) > 1 else 'Data Layer & APIs'}",
                "State Management & System Architecture"
            ],
            "tasks": [
                {"id": "p2_t1", "title": f"Master key concepts of {primary_focus[0]}", "description": "Study core architecture and implement 3 mini-modules."},
                {"id": "p2_t2", "title": "API & Data integration", "description": "Design and consume REST/GraphQL endpoints with error handling."},
                {"id": "p2_t3", "title": "State & Data Persistence", "description": "Connect application logic to SQLite/PostgreSQL persistent store."}
            ],
            "project": {
                "title": f"Full-Feature {target_role} Module",
                "description": f"Develop an end-to-end service/app combining {primary_focus[0]} with real-time data.",
                "deliverables": ["Working application", "RESTful API / Interface integration", "Database migrations & seed script"]
            },
            "resources": [
                {"name": f"{primary_focus[0]} Deep Dive Guide", "type": "Tutorial", "url": "https://dev.to"},
                {"name": "Modern System Patterns", "type": "Guide", "url": "https://roadmap.sh"}
            ]
        },
        {
            "phase_id": 3,
            "title": "Advanced Engineering & Production Optimization",
            "duration": f"Weeks {p1_weeks+p2_weeks+1}-{p1_weeks+p2_weeks+p3_weeks} ({p3_weeks} Weeks)",
            "focus": f"Elevate code quality, testing, performance, and deployment automation.",
            "topics": [
                f"Advanced {secondary_focus[0] if secondary_focus else 'Optimization'}",
                "Automated Testing (Unit, Integration, End-to-End)",
                "CI/CD Pipelines & Containerization (Docker)"
            ],
            "tasks": [
                {"id": "p3_t1", "title": "Containerize application with Docker", "description": "Write multi-stage Dockerfile and docker-compose configuration."},
                {"id": "p3_t2", "title": "Build automated CI/CD pipeline", "description": "Configure GitHub Actions workflow for linting, testing, and building."},
                {"id": "p3_t3", "title": "Performance benchmarking & audit", "description": "Optimize response latency, memory footprint, and rendering pipeline."}
            ],
            "project": {
                "title": "Production Ready SaaS Feature",
                "description": "Deploy a containerized production application with full CI/CD automation and analytics.",
                "deliverables": ["Container image artifact", "Passing CI/CD pipeline", "Performance audit report"]
            },
            "resources": [
                {"name": "Docker & DevOps Handbook", "type": "Documentation", "url": "https://docs.docker.com"},
                {"name": "Production Deployment Guide", "type": "Course", "url": "https://coursera.org"}
            ]
        },
        {
            "phase_id": 4,
            "title": "Capstone Portfolio & Interview Readiness",
            "duration": f"Weeks {p1_weeks+p2_weeks+p3_weeks+1}-{duration_weeks} ({p4_weeks} {'Week' if p4_weeks == 1 else 'Weeks'})",
            "focus": f"Build flagship Capstone Project for {target_role} position and polish technical interview readiness.",
            "topics": [
                f"Flagship Capstone System Design",
                "System Architecture & Security Audit",
                "Technical Interview Preparation & Behavioral Polish"
            ],
            "tasks": [
                {"id": "p4_t1", "title": "Complete Flagship Capstone Application", "description": "Integrate all phase learnings into a comprehensive portfolio project."},
                {"id": "p4_t2", "title": "Publish live demo & README documentation", "description": "Deploy to Vercel/Render/AWS with architecture diagrams and live demo link."},
                {"id": "p4_t3", "title": "Mock Technical Interview Practice", "description": "Practice system design questions and algorithm problem solving."}
            ],
            "project": {
                "title": f"Flagship {target_role} Capstone System",
                "description": f"Comprehensive enterprise-grade application showcasing complete mastery of {target_role} requirements.",
                "deliverables": ["Live public deployment link", "Comprehensive GitHub Repository", "Architecture diagram & documentation"]
            },
            "resources": [
                {"name": "System Design Primer", "type": "GitHub Repo", "url": "https://github.com/donnemartin/system-design-primer"},
                {"name": "Tech Interview Handbook", "type": "Guide", "url": "https://techinterviewhandbook.org"}
            ]
        }
    ]

    return {
        "title": f"Personalized {target_role} Career Roadmap",
        "overview": f"A comprehensive {duration_weeks}-week strategic plan tailored for {exp_level} level ({hours_per_week} hrs/week). Focuses on bridging missing competencies ({', '.join(missing_skills[:3]) if missing_skills else 'core skills'}) through structured phases, real-world capstone projects, and curated industry resources.",
        "total_weeks": duration_weeks,
        "phases": phases
    }
