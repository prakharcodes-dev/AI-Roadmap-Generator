import React, { useState } from 'react';
import { Sparkles, Upload, Plus, X, ArrowRight, User, Briefcase, Clock, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const SUGGESTED_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "HTML/CSS", "SQL", "Git", "TypeScript",
  "Docker", "AWS", "Machine Learning", "FastAPI", "MongoDB", "PostgreSQL", "Next.js"
];

const TARGET_ROLES = [
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "AI / ML Engineer",
  "DevOps Engineer",
  "Data Engineer"
];

export default function OnboardingPage({ onCompleteOnboarding }) {
  const [name, setName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState(['HTML', 'CSS', 'JavaScript']);
  const [skillInput, setSkillInput] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [durationWeeks, setDurationWeeks] = useState(12);

  // Resume PDF upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || skillInput).trim();
    if (val && !currentSkills.includes(val)) {
      setCurrentSkills([...currentSkills, val]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCurrentSkills(currentSkills.filter((s) => s !== skillToRemove));
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.lowerCase?.endsWith('.pdf') && !file.name.endsWith('.pdf')) {
      alert("Please select a valid PDF file");
      return;
    }

    setResumeFile(file);
    setUploading(true);
    setUploadStatus("Extracting skills from resume PDF...");

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Resume upload failed");

      const data = await res.json();
      const extracted = data.extracted_skills || [];

      if (extracted.length > 0) {
        // Merge extracted skills with current
        const merged = Array.from(new Set([...currentSkills, ...extracted]));
        setCurrentSkills(merged);
        setUploadStatus(`Successfully extracted ${extracted.length} skills from resume!`);
      } else {
        setUploadStatus("PDF parsed. No recognized technical skills detected.");
      }

      if (data.inferred_experience) {
        setExperienceLevel(data.inferred_experience);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("Error parsing PDF resume. Please enter skills manually.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentSkills.length === 0) {
      alert("Please add at least 1 current skill to perform analysis.");
      return;
    }

    const finalRole = targetRole === 'Custom' ? customRole : targetRole;
    if (!finalRole.trim()) {
      alert("Please specify your target role.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim() || 'Tech Innovator',
      experience_level: experienceLevel,
      target_role: finalRole,
      current_skills: currentSkills,
      hours_per_week: hoursPerWeek,
      duration_weeks: durationWeeks,
      resume_filename: resumeFile ? resumeFile.name : ''
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/analyze-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Skill gap analysis request failed");

      const data = await res.json();
      onCompleteOnboarding(data, payload);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server. Make sure Flask API is running on http://127.0.0.1:5000");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> Step 1 of 2: Profile & Goals Setup
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Tell Us About Your Goals</h1>
        <p style={{ color: '#94A3B8', fontSize: '1rem' }}>
          Customize your experience level, skills, and commitment so PathAI can craft your optimal roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Name & Experience Level */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label"><User size={16} color="#8B5CF6" /> Full Name / Alias</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><Briefcase size={16} color="#8B5CF6" /> Current Experience Level</label>
            <select 
              className="form-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (0-1 yrs)</option>
              <option value="Intermediate">Intermediate (1-3 yrs)</option>
              <option value="Advanced">Advanced (3+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Target Role */}
        <div className="form-group">
          <label className="form-label"><Briefcase size={16} color="#3B82F6" /> Target Career Role</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {TARGET_ROLES.map((role) => (
              <div 
                key={role}
                onClick={() => setTargetRole(role)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: targetRole === role ? '1px solid #8B5CF6' : '1px solid var(--bg-card-border)',
                  background: targetRole === role ? 'rgba(139, 92, 246, 0.15)' : 'rgba(11, 15, 23, 0.6)',
                  color: targetRole === role ? '#C084FC' : '#94A3B8',
                  fontWeight: targetRole === role ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {role}
              </div>
            ))}
          </div>
        </div>

        {/* Resume Upload Dropzone */}
        <div className="form-group">
          <label className="form-label" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#10B981" /> Resume PDF Upload (Optional Auto-Fill)
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Parses PDF to extract skills</span>
          </label>

          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            border: '2px dashed rgba(139, 92, 246, 0.3)',
            borderRadius: '14px',
            background: 'rgba(11, 15, 23, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <Upload size={28} color="#C084FC" style={{ marginBottom: '0.5rem' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E2E8F0' }}>
              {resumeFile ? resumeFile.name : 'Drop your resume PDF here or click to browse'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
              {uploading ? 'Processing resume...' : 'Supports .PDF formats up to 10MB'}
            </span>
            <input type="file" accept=".pdf" onChange={handleResumeChange} style={{ display: 'none' }} />
          </label>

          {uploadStatus && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '0.85rem',
              color: '#34D399'
            }}>
              <CheckCircle2 size={16} /> {uploadStatus}
            </div>
          )}
        </div>

        {/* Current Skills Tag Input */}
        <div className="form-group">
          <label className="form-label"><Sparkles size={16} color="#EC4899" /> Current Tech Skills ({currentSkills.length})</label>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input 
              type="text"
              className="form-input"
              placeholder="Type a skill (e.g. PyTorch, Docker, React) and press Enter or Add"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => handleAddSkill()}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>

          {/* Tag Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '40px', padding: '0.5rem', background: 'rgba(11, 15, 23, 0.7)', borderRadius: '12px', border: '1px solid var(--bg-card-border)' }}>
            {currentSkills.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: '#64748B', padding: '0.2rem 0.4rem' }}>No skills added yet. Pick from suggestions below or upload resume.</span>
            ) : (
              currentSkills.map((skill) => (
                <span 
                  key={skill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#E2E8F0',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  {skill}
                  <X 
                    size={14} 
                    color="#94A3B8" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))
            )}
          </div>

          {/* Quick Add Suggestions */}
          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>Quick suggestions:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SUGGESTED_SKILLS.filter(s => !currentSkills.includes(s)).slice(0, 8).map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleAddSkill(skill)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#94A3B8',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hours & Duration Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} color="#F59E0B" /> Weekly Commitment</span>
              <span style={{ color: '#FBBF24', fontWeight: 700 }}>{hoursPerWeek} Hours / Week</span>
            </label>
            <input 
              type="range"
              min="3"
              max="40"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} color="#06B6D4" /> Roadmap Duration</span>
              <span style={{ color: '#67E8F9', fontWeight: 700 }}>{durationWeeks} Weeks ({roundMonths(durationWeeks)} Mo)</span>
            </label>
            <input 
              type="range"
              min="4"
              max="24"
              step="2"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3B82F6', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={submitting}
          style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', borderRadius: '12px', marginTop: '0.5rem' }}
        >
          {submitting ? 'Analyzing Skill Gap...' : 'Analyze Skill Gap & Calculate Readiness'} <ArrowRight size={20} />
        </button>

      </form>
    </div>
  );
}

function roundMonths(weeks) {
  const mo = (weeks / 4).toFixed(1);
  return mo.endsWith('.0') ? mo.slice(0, -2) : mo;
}
