import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, Search, CheckCircle2, DollarSign } from 'lucide-react';

export default function CareerExplorerPage({ onSelectCareer }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const presetPrompts = [
    "I like coding, mathematics and problem solving",
    "I like finance, stock markets, accounting and numbers",
    "I like law, legal research, debating and contracts",
    "I like medicine, biology, health and helping people",
    "I like design, art, creativity and app interfaces",
    "I like business strategy, management and leadership"
  ];

  const handleSearch = async (queryToUse) => {
    const text = queryToUse !== undefined ? queryToUse : inputText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/career-explorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: text })
      });

      if (!res.ok) throw new Error("Explorer request failed");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze career recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="badge badge-purple">
            <Compass size={14} /> AI Career Discovery Assistant
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Find the Right Career For You</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Describe your favorite subjects, skills, or interests, and PathAI will recommend the top career options with fit explanations.
        </p>
      </div>

      {/* Interactive Input Box & Preset Chips */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text"
            className="form-input"
            placeholder="Type your interests... (e.g. 'I enjoy mathematics, computers and analytical problem solving')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ width: '100%', paddingRight: '130px', fontSize: '1rem', height: '54px' }}
          />
          <button 
            className="btn-primary" 
            onClick={() => handleSearch()}
            disabled={loading}
            style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', padding: '0 1.25rem', borderRadius: '10px' }}
          >
            {loading ? 'Analyzing...' : <><Search size={16} /> Discover</>}
          </button>
        </div>

        {/* Preset Prompt Chips */}
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            OR CLICK A PRESET INTEREST PROMPT:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {presetPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(prompt);
                  handleSearch(prompt);
                }}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem', borderRadius: '8px' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Results List */}
      {recommendations && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Top Recommended Careers For You</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {recommendations.map((item, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-purple">{item.category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <DollarSign size={14} /> {item.salary_range}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>{item.role}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                    <strong>Why this fits:</strong> {item.why}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {item.key_skills?.map((sk, i) => (
                      <span key={i} className="badge badge-blue" style={{ fontSize: '0.75rem' }}>{sk}</span>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn-primary"
                  onClick={() => onSelectCareer(item.role)}
                  style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                >
                  Build Roadmap for {item.role} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
