import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck, Cpu, Check, X, Info } from 'lucide-react';

export default function AnalysisPage({ activeUser, onGenerateRoadmap }) {
  const [generating, setGenerating] = useState(false);
  const skillGap = activeUser?.skill_gap || {};
  const userProfile = activeUser?.profile || {};

  const strong = skillGap.strong_skills || [];
  const improve = skillGap.improve_skills || [];
  const missing = skillGap.missing_skills || [];
  const readiness = skillGap.readiness_score || 50;

  const getScoreColor = (score) => {
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: activeUser.user_id })
      });

      if (!res.ok) throw new Error("Failed to generate roadmap");

      const data = await res.json();
      onGenerateRoadmap(data.roadmap, data.roadmap_id);
    } catch (err) {
      console.error(err);
      alert("Error generating roadmap. Make sure backend is running on http://127.0.0.1:5000");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
          <ShieldCheck size={14} /> Step 2 of 3: AI Skill-Gap Analysis & Personalization
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Target Role Readiness Score</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem', marginTop: '0.2rem' }}>
          Analysis for <strong style={{ color: '#FFF' }}>{userProfile.name || 'User'}</strong> • Target Role: <strong style={{ color: '#8B5CF6' }}>{userProfile.target_role}</strong>
        </p>
      </div>

      {/* Main Analysis Banner with Readiness Gauge */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(22, 27, 38, 0.9) 0%, rgba(13, 17, 26, 0.95) 100%)'
      }}>
        {/* Readiness Circular Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: `conic-gradient(${getScoreColor(readiness)} ${readiness * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${getScoreColor(readiness)}40`
          }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: '#0B0F17',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: getScoreColor(readiness), lineHeight: 1 }}>
                {readiness}%
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
                Job Readiness
              </span>
            </div>
          </div>
        </div>

        {/* AI Strategic Advice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C084FC', fontWeight: 700, fontSize: '1.1rem' }}>
            <Cpu size={20} /> AI Mentor Personalization Rule
          </div>
          <p style={{ color: '#E2E8F0', fontSize: '0.98rem', lineHeight: 1.6 }}>
            {skillGap.summary || "You possess a solid foundation! Focus on bridging critical missing competencies over your planned duration to achieve full role readiness."}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            fontSize: '0.85rem',
            color: '#60A5FA'
          }}>
            <Info size={16} color="#3B82F6" />
            <span><strong>Skill Skipping Active:</strong> The AI will skip topics you already know and tailor phases exclusively to unmastered skills.</span>
          </div>
        </div>
      </div>

      {/* EXPLICIT SKILL SKIPPING BREAKDOWN CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* WHAT YOU ALREADY KNOW (WILL BE SKIPPED) */}
        <div className="glass-card" style={{ borderTop: '3px solid #10B981', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={20} color="#34D399" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34D399' }}>What You Already Know</h3>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>✓ Skipped in generated roadmap</span>
              </div>
            </div>
            <span className="badge badge-emerald">{strong.length} Skills</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
            {strong.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>No prior skills recorded.</p>
            ) : (
              strong.map(s => (
                <span key={s} className="badge badge-emerald" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                  ✓ {s}
                </span>
              ))
            )}
          </div>
        </div>

        {/* WHAT YOU NEED TO LEARN (MAIN ROADMAP FOCUS) */}
        <div className="glass-card" style={{ borderTop: '3px solid #EF4444', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color="#F87171" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F87171' }}>What You Need to Learn</h3>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>✗ Primary focus of roadmap phases</span>
              </div>
            </div>
            <span className="badge badge-rose">{missing.length} Skills</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
            {missing.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#34D399' }}>All primary skills covered!</p>
            ) : (
              missing.map(s => (
                <span key={s} className="badge badge-rose" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                  ✗ {s}
                </span>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          className="btn-primary pulse-glow" 
          onClick={handleGenerate}
          disabled={generating}
          style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', borderRadius: '14px' }}
        >
          {generating ? 'Generating Personalized AI Roadmap...' : 'Generate My AI Roadmap'} <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
}
