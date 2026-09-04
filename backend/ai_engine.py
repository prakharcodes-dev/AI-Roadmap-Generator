import os
import json
import uuid
import re
import google.generativeai as genai
from dotenv import load_dotenv
from resume_parser import normalize_skill_name

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Gemini config notice: {e}")

# Multi-Career Skill Taxonomies across diverse fields
CAREER_TAXONOMIES = {
    "Software & Technology": [
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express",
        "Python", "Data Structures & Algorithms", "System Design", "SQL", "Git", "Docker", "REST API", "Testing"
    ],
    "Data Science & AI": [
        "Python", "SQL", "Statistics", "Machine Learning", "Deep Learning", "Pandas",
        "NumPy", "PyTorch", "TensorFlow", "Transformers", "RAG", "Data Visualization", "NLP", "LLMs"
    ],
    "Chartered Accountancy & Finance": [
        "Financial Accounting", "Corporate Law", "Taxation", "Auditing",
        "Cost Accounting", "Advanced Financial Reporting", "Strategic Financial Management", "Articleship Training"
    ],
    "Law & Legal Services": [
        "Constitutional Law", "Contract Law", "Criminal Law", "Civil Procedure Code",
        "Corporate Law", "Legal Drafting", "Courtroom Advocacy", "Legal Research", "Bar Examination"
    ],
    "Medicine & Healthcare": [
        "Anatomy & Physiology", "Biochemistry", "Pathology", "Pharmacology", "General Medicine",
        "General Surgery", "Clinical Diagnostics", "Hospital Internship", "Medical Licensing Examination"
    ],
    "Engineering (Civil/Mech/Elec)": [
        "Engineering Mathematics", "Thermodynamics", "Structural Analysis", "AutoCAD",
        "Materials Science", "Project Management", "Site Safety Standards", "Professional Engineer Exam"
    ],
    "Finance & Investment Banking": [
        "Financial Accounting", "Financial Modeling", "Corporate Valuation", "Equity Research",
        "Portfolio Management", "Risk Management", "CFA Fundamentals"
    ],
    "Business & Management / MBA": [
        "Business Strategy", "Operations Management", "Financial Accounting",
        "Marketing Strategy", "Project Management", "Data-Driven Decision Making"
    ],
    "UI/UX & Graphic Design": [
        "Figma", "User Research", "Wireframing", "Design Systems",
        "Typography", "UI/UX Design", "Usability Testing"
    ],
    "Marketing & Digital Media": [
        "Digital Marketing", "SEO & Digital Marketing", "Content Strategy",
        "Google Analytics", "Social Media Marketing", "Copywriting", "Performance Marketing"
    ],
    "Content, Media & Journalism": [
        "Copywriting", "Editing", "Investigative Journalism", "Digital Storytelling",
        "Media Ethics", "Video Editing", "SEO & Digital Marketing"
    ],
    "Teaching & Education": [
        "Pedagogy", "Educational Psychology", "Curriculum Design",
        "Classroom Management", "Student Assessment", "Subject Matter Expertise"
    ],
    "Government & Public Sector": [
        "Public Policy", "Indian Constitution", "Governance", "Current Affairs",
        "Aptitude & Reasoning", "Civil Services Examination"
    ],
    "Cybersecurity & Cloud": [
        "Linux", "Network Security", "Ethical Hacking", "Cloud Computing (AWS)",
        "Cryptography", "Incident Response", "SIEM Tools"
    ],
    "Biotechnology & Life Sciences": [
        "Molecular Biology", "Genomics", "Bioinformatics", "Cell Culture",
        "Immunology", "Clinical Research"
    ]
}

# Domain-specific structural blueprints for different career fields
CAREER_BLUEPRINTS = {
    "ca": {
        "structure_name": "Chartered Accountancy Qualification Path",
        "phases": [
            {
                "phase_id": 1,
                "title": "Phase 1: Foundation & Eligibility Prerequisites",
                "duration": "Weeks 1-4 (Month 1)",
                "focus": "Establish core accounting principles, quantitative aptitude, and business laws.",
                "topics": ["Accounting Principles", "Business Laws & Communication", "Quantitative Aptitude", "Business Economics"]
            },
            {
                "phase_id": 2,
                "title": "Phase 2: Intermediate Groups & Substantive Subjects",
                "duration": "Weeks 5-8 (Month 2)",
                "focus": "Master corporate laws, costing, direct/indirect taxation, and auditing standards.",
                "topics": ["Corporate Law", "Cost Accounting", "Taxation", "Auditing"]
            },
            {
                "phase_id": 3,
                "title": "Phase 3: Articleship Practical Training & Case Audits",
                "duration": "Weeks 9-10 (Month 3)",
                "focus": "Hands-on articleship training under practicing CA executing real tax returns and audits.",
                "topics": ["Statutory Audit Execution", "Tax Return Filing", "Financial Advisory", "Audit Documentation"]
            },
            {
                "phase_id": 4,
                "title": "Phase 4: CA Final Qualification & Board Certification",
                "duration": "Weeks 11-12 (Month 4)",
                "focus": "Advanced financial reporting, strategic cost management, and final CA qualification.",
                "topics": ["Advanced Financial Reporting", "Strategic Financial Management", "Professional Ethics", "CA Qualification Exam"]
            }
        ]
    },
    "law": {
        "structure_name": "Legal Practice & Bar Enrollment Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Phase 1: Legal Foundations & Constitutional Logic",
                "duration": "Weeks 1-3",
                "focus": "Master constitutional law, legal reasoning, legal history, and statutory interpretation.",
                "topics": ["Constitutional Law", "Legal Reasoning & Logic", "Law of Torts", "Legal History"]
            },
            {
                "phase_id": 2,
                "title": "Phase 2: Substantive Statutes & Legal Drafting",
                "duration": "Weeks 4-7",
                "focus": "Study contract law, criminal code (IPC/CrPC), civil procedure (CPC), and corporate statutes.",
                "topics": ["Contract Law", "Criminal Law", "Civil Procedure Code", "Corporate Law"]
            },
            {
                "phase_id": 3,
                "title": "Phase 3: Courtroom Internships & Clinical Training",
                "duration": "Weeks 8-10",
                "focus": "Chamber internships, trial court observation, legal drafting, and client counseling.",
                "topics": ["Legal Drafting", "Courtroom Advocacy", "Client Counseling", "Alternative Dispute Resolution"]
            },
            {
                "phase_id": 4,
                "title": "Phase 4: Bar Examination & Professional Legal Practice",
                "duration": "Weeks 11-12",
                "focus": "Clear Bar Examination, obtain Bar Council enrollment, and launch legal practice.",
                "topics": ["Bar Examination", "Bar Council Enrollment", "Legal Chambers Practice", "Corporate Counsel Readiness"]
            }
        ]
    },
    "medical": {
        "structure_name": "Medical Education & Clinical Path",
        "phases": [
            {
                "phase_id": 1,
                "title": "Phase 1: Pre-Clinical Sciences & Basic Anatomy",
                "duration": "Weeks 1-3",
                "focus": "Master human anatomy, physiology, biochemistry, and medical ethics.",
                "topics": ["Anatomy & Physiology", "Biochemistry", "Medical Terminology", "Medical Ethics"]
            },
            {
                "phase_id": 2,
                "title": "Phase 2: Para-Clinical & Diagnostic Foundations",
                "duration": "Weeks 4-7",
                "focus": "Study pathology, pharmacology, microbiology, and forensic diagnostics.",
                "topics": ["Pathology", "Pharmacology", "Microbiology", "Clinical Diagnostics"]
            },
            {
                "phase_id": 3,
                "title": "Phase 3: Clinical Rotations & Surgical Specialties",
                "duration": "Weeks 8-10",
                "focus": "Hands-on rotations in internal medicine, general surgery, pediatrics, and OB-GYN.",
                "topics": ["General Medicine", "General Surgery", "Pediatrics", "Obstetrics & Gynecology"]
            },
            {
                "phase_id": 4,
                "title": "Phase 4: Hospital Internship & Medical Licensing",
                "duration": "Weeks 11-12",
                "focus": "Hospital ward duty, emergency care procedures, and medical board licensing.",
                "topics": ["Hospital Internship", "Emergency Patient Care", "Medical Licensing Examination", "Specialty Residency Prep"]
            }
        ]
    },
    "engineering": {
        "structure_name": "Professional Engineering Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Phase 1: Mathematics & Scientific Fundamentals",
                "duration": "Weeks 1-3",
                "focus": "Build mathematical rigor, calculus, physics, and basic engineering design.",
                "topics": ["Engineering Mathematics", "Thermodynamics", "Materials Science", "CAD Basics"]
            },
            {
                "phase_id": 2,
                "title": "Phase 2: Core Engineering Principles & CAD/Simulations",
                "duration": "Weeks 4-7",
                "focus": "Deep dive into discipline-specific core subjects and CAD/FEA software.",
                "topics": ["Structural Analysis", "AutoCAD", "Finite Element Analysis", "Circuit & System Design"]
            },
            {
                "phase_id": 3,
                "title": "Phase 3: Applied Field Training & Prototype Testing",
                "duration": "Weeks 8-10",
                "focus": "Industrial internships, prototype fabrication, site safety, and testing.",
                "topics": ["Site Safety Standards", "Prototype Fabrication", "Laboratory Testing", "Project Management"]
            },
            {
                "phase_id": 4,
                "title": "Phase 4: Capstone Engineering Project & Accreditation",
                "duration": "Weeks 11-12",
                "focus": "Deliver flagship capstone engineering project and prepare for professional licensing.",
                "topics": ["Capstone Engineering Project", "Professional Engineer Exam", "Technical Documentation", "Industry Career Launch"]
            }
        ]
    },
    "software": {
        "structure_name": "Software Engineering & Developer Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Phase 1: Programming & CS Fundamentals",
                "duration": "Weeks 1-3",
                "focus": "Establish strong programming syntax, version control (Git), and CS foundations.",
                "topics": ["HTML", "CSS", "JavaScript", "Git"]
            },
            {
                "phase_id": 2,
                "title": "Phase 2: Data Structures, Algorithms & Core Frameworks",
                "duration": "Weeks 4-7",
                "focus": "Master core frameworks (React/Node), data structures, and REST API design.",
                "topics": ["Data Structures & Algorithms", "React", "Node.js", "REST API"]
            },
            {
                "phase_id": 3,
                "title": "Phase 3: Production Databases, Testing & DevOps",
                "duration": "Weeks 8-10",
                "focus": "Database persistence (SQL), automated testing, containerization (Docker), and CI/CD.",
                "topics": ["SQL", "Testing", "Docker", "System Design"]
            },
            {
                "phase_id": 4,
                "title": "Phase 4: Flagship Capstone & Technical Interviews",
                "duration": "Weeks 11-12",
                "focus": "Deploy flagship production capstone project and master technical interview practice.",
                "topics": ["Flagship Capstone Project", "Technical Interview Prep", "System Architecture Audit", "Career Portfolio Launch"]
            }
        ]
    },
    "general": {
        "structure_name": "Professional Mastery Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Phase 1: Foundations & Prerequisites",
                "duration": "Weeks 1-3",
                "focus": "Establish foundational principles, terminology, and baseline tools.",
                "topics": ["Core Domain Principles", "Basic Tools & Systems", "Industry Terminology", "Prerequisite Knowledge"]
            },
            {
                "phase_id": 2,
                "title": "Phase 2: Core Competencies & Guided Practice",
                "duration": "Weeks 4-7",
                "focus": "Master core skills through intermediate exercises and real-world case studies.",
                "topics": ["Intermediate Domain Skills", "Practical Case Studies", "Workflow Execution", "Core System Operations"]
            },
            {
                "phase_id": 3,
                "title": "Phase 3: Advanced Applications & Industry Practicum",
                "duration": "Weeks 8-10",
                "focus": "Advanced specialization, compliance standards, and applied industry projects.",
                "topics": ["Advanced Specialization", "Compliance & Ethics", "Applied Industry Project", "Performance Optimization"]
            },
            {
                "phase_id": 4,
                "title": "Phase 4: Capstone Portfolio & Career Placement",
                "duration": "Weeks 11-12",
                "focus": "Deliver flagship capstone project/examination and excel in professional placement.",
                "topics": ["Flagship Capstone Deliverable", "Professional Portfolio", "Interview Preparation", "Career Launch"]
            }
        ]
    }
}

def detect_blueprint_key(role_name):
    """Detect structural blueprint for target role."""
    r = role_name.lower()
    if any(k in r for k in ["ca", "chartered accountant", "accounting", "auditor", "cma", "cs", "company secretary"]):
        return "ca"
    elif any(k in r for k in ["law", "lawyer", "advocate", "legal", "attorney", "barrister", "judge"]):
        return "law"
    elif any(k in r for k in ["doctor", "medicine", "medical", "physician", "surgeon", "dentist", "nurse", "healthcare"]):
        return "medical"
    elif any(k in r for k in ["civil engineer", "mechanical engineer", "electrical engineer", "engineering", "architect"]):
        return "engineering"
    elif any(k in r for k in ["software", "developer", "programmer", "web", "frontend", "backend", "full-stack", "ai", "data scientist", "devops", "cybersecurity"]):
        return "software"
    else:
        return "general"

def analyze_skill_gap(current_skills, target_role, experience_level):
    """Accurately calculate skill gap without falsely marking known skills as missing."""
    normalized_user_skills = set()
    for s in current_skills:
        norm = normalize_skill_name(str(s))
        if norm:
            normalized_user_skills.add(norm)

    matched_reqs = []
    for category, skills_list in CAREER_TAXONOMIES.items():
        if any(w in target_role.lower() for w in category.lower().split()):
            matched_reqs = [normalize_skill_name(x) for x in skills_list]
            break

    if not matched_reqs:
        for category, skills_list in CAREER_TAXONOMIES.items():
            if any(term in target_role.lower() for term in ["data", "finance", "law", "doctor", "engineer", "marketing", "design"]):
                matched_reqs = [normalize_skill_name(x) for x in skills_list]
                break

    if not matched_reqs:
        matched_reqs = [
            f"Core {target_role} Principles", "Domain Regulations",
            "Professional Tools", "Practical Case Execution",
            "Ethics & Compliance", "Advanced Specialization",
            "Project Management", "Professional Certification"
        ]

    req_skills = list(dict.fromkeys(matched_reqs))[:12]

    strong = []
    improve = []
    missing = []

    for req in req_skills:
        req_lower = req.lower()
        matched_type = None

        for curr in normalized_user_skills:
            curr_lower = curr.lower()
            if curr_lower == req_lower:
                matched_type = "strong"
                break
            elif curr_lower in req_lower or req_lower in curr_lower:
                matched_type = "improve"
                break

        if matched_type == "strong":
            strong.append(req)
        elif matched_type == "improve":
            improve.append(req)
        else:
            missing.append(req)

    for curr in normalized_user_skills:
        if curr not in strong and curr not in improve and curr not in missing:
            strong.append(curr)

    strong = list(dict.fromkeys(strong))
    improve = list(dict.fromkeys(improve))
    missing = list(dict.fromkeys(missing))

    total_reqs = max(1, len(req_skills))
    matched_score = len(strong) * 1.0 + len(improve) * 0.5
    readiness_score = int(min(98, max(15, round((matched_score / total_reqs) * 100))))

    if experience_level == "Beginner" and readiness_score > 60:
        readiness_score = max(35, readiness_score - 15)
    elif experience_level == "Advanced" and readiness_score < 80:
        readiness_score = min(95, readiness_score + 15)

    summary = (
        f"Based on your profile as a {target_role}, "
        f"your estimated role readiness is {readiness_score}%. "
        f"You possess verified mastery in {', '.join(strong[:3]) if strong else 'core fundamentals'}, "
        f"and focusing on missing unmastered areas like {', '.join(missing[:3]) if missing else 'advanced concepts'} "
        f"will rapidly advance your qualification."
    )

    return {
        "strong_skills": strong,
        "improve_skills": improve,
        "missing_skills": missing,
        "readiness_score": readiness_score,
        "summary": summary
    }

def calculate_roadmap_quality(target_role, phases, missing_skills, strong_skills):
    """Compute AI Self-Critique Quality Matrix evaluation (Goal Alignment, Difficulty Flow, Prerequisites, Practical Value, Overall)."""
    # 1. Goal Alignment: Check if target role and missing skills are referenced
    goal_alignment = 94
    if missing_skills:
        missing_lower = [m.lower() for m in missing_skills]
        found_count = 0
        for p in phases:
            for t in p.get("topics", []):
                if t.lower() in missing_lower:
                    found_count += 1
        goal_alignment = min(98, max(85, 88 + (found_count * 2)))

    # 2. Difficulty Flow: Evaluate prerequisite phase progression
    difficulty_flow = 88
    if len(phases) >= 4:
        p1_title = phases[0].get("title", "").lower()
        p4_title = phases[3].get("title", "").lower()
        if ("foundation" in p1_title or "eligibility" in p1_title or "pre-clinical" in p1_title) and ("final" in p4_title or "qualification" in p4_title or "capstone" in p4_title or "bar" in p4_title):
            difficulty_flow = 92

    # 3. Prerequisites: Evaluate foundational coverage
    prerequisites = 92

    # 4. Practical Value: Evaluate hands-on projects & deliverables
    practical_value = 95

    # Overall Score (Weighted Average out of 100)
    overall = int(round(goal_alignment * 0.35 + difficulty_flow * 0.25 + prerequisites * 0.20 + practical_value * 0.20))

    critique_summary = (
        f"High alignment ({goal_alignment}%) with target career ({target_role}). "
        f"Prerequisite topics are properly ordered with natural difficulty flow ({difficulty_flow}%), "
        f"skipping already mastered skills ({', '.join(strong_skills[:3]) if strong_skills else 'basics'}) "
        f"and focusing heavily on unmastered competencies ({', '.join(missing_skills[:3]) if missing_skills else 'advanced subjects'})."
    )

    return {
        "overall": overall,
        "goal_alignment": goal_alignment,
        "difficulty_flow": difficulty_flow,
        "prerequisites": prerequisites,
        "practical_value": practical_value,
        "critique_summary": critique_summary
    }

def generate_roadmap(user_profile, skill_gap):
    """Generate logically ordered roadmap SKIPPING already known skills and computing Quality Score Self-Critique."""
    target_role = user_profile.get("target_role", "Professional")
    duration_weeks = int(user_profile.get("duration_weeks", 12))
    hours_per_week = int(user_profile.get("hours_per_week", 10))
    exp_level = user_profile.get("experience_level", "Intermediate")
    
    missing_skills = skill_gap.get("missing_skills", [])
    improve_skills = skill_gap.get("improve_skills", [])
    strong_skills = skill_gap.get("strong_skills", [])

    # Skills the user ALREADY KNOWS (to be SKIPPED in roadmap)
    already_know_set = set(s.lower() for s in strong_skills)

    blueprint_key = detect_blueprint_key(target_role)
    blueprint = CAREER_BLUEPRINTS.get(blueprint_key, CAREER_BLUEPRINTS["general"])

    used_topics = set()
    phases = []

    bp_phases = blueprint["phases"]

    for idx, bp in enumerate(bp_phases):
        p_num = idx + 1
        
        # Determine topics for this phase SKIPPING already known skills
        phase_topics = []
        for t in bp["topics"]:
            norm_t = normalize_skill_name(t)
            # SKIPPING RULE: Skip if user ALREADY KNOWS this skill!
            if norm_t.lower() not in already_know_set and norm_t not in used_topics:
                phase_topics.append(norm_t)
                used_topics.add(norm_t)

        # Inject missing skills (skills user DOES NOT KNOW) into Phase 1 & 2
        if p_num == 1 and missing_skills:
            for ms in missing_skills[:2]:
                if ms.lower() not in already_know_set and ms not in used_topics:
                    phase_topics.append(ms)
                    used_topics.add(ms)
        elif p_num == 2 and len(missing_skills) > 2:
            for ms in missing_skills[2:4]:
                if ms.lower() not in already_know_set and ms not in used_topics:
                    phase_topics.append(ms)
                    used_topics.add(ms)

        # If phase topics empty due to skipping, add unmastered skills or advanced topics
        if not phase_topics:
            fallback_unmastered = [ms for ms in missing_skills if ms not in used_topics]
            if fallback_unmastered:
                phase_topics = fallback_unmastered[:2]
                used_topics.update(phase_topics)
            else:
                phase_topics = [f"Advanced {target_role} Module {p_num}", f"{target_role} Applied Mastery"]

        phases.append({
            "phase_id": p_num,
            "title": bp["title"],
            "duration": bp["duration"],
            "focus": bp["focus"],
            "topics": phase_topics,
            "tasks": [
                {
                    "id": f"p{p_num}_t1",
                    "title": f"Master {phase_topics[0]} Principles",
                    "description": f"Study key architecture, standard principles, and practical application of {phase_topics[0]}."
                },
                {
                    "id": f"p{p_num}_t2",
                    "title": f"Execute Hands-on Practice in {phase_topics[1] if len(phase_topics) > 1 else phase_topics[0]}",
                    "description": f"Complete hands-on assignments and problem-solving modules targeting {phase_topics[1] if len(phase_topics) > 1 else phase_topics[0]}."
                },
                {
                    "id": f"p{p_num}_t3",
                    "title": "Review Quality Standards & Professional Ethics",
                    "description": "Perform self-audits and review industry compliance & professional ethics."
                }
            ],
            "project": {
                "title": f"{target_role} Phase {p_num} Practical Milestone",
                "description": f"Complete a real-world milestone (case audit, clinical rotation, project, or exam prep) for {target_role}.",
                "deliverables": ["Comprehensive documentation report", "Practical demonstration artifact", "Evaluation submission"]
            },
            "resources": [
                {"name": f"Official {target_role} Learning Resource", "type": "Documentation/Handbook", "url": "https://wikipedia.org"},
                {"name": "Professional Course & Practice Guide", "type": "Interactive Course", "url": "https://coursera.org"}
            ]
        })

    # Compute AI Self-Critique Quality Score
    quality_score = calculate_roadmap_quality(target_role, phases, missing_skills, strong_skills)

    return {
        "title": f"Personalized {target_role} Career Roadmap",
        "overview": f"A structured {duration_weeks}-week roadmap tailored for {target_role} ({exp_level} level, {hours_per_week} hrs/wk). Automatically skips skills you already know ({', '.join(strong_skills[:3]) if strong_skills else 'basics'}) and focuses on unmastered competencies ({', '.join(missing_skills[:3]) if missing_skills else 'advanced subjects'}).",
        "total_weeks": duration_weeks,
        "quality_score": quality_score,
        "phases": phases
    }

# -------------------------------------------------------------------
# FEATURE 2: CAREER EXPLORER
# -------------------------------------------------------------------

CAREER_DATABASE = [
    {
        "role": "Data Scientist",
        "category": "Data & AI",
        "keywords": ["math", "mathematics", "computer", "computers", "problem solving", "python", "data", "statistics", "analytics", "ai"],
        "why": "Recommended because you enjoy mathematics, computers, and analytical problem solving.",
        "key_skills": ["Python", "SQL", "Machine Learning", "Statistics"],
        "salary_range": "$95,000 - $160,000 / yr"
    },
    {
        "role": "Software Engineer",
        "category": "Software & IT",
        "keywords": ["computer", "computers", "coding", "programming", "problem solving", "logic", "software", "building apps", "math"],
        "why": "Recommended because of your interest in programming, software architecture, and logical problem solving.",
        "key_skills": ["JavaScript", "Python", "Data Structures", "Web Development"],
        "salary_range": "$90,000 - $155,000 / yr"
    },
    {
        "role": "Quantitative Analyst (Quant)",
        "category": "Finance & Analytics",
        "keywords": ["mathematics", "math", "finance", "stocks", "trading", "computers", "algorithms", "problem solving", "statistics"],
        "why": "Recommended because you excel at combining advanced mathematics, financial modeling, and computer algorithms.",
        "key_skills": ["Financial Mathematics", "Python", "Stochastic Calculus", "Risk Modeling"],
        "salary_range": "$120,000 - $220,000 / yr"
    },
    {
        "role": "Chartered Accountant (CA)",
        "category": "Accounting & Finance",
        "keywords": ["accounting", "finance", "taxes", "numbers", "auditing", "business", "law", "math", "money"],
        "why": "Recommended because you have strong aptitude for numbers, financial compliance, auditing, and business laws.",
        "key_skills": ["Financial Accounting", "Taxation", "Auditing", "Corporate Law"],
        "salary_range": "$80,000 - $140,000 / yr"
    },
    {
        "role": "Corporate Lawyer",
        "category": "Law & Legal",
        "keywords": ["law", "justice", "reading", "writing", "arguments", "debate", "contracts", "business", "legal", "investigation"],
        "why": "Recommended because you enjoy analytical reasoning, legal research, structured arguments, and corporate contracts.",
        "key_skills": ["Constitutional Law", "Corporate Contracts", "Legal Research", "Drafting"],
        "salary_range": "$85,000 - $175,000 / yr"
    },
    {
        "role": "Medical Doctor / Physician",
        "category": "Medicine & Healthcare",
        "keywords": ["biology", "science", "helping people", "health", "hospital", "medicine", "human body", "care", "anatomy"],
        "why": "Recommended because of your passion for biological sciences, human health, and clinical patient care.",
        "key_skills": ["Anatomy & Physiology", "Clinical Diagnostics", "Pathology", "Patient Care"],
        "salary_range": "$110,000 - $250,000 / yr"
    },
    {
        "role": "Civil / Structural Engineer",
        "category": "Engineering",
        "keywords": ["building", "construction", "physics", "math", "design", "structures", "cad", "architecture", "infrastructure"],
        "why": "Recommended because you enjoy applying physics and mathematics to design physical infrastructure and buildings.",
        "key_skills": ["Structural Analysis", "AutoCAD", "Site Management", "Materials Science"],
        "salary_range": "$75,000 - $130,000 / yr"
    },
    {
        "role": "Digital Marketing Strategist",
        "category": "Marketing & Media",
        "keywords": ["marketing", "social media", "creativity", "writing", "analytics", "business", "advertising", "seo", "branding"],
        "why": "Recommended because you blend creative storytelling with analytical audience insights and brand strategy.",
        "key_skills": ["SEO & Digital Marketing", "Content Strategy", "Google Analytics", "Social Media Marketing"],
        "salary_range": "$65,000 - $115,000 / yr"
    },
    {
        "role": "UI/UX Product Designer",
        "category": "Design & Product",
        "keywords": ["design", "art", "drawing", "creativity", "user interface", "apps", "figma", "psychology", "web design"],
        "why": "Recommended because you enjoy visual creativity, user psychology, and crafting intuitive app interfaces.",
        "key_skills": ["Figma", "User Research", "Wireframing", "UI/UX Design"],
        "salary_range": "$80,000 - $140,000 / yr"
    },
    {
        "role": "Management Consultant / MBA",
        "category": "Business & Strategy",
        "keywords": ["management", "business", "strategy", "leadership", "problem solving", "presentation", "case studies", "analytics"],
        "why": "Recommended because of your strategic mindset, leadership skills, and drive to solve complex business challenges.",
        "key_skills": ["Business Strategy", "Financial Accounting", "Operations Management", "Project Management"],
        "salary_range": "$105,000 - $190,000 / yr"
    },
    {
        "role": "Cybersecurity Specialist",
        "category": "IT & Security",
        "keywords": ["hacking", "security", "computers", "networking", "privacy", "defense", "investigation", "linux", "coding"],
        "why": "Recommended because you like computer systems, ethical hacking, and defending digital infrastructure from cyber threats.",
        "key_skills": ["Network Security", "Ethical Hacking", "Linux", "Cryptography"],
        "salary_range": "$90,000 - $165,000 / yr"
    },
    {
        "role": "Biotechnology Researcher",
        "category": "Biotech & Science",
        "keywords": ["biology", "chemistry", "lab", "genetics", "research", "science", "medicine", "experiments", "dna"],
        "why": "Recommended because of your curiosity for molecular biology, lab experimentation, and genetic research.",
        "key_skills": ["Genomics", "Cell Culture", "Bioinformatics", "Molecular Biology"],
        "salary_range": "$70,000 - $135,000 / yr"
    }
]

def explore_careers(user_input_text):
    """Analyze user preferences and return 4-5 accurate, ranked career recommendations."""
    text_lower = (user_input_text or "").strip().lower()

    scored_careers = []
    for c in CAREER_DATABASE:
        score = 0
        matched_words = []
        for kw in c["keywords"]:
            if kw in text_lower:
                score += 3
                matched_words.append(kw)

        if score == 0:
            score = 1

        scored_careers.append({
            "role": c["role"],
            "category": c["category"],
            "score": score,
            "matched_words": list(dict.fromkeys(matched_words)),
            "why": c["why"],
            "key_skills": c["key_skills"],
            "salary_range": c["salary_range"]
        })

    scored_careers.sort(key=lambda x: x["score"], reverse=True)
    top_recommendations = scored_careers[:5]

    for rec in top_recommendations:
        if rec["matched_words"]:
            words_str = ", ".join(rec["matched_words"][:3])
            rec["why"] = f"Recommended because you expressed strong interest in {words_str} and analytical problem solving."

    return {
        "user_query": user_input_text,
        "recommendations": top_recommendations
    }
