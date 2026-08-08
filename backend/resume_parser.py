import re
import os
from pypdf import PdfReader

# Comprehensive taxonomy of technical skills for keyword extraction
SKILL_TAXONOMY = [
    # Languages
    "Python", "JavaScript", "TypeScript", "HTML", "CSS", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "R", "Bash",
    # Frontend
    "React", "Vue.js", "Angular", "Next.js", "Svelte", "Redux", "Tailwind CSS", "Bootstrap", "Webpack", "Vite", "GraphQL", "REST API",
    # Backend & DB
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase",
    # AI / Data Science
    "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "NLP", "LLMs", "LangChain", "Prompt Engineering", "Data Analysis",
    # DevOps & Cloud
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure", "CI/CD", "Git", "GitHub", "Linux", "Terraform", "Nginx"
]

def extract_text_from_pdf(pdf_path):
    """Extract text content from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return ""

def extract_skills_from_text(text):
    """Match text against skill taxonomy to extract recognized technical skills."""
    if not text:
        return []

    found_skills = []
    text_lower = text.lower()

    for skill in SKILL_TAXONOMY:
        # Use regex boundary check for exact word/phrase matching
        skill_escaped = re.escape(skill.lower())
        pattern = rf'(?:^|[\s,.\(\)\[\]/:\-])' + skill_escaped + r'(?:$|[\s,.\(\)\[\]/:\-])'
        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return sorted(list(set(found_skills)))

def parse_resume(pdf_path):
    """Parse resume PDF and return summary info + extracted skills list."""
    text = extract_text_from_pdf(pdf_path)
    skills = extract_skills_from_text(text)
    
    # Infer experience level hint if present
    text_lower = text.lower()
    inferred_exp = "Intermediate"
    if "senior" in text_lower or "lead" in text_lower or "architect" in text_lower or "5+ years" in text_lower or "7+ years" in text_lower:
        inferred_exp = "Advanced"
    elif "intern" in text_lower or "junior" in text_lower or "student" in text_lower or "entry level" in text_lower:
        inferred_exp = "Beginner"

    return {
        "text_preview": text[:300] + ("..." if len(text) > 300 else ""),
        "extracted_skills": skills,
        "inferred_experience": inferred_exp,
        "skill_count": len(skills)
    }
