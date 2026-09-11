import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Briefcase, Award, Clock, Calendar, FileText, 
  Plus, X, Upload, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export default function OnboardingPage({ onCompleteOnboarding, prefilledRole }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Form State
  const [name, setName] = useState('Developer');
  const [targetRole, setTargetRole] = useState(prefilledRole || 'Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [currentSkills, setCurrentSkills] = useState(['Python', 'Git', 'SQL']);
  const [skillInput, setSkillInput] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [resumeFilename, setResumeFilename] = useState('');

  useEffect(() => {
    if (prefilledRole) {
      setTargetRole(prefilledRole);
    }
  }, [prefilledRole]);

  const popularRoles = [
    "Software Engineer", "AI / ML Engineer", "Data Scientist",
    "Chartered Accountant (CA)", "Corporate Lawyer", "Medical Doctor / Physician",
    "Civil / Mechanical Engineer", "Finance & Investment Analyst",
    "UI/UX Product Designer", "Management Consultant / MBA"
  ];

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setCurrentSkills([...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCurrentSkills(currentSkills.filter(s => s !== skillToRemove));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endswith('.pdf')) {
      alert("Please upload a PDF file.");
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/resume/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error("Resume upload failed");
      const data = await res.json();

      if (data.extracted_skills && data.extracted_skills.length > 0) {
        const merged = Array.from(new Set([...currentSkills, ...data.extracted_skills]));
        setCurrentSkills(merged);
      }
      if (data.filename) {
        setResumeFilename(data.filename);
      }
      alert(`Resume parsed successfully! Extracted ${data.extracted_skills?.length || 0} skills.`);
    } catch (err) {
      console.error(err);
      alert("Error parsing resume PDF.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async () => {
    if (!targetRole.trim()) {
      alert("Please specify your target role.");
      return;
    }

    setSubmitting(true);
    const userProfile = {
      name,
      target_role: targetRole,
      experience_level: experienceLevel,
      current_skills: currentSkills,
      hours_per_week: hoursPerWeek,
      duration_weeks: durationWeeks,
      resume_filename: resumeFilename
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/analyze-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      });

      if (!res.ok) throw new Error("Analysis failed");
      const analysisData = await res.json();
      onCompleteOnboarding(analysisData, userProfile);
    } catch (err) {
      console.error(err);
      alert("Failed to perform AI analysis. Please check backend connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Wizard Header & Progress Bar */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span className="badge badge-purple" style={{ margin: '0 auto' }}>
          <Sparkles size={14} /> Step {currentStep} of 3: AI Roadmap Setup
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Create Your Personalized Roadmap</h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          Fill in your target goal and preferences to calculate your skill-gap analysis.
        </p>

        {/* 3-Step Progress Indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <div className="progress-bar-track" style={{ flex: 1, height: '6px' }}>
            <div className="progress-bar-fill" style={{ width: currentStep >= 1 ? '100%' : '0%' }}></div>
          </div>
          <div className="progress-bar-track" style={{ flex: 1, height: '6px' }}>
            <div className="progress-bar-fill" style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="progress-bar-track" style={{ flex: 1, height: '6px' }}>
            <div className="progress-bar-fill" style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
          </div>
        </div>
      </div>

      {/* STEP 1: TARGET CAREER ROLE */}
      {currentStep === 1 && (
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="#8B5CF6" /> Step 1: Select Your Target Career Goal
          </h2>

          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Career Role or Field</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Type any role... (e.g. AI Engineer, Chartered Accountant, Lawyer, Doctor)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          {/* Popular Career Quick Pills */}
          <div>
            <label className="form-label" style={{ fontSize: '0.82rem', color: '#64748B' }}>OR PICK FROM POPULAR FIELDS:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
              {popularRoles.map((role, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`badge ${targetRole === role ? 'badge-purple' : 'badge-blue'}`}
                  style={{ cursor: 'pointer', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => setCurrentStep(2)}>
              Next: Skills & Resume <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SKILLS & RESUME PDF UPLOAD */}
      {currentStep === 2 && (
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#3B82F6" /> Step 2: What Do You Already Know?
          </h2>

          {/* PDF Resume Dropzone */}
          <div style={{
            border: '2px dashed rgba(139, 92, 246, 0.4)',
            borderRadius: '14px',
            padding: '1.5rem',
            textAlign: 'center',
            background: 'rgba(139, 92, 246, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Upload size={28} color="#C084FC" />
            <span style={{ fontWeight: 600, color: '#FFF' }}>Upload PDF Resume to Auto-Extract Skills</span>
            <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>PathAI will parse your resume text and fill your existing skills instantly</span>
            
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              id="resume-upload" 
              style={{ display: 'none' }} 
            />
            <label htmlFor="resume-upload" className="btn-secondary" style={{ cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              {uploadingResume ? 'Parsing Resume...' : 'Choose PDF File'}
            </label>
            {resumeFilename && <span style={{ fontSize: '0.78rem', color: '#34D399' }}>✓ Loaded: {resumeFilename}</span>}
          </div>

          {/* Skill Tag Input */}
          <div className="form-group">
            <label className="form-label">Add Your Current Skills Manually</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Python, SQL, Git, Accounting, Communication"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn-secondary" onClick={handleAddSkill}>
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Skill Pills Display */}
          <div>
            <label className="form-label" style={{ fontSize: '0.82rem', color: '#64748B' }}>YOUR ENTERED SKILLS (SKIPPED IN ROADMAP):</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
              {currentSkills.length === 0 ? (
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>No skills added yet.</span>
              ) : (
                currentSkills.map(skill => (
                  <span key={skill} className="badge badge-emerald" style={{ padding: '0.4rem 0.85rem', gap: '0.4rem' }}>
                    ✓ {skill}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)} />
                  </span>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={18} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(3)}>
              Next: Commitment <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EXPERIENCE & TIME COMMITMENT */}
      {currentStep === 3 && (
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#10B981" /> Step 3: Experience Level & Time Commitment
          </h2>

          <div className="form-group">
            <label className="form-label">Current Experience Level</label>
            <select 
              className="form-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (Starting fresh in this field)</option>
              <option value="Intermediate">Intermediate (Have basic concepts)</option>
              <option value="Advanced">Advanced (Looking for specialization)</option>
            </select>
          </div>

          {/* Hours Per Week Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label"><Clock size={16} /> Weekly Time Commitment</label>
              <span style={{ color: '#C084FC', fontWeight: 700 }}>{hoursPerWeek} Hours / Week</span>
            </div>
            <input 
              type="range"
              min="2"
              max="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(int(e.target.value))}
              style={{ width: '100%', accentColor: '#8B5CF6' }}
            />
          </div>

          {/* Target Duration Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label"><Calendar size={16} /> Target Roadmap Duration</label>
              <span style={{ color: '#60A5FA', fontWeight: 700 }}>{durationWeeks} Weeks ({Math.round(durationWeeks / 4)} Months)</span>
            </div>
            <input 
              type="range"
              min="4"
              max="52"
              step="4"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(int(e.target.value))}
              style={{ width: '100%', accentColor: '#3B82F6' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(2)}>
              <ArrowLeft size={18} /> Back
            </button>
            <button 
              className="btn-primary pulse-glow" 
              onClick={handleSubmit}
              disabled={submitting}
              style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
            >
              {submitting ? 'Analyzing Skill Gap...' : 'Perform AI Skill Gap Analysis'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function int(val) {
  return parseInt(val, 10) || 0;
}
