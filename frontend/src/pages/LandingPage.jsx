import React from 'react';
import { Sparkles, ArrowRight, Target, FileText, CheckCircle2, ShieldCheck, Layers, Award, BarChart, Compass, Search } from 'lucide-react';

export default function LandingPage({ onStartOnboarding, onOpenExplorer }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', padding: '1rem 0 3rem 0' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div className="badge badge-purple" style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
          <Sparkles size={14} /> Multi-Career AI Learning Roadmap Platform
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Personalized AI Roadmaps for <span style={{ background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Any Career Field</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '720px', lineHeight: 1.6 }}>
          Whether you aspire to be a Chartered Accountant, Lawyer, Software Engineer, Doctor, Quantitative Analyst, Civil Engineer, or Marketer — PathAI generates tailored domain-appropriate roadmaps, articleship/clinical structures, and task checklists.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            className="btn-primary pulse-glow" 
            onClick={onStartOnboarding}
            style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            Generate My Career Roadmap <ArrowRight size={20} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={onOpenExplorer}
            style={{ padding: '1rem 2rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            <Search size={20} color="#C084FC" /> Explore Careers
          </button>
        </div>

        {/* Feature Badges Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', color: '#64748B', fontSize: '0.88rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} color="#10B981" /> 20+ Career Domains</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="#3B82F6" /> Profession-Specific Roadmaps</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Award size={16} color="#8B5CF6" /> AI Career Explorer</span>
        </div>
      </section>

      {/* Undecided Career Banner */}
      <section className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)' }}>
            <Compass size={28} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>Not Sure Which Career to Pursue?</h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Input your interests, favorite subjects, and strengths to get AI-recommended careers with matching rationales.
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={onOpenExplorer} style={{ padding: '0.85rem 1.6rem' }}>
          Try Career Explorer <Search size={18} />
        </button>
      </section>

      {/* Supported Career Fields Pill Grid */}
      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#E2E8F0' }}>Supported Professional Fields</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
          {[
            "💻 Software & ML", "📊 Data Analytics", "💰 Finance & Investment", "🧾 CA / CS / CMA",
            "⚖️ Law & Legal", "🩺 Medicine & Healthcare", "🏗️ Civil / Mech Engineering", "🧪 Science & Research",
            "📈 Business & MBA", "🎨 UI/UX & Graphic Design", "📢 Digital Marketing", "✍️ Media & Journalism",
            "👨‍🏫 Teaching & Education", "🏛️ Government / Civil Services", "🔬 Biotechnology", "🌐 Cybersecurity"
          ].map((field, idx) => (
            <span key={idx} className="badge badge-purple" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              {field}
            </span>
          ))}
        </div>
      </section>

      {/* Main Flow Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={24} color="#C084FC" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1. Career Discovery</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Discover suitable career recommendations tailored to your favorite subjects, interests, and natural strengths.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="#60A5FA" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>2. Domain Skill-Gap Analysis</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Evaluate your current readiness score against statutory, practical, or technical requirements for your target role.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} color="#34D399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>3. Tailored Roadmap Structure</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Receive a domain-appropriate progression roadmap (Articleship, Bar Exam, Clinical Rotations, CAD projects, or Software).</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart size={24} color="#F472B6" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>4. Real-Time Execution</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Mark off phase tasks, complete practical capstones, and track your job readiness growth on your dashboard.</p>
        </div>
      </section>

    </div>
  );
}
