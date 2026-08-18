import os
import json
import uuid
import re
import google.generativeai as genai
from dotenv import load_dotenv

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
        "Python", "JavaScript", "TypeScript", "HTML", "CSS", "React", "Node.js", "Java", "C++",
        "Data Structures & Algorithms", "System Design", "SQL", "Git", "Docker", "REST API", "Testing"
    ],
    "Data Science & AI": [
        "Python", "R", "SQL", "Statistics", "Machine Learning", "Deep Learning", "Pandas",
        "NumPy", "PyTorch", "TensorFlow", "Data Visualization", "Big Data", "NLP", "LLMs"
    ],
    "Chartered Accountancy & Finance": [
        "Accounting Standards", "Financial Accounting", "Costing & Management Accounting",
        "Corporate Law", "Taxation (Direct & Indirect)", "Auditing & Assurance", "Financial Management",
        "Advanced Financial Reporting", "Strategic Cost Management", "Articleship Training"
    ],
    "Law & Legal Services": [
        "Constitutional Law", "Contract Law", "Criminal Law (IPC/CrPC)", "Civil Procedure (CPC)",
        "Corporate Law", "Intellectual Property Law", "Legal Drafting & Conveyancing",
        "Courtroom Advocacy", "Arbitration & Dispute Resolution", "Legal Research", "Bar Examination"
    ],
    "Medicine & Healthcare": [
        "Anatomy & Physiology", "Biochemistry", "Pathology", "Pharmacology", "General Medicine",
        "General Surgery", "Pediatrics", "Obstetrics & Gynecology", "Clinical Diagnostics",
        "Medical Ethics", "Hospital Internship", "Medical Licensing Examination"
    ],
    "Engineering (Civil/Mech/Elec)": [
        "Engineering Mathematics", "Thermodynamics / Structural Analysis", "CAD / SolidWorks / AutoCAD",
        "Fluid Mechanics", "Circuit Analysis", "Materials Science", "Project Management",
        "Site Safety & Standards", "Design & Simulation", "Professional Engineer Exam"
    ],
    "Finance & Investment Banking": [
        "Financial Modeling", "Corporate Valuation", "Excel & Financial Analytics",
        "Mergers & Acquisitions (M&A)", "Portfolio Management", "Equity Research",
        "Financial Accounting", "Risk Management (FRM)", "CFA Fundamentals"
    ],
    "Business & Management / MBA": [
        "Business Strategy", "Operations Management", "Organizational Behavior",
        "Financial Management", "Marketing Strategy", "Leadership & Team Management",
        "Project Management (PMP/Agile)", "Data-Driven Decision Making", "Business Negotiation"
    ],
    "UI/UX & Graphic Design": [
        "Figma", "User Research", "Wireframing & Prototyping", "Design Systems",
        "Information Architecture", "Adobe Creative Suite (Photoshop/Illustrator)",
        "Typography & Color Theory", "Usability Testing", "UI Animation"
    ],
    "Marketing & Digital Media": [
        "Digital Marketing", "SEO & SEM", "Social Media Strategy", "Content Marketing",
        "Google Analytics", "Email Marketing Campaigns", "Copywriting",
        "Brand Strategy", "Performance Marketing & Paid Ads", "Conversion Rate Optimization"
    ],
    "Content, Media & Journalism": [
        "Investigative Journalism", "Copywriting & Editing", "Media Law & Ethics",
        "Digital Storytelling", "Video Editing & Production", "Podcast Production",
        "Search Engine Optimization (SEO)", "Social Media Management", "Broadcasting"
    ],
    "Teaching & Education": [
        "Pedagogy & Teaching Methodology", "Educational Psychology", "Curriculum Design",
        "Classroom Management", "Educational Technology", "Student Assessment & Evaluation",
        "Subject Matter Expertise", "Special Education Principles"
    ],
    "Government & Public Sector": [
        "Public Administration", "Indian Constitution & Polity / Governance", "General Studies",
        "Current Affairs", "Public Policy Analysis", "Aptitude & Quantitative Reasoning",
        "Ethics & Integrity", "Civil Services Examination"
    ],
    "Cybersecurity & Cloud": [
        "Network Security", "Ethical Hacking & Penetration Testing", "Linux Systems Administration",
        "Cloud Computing (AWS/Azure/GCP)", "Cryptography", "Incident Response",
        "SIEM Tools", "Security Compliance & Auditing", "DevSecOps"
    ],
    "Biotechnology & Life Sciences": [
        "Molecular Biology", "Genetics & Genomics", "Bioinformatics", "Cell Culture Techniques",
        "Bioprocess Engineering", "Immunology", "Lab Safety & Quality Assurance",
        "Recombinant DNA Technology", "Clinical Research"
    ]
}

# Domain-specific structural blueprints for different career fields
CAREER_BLUEPRINTS = {
    "ca": {
        "structure_name": "Chartered Accountancy Qualification Path",
        "phases": [
            {
                "phase_id": 1,
                "title": "Foundation & Basic Eligibility",
                "duration": "4-6 Months",
                "focus": "Build core accounting fundamentals, business law, and quantitative aptitude.",
                "topics": ["Accounting Principles", "Business Laws & Communication", "Quantitative Aptitude", "Business Economics"]
            },
            {
                "phase_id": 2,
                "title": "Intermediate Course & Group Subjects",
                "duration": "8-10 Months",
                "focus": "Master intermediate level accounting, corporate laws, taxation, and auditing.",
                "topics": ["Corporate & Other Laws", "Cost & Management Accounting", "Direct & Indirect Taxation", "Auditing & Code of Ethics"]
            },
            {
                "phase_id": 3,
                "title": "Practical Articleship Training & Real-World Exposure",
                "duration": "24-36 Months",
                "focus": "Hands-on articleship under a practicing CA handling real statutory audits and tax filings.",
                "topics": ["Statutory & Internal Audit", "Tax Filing & Assessment", "Financial Advisory", "IT & Soft Skills Training"]
            },
            {
                "phase_id": 4,
                "title": "CA Final Exam & Professional Qualification",
                "duration": "6-12 Months",
                "focus": "Advanced financial reporting, strategic financial management, and professional qualification.",
                "topics": ["Advanced Financial Reporting", "Strategic Financial Management", "Advanced Auditing", "Strategic Cost Management"]
            }
        ]
    },
    "law": {
        "structure_name": "Legal Practice & Bar Enrollment Path",
        "phases": [
            {
                "phase_id": 1,
                "title": "Legal Eligibility & Foundation Studies",
                "duration": "Semester 1-2 (Year 1)",
                "focus": "Understand constitutional principles, legal logic, jurisprudence, and legal writing.",
                "topics": ["Constitutional Law", "Legal Methods & Reasoning", "Law of Torts", "Legal History & Philosophy"]
            },
            {
                "phase_id": 2,
                "title": "Core Statutory Laws & Drafting",
                "duration": "Semester 3-6 (Year 2-3)",
                "focus": "Master substantive civil, criminal, contract, and corporate laws.",
                "topics": ["Contract Law", "Criminal Law (IPC/CrPC)", "Civil Procedure Code (CPC)", "Corporate & Commercial Law"]
            },
            {
                "phase_id": 3,
                "title": "Courtroom Internships & Clinical Legal Training",
                "duration": "Semester 7-9 (Year 4-5)",
                "focus": "Gain hands-on judicial/chamber internships, moot court practice, and legal drafting.",
                "topics": ["Courtroom Advocacy", "Client Counseling", "Drafting, Pleading & Conveyancing", "Alternative Dispute Resolution (ADR)"]
            },
            {
                "phase_id": 4,
                "title": "Bar Examination, Enrollment & Specialized Practice",
                "duration": "Post-Degree (6-12 Months)",
                "focus": "Clear Bar Examination, obtain Bar Council enrollment, and launch legal practice or corporate law role.",
                "topics": ["All India Bar Examination (AIBE)", "Bar Council Enrollment", "Chamber Practice / Corporate Legal Counsel", "Specialization (IP/Tax/Cyber Law)"]
            }
        ]
    },
    "medical": {
        "structure_name": "Medical Education & Licensing Path",
        "phases": [
            {
                "phase_id": 1,
                "title": "Pre-Clinical & Foundation Sciences",
                "duration": "Phase I (1.5 Years)",
                "focus": "Master fundamental human anatomy, physiology, and biochemistry.",
                "topics": ["Human Anatomy", "Physiology", "Biochemistry", "Medical Terminology & Ethics"]
            },
            {
                "phase_id": 2,
                "title": "Para-Clinical & Diagnostic Foundations",
                "duration": "Phase II (1.5 Years)",
                "focus": "Study disease mechanisms, drug actions, and diagnostic pathology.",
                "topics": ["Pathology", "Pharmacology", "Microbiology", "Forensic Medicine"]
            },
            {
                "phase_id": 3,
                "title": "Clinical Medicine & Surgical Specialties",
                "duration": "Phase III (2 Years)",
                "focus": "Clinical rotations in internal medicine, general surgery, pediatrics, and OB-GYN.",
                "topics": ["General Medicine", "General Surgery", "Pediatrics", "Obstetrics & Gynecology", "Community Medicine"]
            },
            {
                "phase_id": 4,
                "title": "Compulsory Hospital Internship & Medical Licensing",
                "duration": "1 Year Rotational Internship",
                "focus": "Hands-on patient care in hospital wards, emergency care, and medical licensing registration.",
                "topics": ["Ward Duty & Emergency Care", "Minor Surgical Procedures", "Licensing Board Exam (NEXT/USMLE)", "Specialty Residency Selection"]
            }
        ]
    },
    "engineering": {
        "structure_name": "Professional Engineering Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Engineering Mathematics & Science Foundations",
                "duration": "Year 1 (Weeks 1-12)",
                "focus": "Build mathematical rigor, calculus, physics, and basic engineering design.",
                "topics": ["Calculus & Linear Algebra", "Engineering Physics/Chemistry", "Basic Electrical & Mechanical Concepts", "Computer Programming for Engineers"]
            },
            {
                "phase_id": 2,
                "title": "Core Discipline Mastery & Simulation Tools",
                "duration": "Year 2-3 (Weeks 13-28)",
                "focus": "Deep dive into discipline-specific core subjects and CAD/simulation software.",
                "topics": ["Core Engineering Theory", "CAD / Finite Element Analysis (FEA)", "Materials Science & Strength", "Laboratory & Testing Procedures"]
            },
            {
                "phase_id": 3,
                "title": "Applied Industry Projects & Field Training",
                "duration": "Year 3-4 (Weeks 29-40)",
                "focus": "Industrial internships, prototype design, and field safety compliance.",
                "topics": ["Industry Internship", "System Design & Optimization", "Project Management & Safety Standards", "Prototype Fabrication"]
            },
            {
                "phase_id": 4,
                "title": "Capstone Engineering System & Career Accreditation",
                "duration": "Final Semester (Weeks 41-48)",
                "focus": "Deliver flagship capstone project and prepare for FE/PE licensing or industry role.",
                "topics": ["Major Capstone Design Project", "Professional Engineer (FE/PE) Preparation", "Technical Documentation & Presentation", "Industry Job Search & Interviews"]
            }
        ]
    },
    "software": {
        "structure_name": "Software Engineering & Developer Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Programming & CS Fundamentals",
                "duration": "Weeks 1-3",
                "focus": "Master core programming language, version control, and computer science basics.",
                "topics": ["Core Language Fundamentals", "Git & GitHub Workflow", "Basic Data Structures", "Command Line & IDE Setup"]
            },
            {
                "phase_id": 2,
                "title": "Data Structures, Algorithms & System Building",
                "duration": "Weeks 4-7",
                "focus": "Solve algorithmic challenges and build full-stack web/software applications.",
                "topics": ["Advanced DSA & Problem Solving", "Frontend / Backend Frameworks", "Database & API Design", "System Architecture"]
            },
            {
                "phase_id": 3,
                "title": "Production Projects, DevOps & Testing",
                "duration": "Weeks 8-10",
                "focus": "Containerization, automated testing, and CI/CD deployment pipelines.",
                "topics": ["Docker & CI/CD Pipelines", "Automated Testing Suite", "Cloud Deployment (AWS/Vercel)", "Performance Audit"]
            },
            {
                "phase_id": 4,
                "title": "Capstone Portfolio & Technical Interviews",
                "duration": "Weeks 11-12",
                "focus": "Ship flagship portfolio project and excel at coding & system design interviews.",
                "topics": ["Flagship Capstone Project", "System Design Mock Interviews", "LeetCode & Algorithmic Practice", "Resume & Portfolio Polish"]
            }
        ]
    },
    "general": {
        "structure_name": "Professional Mastery & Career Track",
        "phases": [
            {
                "phase_id": 1,
                "title": "Foundations & Prerequisites",
                "duration": "Phase 1 (Initial 25%)",
                "focus": "Establish strong foundational knowledge, industry tools, and core principles.",
                "topics": ["Core Principles & Terminology", "Key Industry Software & Tools", "Standards & Best Practices", "Fundamental Exercises"]
            },
            {
                "phase_id": 2,
                "title": "Core Competencies & Intermediate Skill Building",
                "duration": "Phase 2 (35% Duration)",
                "focus": "Deepen technical and domain expertise through guided practical modules.",
                "topics": ["Intermediate Domain Theory", "Practical Case Studies", "Workflow & Execution Methods", "Applied Skills Labs"]
            },
            {
                "phase_id": 3,
                "title": "Advanced Applications & Industry Experience",
                "duration": "Phase 3 (25% Duration)",
                "focus": "Real-world projects, internships, or simulations adhering to professional standards.",
                "topics": ["Real-World Projects / Case Audits", "Industry Compliance & Ethics", "Specialized Advanced Tools", "Peer Review & Mentorship"]
            },
            {
                "phase_id": 4,
                "title": "Capstone Deliverable & Professional Career Launch",
                "duration": "Phase 4 (Final 15%)",
                "focus": "Complete flagship portfolio/examination and prepare for career placement.",
                "topics": ["Flagship Capstone Deliverable / Examination", "Professional Credentials & Portfolio", "Interview Preparation & Networking", "Career Placement & Growth"]
            }
        ]
    }
}

def detect_blueprint_key(role_name):
    """Detect which structural blueprint best matches the target career role."""
    r = role_name.lower()
    if any(k in r for k in ["ca", "chartered accountant", "accounting", "auditor", "cma", "cs", "company secretary"]):
        return "ca"
    elif any(k in r for k in ["law", "lawyer", "advocate", "legal", "attorney", "barrister", "judge", "paralegal"]):
        return "law"
    elif any(k in r for k in ["doctor", "medicine", "medical", "physician", "surgeon", "dentist", "nurse", "healthcare", "mbbs", "pharma"]):
        return "medical"
    elif any(k in r for k in ["civil engineer", "mechanical engineer", "electrical engineer", "engineering", "architect", "robotics"]):
        return "engineering"
    elif any(k in r for k in ["software", "developer", "programmer", "web", "frontend", "backend", "full-stack", "full stack", "ai", "machine learning", "data scientist", "devops", "cloud", "cybersecurity"]):
        return "software"
    else:
        return "general"

def analyze_skill_gap(current_skills, target_role, experience_level):
    """Calculate skill gap analysis across ANY career field."""
    current_set = set(s.strip() for s in current_skills if s.strip())
    
    # Try finding exact matching taxonomy or category
    matched_reqs = []
    for category, skills_list in CAREER_TAXONOMIES.items():
        if any(w in target_role.lower() for w in category.lower().split()):
            matched_reqs = skills_list
            break

    if not matched_reqs:
        # Fallback keyword matching across all taxonomies
        for category, skills_list in CAREER_TAXONOMIES.items():
            for sk in skills_list:
                if sk.lower() in target_role.lower() or target_role.lower() in category.lower():
                    matched_reqs.append(sk)
    
    if not matched_reqs:
        # Baseline generic professional requirements
        matched_reqs = [
            f"Core {target_role} Principles", "Domain Regulations & Standards",
            "Professional Tools & Systems", "Practical Case Execution",
            "Ethics & Industry Compliance", "Advanced Domain Specialization",
            "Project & Client Management", "Certification & Accreditation"
        ]

    req_skills = matched_reqs[:12]

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

    for curr in current_skills:
        if curr not in strong and curr not in improve and curr not in missing:
            strong.append(curr)

    total_reqs = max(1, len(req_skills))
    matched_score = len(strong) * 1.0 + len(improve) * 0.5
    readiness_score = int(min(98, max(15, round((matched_score / total_reqs) * 100))))
    
    if experience_level == "Beginner" and readiness_score > 60:
        readiness_score = max(35, readiness_score - 15)
    elif experience_level == "Advanced" and readiness_score < 80:
        readiness_score = min(95, readiness_score + 15)

    summary = (
        f"Based on your profile and target career as a {target_role}, "
        f"your current estimated role readiness is {readiness_score}%. "
        f"You demonstrate strengths in {', '.join(strong[:3]) if strong else 'initial fundamentals'}, "
        f"and mastering key area requirements like {', '.join(missing[:3]) if missing else 'advanced concepts'} "
        f"will accelerate your professional qualification and placement."
    )

    return {
        "strong_skills": strong,
        "improve_skills": improve,
        "missing_skills": missing,
        "readiness_score": readiness_score,
        "summary": summary
    }

def generate_roadmap(user_profile, skill_gap):
    """Generate dynamic multi-career roadmaps using domain blueprints & LLM/Heuristic engine."""
    target_role = user_profile.get("target_role", "Professional")
    duration_weeks = user_profile.get("duration_weeks", 12)
    hours_per_week = user_profile.get("hours_per_week", 10)
    exp_level = user_profile.get("experience_level", "Intermediate")
    missing_skills = skill_gap.get("missing_skills", [])
    improve_skills = skill_gap.get("improve_skills", [])
    strong_skills = skill_gap.get("strong_skills", [])

    blueprint_key = detect_blueprint_key(target_role)
    blueprint = CAREER_BLUEPRINTS.get(blueprint_key, CAREER_BLUEPRINTS["general"])

    # Try Gemini LLM if key is available
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
You are an expert career mentor across all industries (Tech, Finance, Law, Medicine, CA/Accounting, Engineering, Marketing, Design, etc.).
Generate a detailed, highly actionable, personalized learning roadmap for a user aiming to become a {target_role}.

User Profile:
- Target Role: {target_role}
- Experience Level: {exp_level}
- Hours Available Per Week: {hours_per_week} hours
- Duration: {duration_weeks} weeks
- Existing Strong Skills: {', '.join(strong_skills)}
- Skills to Improve: {', '.join(improve_skills)}
- Missing Skills to Master: {', '.join(missing_skills)}

Notice: Adapt the roadmap structure specifically for {target_role}. For example, if it is CA, include Articleship/Exams; if Law, include Bar Exam/Internships; if Doctor, include Clinical Rotations; if Software, include Projects/DSA.

Return ONLY a valid JSON object matching this EXACT schema:
{{
  "title": "{target_role} Professional Roadmap",
  "overview": "High-level strategic career progression tailored for {target_role}...",
  "total_weeks": {duration_weeks},
  "phases": [
    {{
      "phase_id": 1,
      "title": "Phase 1 Title",
      "duration": "Phase 1 Duration",
      "focus": "Core focus of this phase",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "tasks": [
        {{"id": "p1_t1", "title": "Task title", "description": "Action item description"}},
        {{"id": "p1_t2", "title": "Task title 2", "description": "Action item description"}}
      ],
      "project": {{
        "title": "Hands-on Project / Case / Clinical Rotation Name",
        "description": "Description of real-world milestone or practical project",
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      }},
      "resources": [
        {{"name": "Resource Title", "type": "Documentation/Course/Book", "url": "https://example.com"}}
      ]
    }}
  ]
}}
Ensure exactly 4 logical phases matching the profession's real-world path. No markdown ticks outside JSON.
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
            print(f"Gemini LLM fallback: {e}")

    # Heuristic Domain Blueprint Generator
    bp_phases = blueprint["phases"]
    primary_focus = missing_skills[:2] if missing_skills else ["Core Principles", "Industry Practice"]
    
    phases = []
    for idx, bp in enumerate(bp_phases):
        p_num = idx + 1
        phases.append({
            "phase_id": p_num,
            "title": bp["title"],
            "duration": bp["duration"],
            "focus": bp["focus"],
            "topics": bp["topics"],
            "tasks": [
                {
                    "id": f"p{p_num}_t1",
                    "title": f"Study {bp['topics'][0] if bp['topics'] else 'Core Subject'} & Fundamentals",
                    "description": f"Review standard textbooks, regulations, or documentation for {bp['topics'][0] if bp['topics'] else 'domain basics'}."
                },
                {
                    "id": f"p{p_num}_t2",
                    "title": f"Execute Practical Exercises & Case Studies",
                    "description": f"Complete hands-on assignments targeting {primary_focus[0]} in {target_role}."
                },
                {
                    "id": f"p{p_num}_t3",
                    "title": "Review Quality & Compliance Standards",
                    "description": "Perform self-audit against industry standards, legal compliance, or code ethics."
                }
            ],
            "project": {
                "title": f"{target_role} Phase {p_num} Practical Milestone",
                "description": f"Deliver a practical milestone (case analysis, design project, articleship audit, or capstone) for {target_role}.",
                "deliverables": ["Comprehensive documentation report", "Practical demonstration artifact", "Evaluation & presentation"]
            },
            "resources": [
                {"name": f"Official {target_role} Professional Reference Guide", "type": "Reference Guide", "url": "https://wikipedia.org"},
                {"name": "Industry Best Practices Handbook", "type": "Handbook", "url": "https://coursera.org"}
            ]
        })

    return {
        "title": f"Personalized {target_role} Career Roadmap",
        "overview": f"A dynamic {duration_weeks}-week roadmap tailored for {target_role} ({exp_level} level, {hours_per_week} hrs/wk). Structured around standard {blueprint['structure_name']} guidelines to bridge skill gaps.",
        "total_weeks": duration_weeks,
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
        "keywords": ["computer", "coding", "programming", "problem solving", "logic", "software", "building apps", "math"],
        "why": "Recommended because of your interest in programming, software architecture, and logical problem solving.",
        "key_skills": ["JavaScript", "Python", "Data Structures", "Web Development"],
        "salary_range": "$90,000 - $155,000 / yr"
    },
    {
        "role": "Quantitative Analyst (Quant)",
        "category": "Finance & Analytics",
        "keywords": ["mathematics", "math", "finance", "stocks", "trading", "computers", "algorithms", "problem solving", "statistics"],
        "why": "Recommended because you excel at combining advanced mathematics, financial modeling, and computer algorithms.",
        "key_skills": ["Financial Mathematics", "Python/C++", "Stochastic Calculus", "Risk Modeling"],
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
        "role": "Corporate Lawyer / Advocate",
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
        "key_skills": ["Structural Analysis", "AutoCAD", "Site Management", "Materials Engineering"],
        "salary_range": "$75,000 - $130,000 / yr"
    },
    {
        "role": "Digital Marketing Strategist",
        "category": "Marketing & Media",
        "keywords": ["marketing", "social media", "creativity", "writing", "analytics", "business", "advertising", "seo", "branding"],
        "why": "Recommended because you blend creative storytelling with analytical audience insights and brand strategy.",
        "key_skills": ["SEO/SEM", "Content Strategy", "Google Analytics", "Social Media Ads"],
        "salary_range": "$65,000 - $115,000 / yr"
    },
    {
        "role": "UI/UX Product Designer",
        "category": "Design & Product",
        "keywords": ["design", "art", "drawing", "creativity", "user interface", "apps", "figma", "psychology", "web design"],
        "why": "Recommended because you enjoy visual creativity, user psychology, and crafting intuitive app interfaces.",
        "key_skills": ["Figma", "User Research", "Wireframing", "Prototyping"],
        "salary_range": "$80,000 - $140,000 / yr"
    },
    {
        "role": "Management Consultant / MBA",
        "category": "Business & Strategy",
        "keywords": ["management", "business", "strategy", "leadership", "problem solving", "presentation", "case studies", "analytics"],
        "why": "Recommended because of your strategic mindset, leadership skills, and drive to solve complex business challenges.",
        "key_skills": ["Business Strategy", "Financial Analysis", "Operations", "Client Presentation"],
        "salary_range": "$105,000 - $190,000 / yr"
    },
    {
        "role": "Cybersecurity Specialist",
        "category": "IT & Security",
        "keywords": ["hacking", "security", "computers", "networking", "privacy", "defense", "investigation", "linux", "coding"],
        "why": "Recommended because you like computer systems, ethical hacking, and defending digital infrastructure from cyber threats.",
        "key_skills": ["Network Security", "Penetration Testing", "Linux", "Cryptography"],
        "salary_range": "$90,000 - $165,000 / yr"
    },
    {
        "role": "Biotechnology Researcher",
        "category": "Biotech & Science",
        "keywords": ["biology", "chemistry", "lab", "genetics", "research", "science", "medicine", "experiments", "dna"],
        "why": "Recommended because of your curiosity for molecular biology, lab experimentation, and genetic research.",
        "key_skills": ["Genomics", "Cell Culture", "Bioinformatics", "Lab Research"],
        "salary_range": "$70,000 - $135,000 / yr"
    }
]

def explore_careers(user_input_text):
    """Analyze user interests, favorite subjects, strengths & preferences to recommend 4-5 suitable careers."""
    text_lower = user_input_text.lower()

    scored_careers = []
    for c in CAREER_DATABASE:
        score = 0
        matched_words = []
        for kw in c["keywords"]:
            if kw in text_lower:
                score += 2
                matched_words.append(kw)
        
        # Base fallback score if query is broad
        if score == 0:
            score = 1

        scored_careers.append({
            "role": c["role"],
            "category": c["category"],
            "score": score,
            "matched_words": matched_words,
            "why": c["why"],
            "key_skills": c["key_skills"],
            "salary_range": c["salary_range"]
        })

    # Sort by highest score match
    scored_careers.sort(key=lambda x: x["score"], reverse=True)
    top_recommendations = scored_careers[:5]

    # Dynamically refine 'why' message if matched keywords present
    for rec in top_recommendations:
        if rec["matched_words"]:
            words_str = ", ".join(list(set(rec["matched_words"]))[:3])
            rec["why"] = f"Recommended because you expressed strong interest in {words_str} and related domain capabilities."

    return {
        "user_query": user_input_text,
        "recommendations": top_recommendations
    }
