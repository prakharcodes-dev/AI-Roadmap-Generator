import React from 'react';
import { 
  ArrowRight, Compass, Sparkles, CheckCircle2, ShieldCheck, 
  Layers, Trophy, Briefcase, FileText, Cpu, ChevronRight 
} from 'lucide-react';

export default function LandingPage({ onStartOnboarding, onOpenExplorer }) {
  const quickCareers = [
    { title: "Software / AI Engineer", role: "Software Engineer", desc: "CS, Full-Stack, Machine Learning, RAG, Web Dev" },
    { title: "Chartered Accountant (CA)", role: "Chartered Accountant (CA)", desc: "Taxation, Audit, Accounting Standards, Corporate Law" },
    { title: "Lawyer / Legal Practice", role: "Corporate Lawyer", desc: "Statutory Law, Legal Drafting, Court Advocacy, Bar Exam" },
    { title: "Medical Doctor / Healthcare", role: "Medical Doctor / Physician", desc: "Anatomy, Pathology, Clinical Rotations, Licensing" },
    { title: "Data Scientist", role: "Data Scientist", desc: "Python, SQL, Machine Learning, Statistics, NLP" },
    { title: "Finance & Investment Banking", role: "Finance Analyst", desc: "Valuation, Financial Modeling, CFA, Portfolio" }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="badge badge-purple pulse-glow" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
            <Sparkles size={15} /> Multi-Career AI Learning Roadmap Platform
          </span>
        </div>

        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15 }}>
          Your Personalized Career Roadmap in <span className="gradient-text">3 Simple Steps</span>
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
          Choose any career path or explore your options. PathAI extracts your skills, identifies your exact skill gaps, and generates a step-by-step learning roadmap tailored to your timeline.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <button 
            className="btn-primary" 
            onClick={onStartOnboarding}
            style={{ padding: '1rem 2rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            Create My Roadmap <ArrowRight size={20} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={onOpenExplorer}
            style={{ padding: '1rem 1.8rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            <Compass size={20} color="#8B5CF6" /> Explore Careers (Not Sure?)
          </button>
        </div>

      </section>

      {/* 3-STEP VISUAL HOW-IT-WORKS GUIDE */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>How PathAI Works</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Clear, automated career guidance powered by AI skill-gap analysis</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Step 1 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                1
              </div>
              <span className="badge badge-purple">Setup Profile</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Choose Role & Skills</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Select any career field (Engineering, Law, CA, Medicine, IT, Finance) and enter your current skills or drop a PDF resume.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                2
              </div>
              <span className="badge badge-blue">AI Analysis</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Skill-Gap Analysis</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              PathAI evaluates your role readiness score (%) and separates what you already know from unmastered skills.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                3
              </div>
              <span className="badge badge-emerald">Actionable Path</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Get Personalized Roadmap</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Get a 4-phase structured timeline with task checklists, capstones, and self-critique quality ratings.
            </p>
          </div>

        </div>
      </section>

      {/* QUICK-START POPULAR CAREERS GRID */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Popular Career Fields</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Select a field to pre-fill your onboarding immediately</p>
          </div>
          <button className="btn-secondary" onClick={onOpenExplorer} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            View All Careers <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {quickCareers.map((c, i) => (
            <div 
              key={i} 
              className="glass-card glass-card-interactive" 
              onClick={onStartOnboarding}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{c.title}</h3>
                <ChevronRight size={18} color="#8B5CF6" />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{c.desc}</p>
              <div style={{ marginTop: '0.2rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>Build Roadmap →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
