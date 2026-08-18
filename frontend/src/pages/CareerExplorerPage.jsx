import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, Lightbulb, CheckCircle2, DollarSign, Target, Award, Search } from 'lucide-react';

const SAMPLE_QUERIES = [
  "I like mathematics, computers and problem solving.",
  "I enjoy finance, stock markets, accounting and numbers.",
  "I love biology, healthcare, lab experiments and helping people.",
  "I like legal arguments, writing, debating and reading contracts.",
  "I enjoy visual design, art, mobile apps and user interfaces.",
  "I love physics, building structures, AutoCAD and engineering."
];

export default function CareerExplorerPage({ onSelectCareer }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleExplore = async (textToSubmit) => {
    const text = (textToSubmit || inputText).trim();
    if (!text) {
      alert("Please enter your interests, favorite subjects, or strengths.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/career-explorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: text })
      });

      if (!res.ok) throw new Error("Failed to fetch career recommendations");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing career fit. Make sure backend is running on http://127.0.0.1:5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
          <Compass size={14} /> AI Career Explorer & Guidance
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Not Sure Which Career to Choose?</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
          Tell us about your interests, favorite subjects, strengths, and skills you enjoy using. Our AI will analyze your preferences and recommend suitable careers across all professional fields!
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-card" style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={18} color="#8B5CF6" /> Describe Your Interests & Strengths
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. I like mathematics, computers and problem solving. Or: I love biology, healthcare and clinical research..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontSize: '1rem', padding: '1rem' }}
          />
        </div>

        {/* Sample Prompt Chips */}
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Or click a sample preference prompt to test:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SAMPLE_QUERIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(query);
                  handleExplore(query);
                }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94A3B8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                "{query}"
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn-primary pulse-glow"
          onClick={() => handleExplore()}
          disabled={loading}
          style={{ justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', borderRadius: '12px' }}
        >
          {loading ? 'Analyzing Career Options...' : 'Discover My Ideal Career Recommendations'} <Search size={20} />
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF' }}>
              Top Recommended Career Paths ({results.recommendations.length})
            </h2>
            <span style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
              Matched against your profile inputs
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {results.recommendations.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.2rem',
                  position: 'relative',
                  borderTop: idx === 0 ? '3px solid #8B5CF6' : '1px solid var(--glass-border)'
                }}
              >
                {idx === 0 && (
                  <div style={{ position: 'absolute', top: '-12px', right: '16px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                      <Sparkles size={12} /> Top Recommended Match
                    </span>
                  </div>
                )}

                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '0.4rem', fontSize: '0.78rem' }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F1F5F9', marginTop: '0.2rem' }}>
                    {item.role}
                  </h3>
                </div>

                {/* WHY MATCHED CALLOUT BOX */}
                <div style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    💡 Why this matches you:
                  </span>
                  <p style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                    {item.why}
                  </p>
                </div>

                {/* Key Skills & Salary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {item.key_skills.map((skill, sIdx) => (
                      <span key={sIdx} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: '0.85rem', color: '#94A3B8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <DollarSign size={15} color="#10B981" /> Est. Compensation: <strong style={{ color: '#F1F5F9' }}>{item.salary_range}</strong>
                    </span>
                  </div>
                </div>

                {/* SELECT & BUILD ROADMAP ACTION */}
                <button
                  className="btn-primary"
                  onClick={() => onSelectCareer(item.role)}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.92rem', borderRadius: '10px', marginTop: 'auto' }}
                >
                  Select & Build Career Roadmap <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
