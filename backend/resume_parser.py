import re
import os
from pypdf import PdfReader

# Canonical skill taxonomy mapping (Alias -> Normalized Canonical Name)
SKILL_ALIASES = {
    # Languages
    "python": "Python", "python3": "Python", "py": "Python",
    "javascript": "JavaScript", "js": "JavaScript", "ecmascript": "JavaScript",
    "typescript": "TypeScript", "ts": "TypeScript",
    "html": "HTML", "html5": "HTML",
    "css": "CSS", "css3": "CSS",
    "java": "Java",
    "c++": "C++", "cpp": "C++",
    "c#": "C#", "csharp": "C#",
    "go": "Go", "golang": "Go",
    "rust": "Rust",
    "php": "PHP",
    "ruby": "Ruby",
    "swift": "Swift",
    "kotlin": "Kotlin",
    "sql": "SQL",
    "r": "R",
    "bash": "Bash", "shell": "Bash",

    # Frontend
    "react": "React", "reactjs": "React", "react.js": "React",
    "vue": "Vue.js", "vuejs": "Vue.js", "vue.js": "Vue.js",
    "angular": "Angular", "angularjs": "Angular",
    "next.js": "Next.js", "nextjs": "Next.js",
    "svelte": "Svelte",
    "redux": "Redux",
    "tailwind": "Tailwind CSS", "tailwindcss": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "webpack": "Webpack",
    "vite": "Vite",
    "graphql": "GraphQL",
    "rest api": "REST API", "restful api": "REST API", "rest apis": "REST API",

    # Backend & DB
    "node.js": "Node.js", "nodejs": "Node.js", "node": "Node.js",
    "express": "Express", "expressjs": "Express", "express.js": "Express",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "spring boot": "Spring Boot", "spring": "Spring Boot",
    "postgresql": "PostgreSQL", "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB", "mongo": "MongoDB",
    "redis": "Redis",
    "sqlite": "SQLite",
    "firebase": "Firebase",
    "supabase": "Supabase",

    # AI / Data Science
    "machine learning": "Machine Learning", "ml": "Machine Learning",
    "deep learning": "Deep Learning", "dl": "Deep Learning",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow", "tf": "TensorFlow",
    "scikit-learn": "Scikit-Learn", "scikitlearn": "Scikit-Learn", "sklearn": "Scikit-Learn",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "opencv": "OpenCV",
    "nlp": "NLP", "natural language processing": "NLP",
    "llms": "LLMs", "llm": "LLMs", "large language models": "LLMs",
    "langchain": "LangChain",
    "prompt engineering": "Prompt Engineering",
    "data analysis": "Data Analysis", "data analytics": "Data Analysis",
    "data visualization": "Data Visualization",

    # DevOps & Cloud
    "docker": "Docker",
    "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "aws": "AWS", "amazon web services": "AWS",
    "google cloud": "Google Cloud", "gcp": "Google Cloud",
    "azure": "Azure", "microsoft azure": "Azure",
    "ci/cd": "CI/CD", "cicd": "CI/CD",
    "git": "Git", "github": "Git", "gitlab": "Git",
    "linux": "Linux",
    "terraform": "Terraform",
    "nginx": "Nginx",

    # Finance & Accounting
    "financial accounting": "Financial Accounting", "accounting": "Financial Accounting",
    "taxation": "Taxation", "income tax": "Taxation", "gst": "Taxation",
    "auditing": "Auditing", "audit": "Auditing",
    "corporate law": "Corporate Law",
    "cost accounting": "Cost Accounting", "costing": "Cost Accounting",
    "financial modeling": "Financial Modeling",
    "valuation": "Corporate Valuation",
    "excel": "Financial Modeling", "advanced excel": "Financial Modeling",

    # Law & Legal
    "constitutional law": "Constitutional Law",
    "contract law": "Contract Law", "contracts": "Contract Law",
    "criminal law": "Criminal Law",
    "legal drafting": "Legal Drafting", "drafting": "Legal Drafting",
    "legal research": "Legal Research",

    # Medical & Healthcare
    "anatomy": "Anatomy & Physiology", "physiology": "Anatomy & Physiology",
    "pathology": "Pathology",
    "pharmacology": "Pharmacology",
    "clinical diagnostics": "Clinical Diagnostics",

    # Engineering & Design
    "autocad": "AutoCAD", "cad": "AutoCAD",
    "structural analysis": "Structural Analysis",
    "figma": "Figma",
    "ui design": "UI/UX Design", "ux design": "UI/UX Design", "ui/ux": "UI/UX Design",
    "user research": "User Research",
    "seo": "SEO & Digital Marketing", "digital marketing": "SEO & Digital Marketing"
}

def normalize_skill_name(skill_str):
    """Return the clean canonical skill name if recognized, else title-cased string."""
    if not skill_str or not isinstance(skill_str, str):
        return ""
    clean = skill_str.strip()
    clean_lower = clean.lower()
    return SKILL_ALIASES.get(clean_lower, clean.title())

def extract_text_from_pdf(pdf_path):
    """Extract and sanitize text from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        # Sanitize control characters
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
        return text
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return ""

def extract_skills_from_text(text):
    """Extract recognized technical & professional skills using strict boundary matching."""
    if not text or not text.strip():
        return []

    found_skills = set()
    text_lower = text.lower()

    # Iterate through known aliases and search with word boundaries
    for alias, canonical in SKILL_ALIASES.items():
        # Avoid matching short single/double letter tokens inside words unless strict boundary
        escaped_alias = re.escape(alias)
        # Boundary pattern supporting symbols like C++, C#, .js, etc.
        pattern = r'(?:^|[^\w#+])' + escaped_alias + r'(?:$|[^\w#+])'
        
        if re.search(pattern, text_lower):
            found_skills.add(canonical)

    return sorted(list(found_skills))

def parse_resume(pdf_path):
    """Parse resume PDF and return clean metadata + normalized skills list."""
    text = extract_text_from_pdf(pdf_path)
    skills = extract_skills_from_text(text)
    
    text_lower = text.lower()
    inferred_exp = "Intermediate"
    if any(word in text_lower for word in ["senior", "lead", "architect", "5+ years", "7+ years", "director", "principal"]):
        inferred_exp = "Advanced"
    elif any(word in text_lower for word in ["intern", "junior", "student", "entry level", "fresher", "trainee"]):
        inferred_exp = "Beginner"

    return {
        "text_preview": text[:300].strip() + ("..." if len(text) > 300 else ""),
        "extracted_skills": skills,
        "inferred_experience": inferred_exp,
        "skill_count": len(skills)
    }
