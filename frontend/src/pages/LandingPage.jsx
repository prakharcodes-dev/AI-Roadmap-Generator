import React from 'react';
import { Sparkles, ArrowRight, Target, FileText, CheckCircle2, ShieldCheck, Layers, Award, BarChart } from 'lucide-react';

export default function LandingPage({ onStartOnboarding }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', padding: '1rem 0 3rem 0' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div className="badge badge-purple" style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
          <Sparkles size={14} /> AI-Powered Career Architect — Phase 1 Engine
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
          Transform Your Career Goals Into An <span style={{ background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Actionable AI Roadmap</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '680px', lineHeight: 1.6 }}>
          Stop guessing what to learn next. Upload your resume or select your skills, set your target role, and let our AI analyze your skill gap to generate a personalized step-by-step learning roadmap.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            className="btn-primary pulse-glow" 
            onClick={onStartOnboarding}
            style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            Generate My Roadmap <ArrowRight size={20} />
          </button>
        </div>

        {/* Feature Badges Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', color: '#64748B', fontSize: '0.88rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} color="#10B981" /> PDF Resume Extraction</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="#3B82F6" /> Job Readiness Score</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Award size={16} color="#8B5CF6" /> Real-World Projects</span>
        </div>
      </section>

      {/* Main Flow Overview Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#C084FC" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1. Profile & Resume</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Input your target role, hours per week, and drag-and-drop your resume PDF for instant automated skill detection.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="#60A5FA" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>2. AI Skill-Gap Analysis</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Receive an instant readiness percentage score and categorized breakdown of Strong, To Improve, and Missing skills.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} color="#34D399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>3. Multi-Phase AI Roadmap</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Get a structured vertical roadmap complete with weekly topics, task checklists, hands-on capstones, and curated resources.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart size={24} color="#F472B6" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>4. Live Progress Tracking</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Check off completed tasks, monitor your weekly velocity, track skill mastery growth, and stay motivated on your dashboard.</p>
        </div>
      </section>

      {/* Visual Roadmap Interactive Preview Card */}
      <section className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', background: 'linear-gradient(180deg, rgba(22, 27, 38, 0.9) 0%, rgba(15, 20, 31, 0.9) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-blue">Interactive Preview</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.4rem' }}>What Your AI Roadmap Looks Like</h2>
          </div>
          <button className="btn-primary" onClick={onStartOnboarding}>Build Yours Now <ArrowRight size={18} /></button>
        </div>

        {/* Demo Phase Item */}
        <div style={{
          background: 'rgba(11, 15, 23, 0.7)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#8B5CF6', color: '#FFF', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              Phase 1: Foundations & Core Skill Gaps
            </h4>
            <span className="badge badge-purple">Weeks 1-3 • 10 hrs/wk</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Master core fundamental topics while filling critical prerequisite skill gaps identified by AI analysis.</p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-blue">Topics: React Hooks</span>
            <span className="badge badge-blue">TypeScript Interfaces</span>
            <span className="badge badge-blue">REST API Design</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CheckCircle2 size={18} color="#10B981" />
              <span style={{ fontSize: '0.88rem', textDecoration: 'line-through', color: '#64748B' }}>Configure development workspace & linting rules</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CheckCircle2 size={18} color="#3B82F6" />
              <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>Build responsive component library with TypeScript</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
