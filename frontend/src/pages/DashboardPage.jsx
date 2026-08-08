import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart3, CheckCircle2, Clock, ShieldCheck, Flame, ArrowRight, 
  Layers, Sparkles, Trophy, Calendar, CheckSquare 
} from 'lucide-react';

export default function DashboardPage({ activeUser, roadmapData, onProgressUpdate }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!activeUser?.user_id) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/dashboard/${activeUser.user_id}`);
      if (!res.ok) throw new Error("Dashboard fetch failed");
      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [activeUser, roadmapData]);

  const handleQuickCompleteNextTask = async () => {
    if (!dashboard?.next_task || !activeUser?.roadmap_id) return;

    const task = dashboard.next_task;

    try {
      const res = await fetch('http://127.0.0.1:5000/api/progress/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: activeUser.user_id,
          roadmap_id: activeUser.roadmap_id,
          task_id: task.task_id,
          is_completed: true
        })
      });

      if (!res.ok) throw new Error("Failed to mark task completed");
      const result = await res.json();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });

      onProgressUpdate(task.task_id, true, result.stats);
      fetchDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to mark task complete.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Sparkles size={32} className="pulse-glow" color="#8B5CF6" />
        <p style={{ color: '#94A3B8', marginTop: '1rem' }}>Loading Career Dashboard Analytics...</p>
      </div>
    );
  }

  const overview = dashboard?.overview || {};
  const profile = dashboard?.user_profile || {};
  const nextTask = dashboard?.next_task;
  const phaseStats = dashboard?.phase_stats || [];
  const skills = dashboard?.skill_breakdown || {};

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
            <BarChart3 size={14} /> Real-Time Analytics
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Progress & Performance Dashboard</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Welcome back, <strong style={{ color: '#FFF' }}>{profile.name || 'Developer'}</strong> • Target Role: <strong style={{ color: '#8B5CF6' }}>{profile.target_role}</strong>
          </p>
        </div>
      </div>

      {/* Top Key Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* Metric 1: Overall Progress */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Overall Progress</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#C084FC', lineHeight: 1 }}>{overview.overall_progress}%</span>
            <span style={{ fontSize: '0.82rem', color: '#34D399' }}>Completed</span>
          </div>
          <div className="progress-bar-track" style={{ marginTop: '0.5rem' }}>
            <div className="progress-bar-fill" style={{ width: `${overview.overall_progress}%` }}></div>
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Tasks Completed</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#60A5FA', lineHeight: 1 }}>{overview.completed_tasks}</span>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>/ {overview.total_tasks} Total</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            {overview.total_tasks - overview.completed_tasks} tasks remaining
          </span>
        </div>

        {/* Metric 3: Hours Spent */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Time Invested</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FBBF24', lineHeight: 1 }}>{overview.hours_spent}</span>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Hours</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Based on {profile.hours_per_week} hrs/wk pace</span>
        </div>

        {/* Metric 4: Readiness Score Growth */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Role Readiness</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34D399', lineHeight: 1 }}>{overview.current_readiness}%</span>
            <span style={{ fontSize: '0.82rem', color: '#10B981' }}>+{overview.current_readiness - overview.initial_readiness}% Growth</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Target: 100% Full Readiness</span>
        </div>

      </div>

      {/* Next Up Task Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {nextTask ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-purple"><Flame size={14} /> Next Recommended Task</span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{nextTask.phase_title}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFF' }}>{nextTask.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{nextTask.description}</p>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleQuickCompleteNextTask}
              style={{ padding: '0.85rem 1.5rem', whiteSpace: 'nowrap' }}
            >
              <CheckSquare size={18} /> Mark Task Completed
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Trophy size={36} color="#10B981" />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#34D399' }}>All Tasks Completed!</h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Congratulations! You have completed every task in your AI roadmap!</p>
            </div>
          </div>
        )}
      </div>

      {/* 2 Column Layout: Phase Momentum + Skill Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Phase Momentum Overview */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#8B5CF6" /> Roadmap Phase Momentum
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {phaseStats.map((phase) => (
              <div key={phase.phase_id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: '#E2E8F0' }}>Phase {phase.phase_id}: {phase.title}</span>
                  <span style={{ color: '#C084FC', fontWeight: 700 }}>{phase.progress_percent}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${phase.progress_percent}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>{phase.duration}</span>
                  <span>{phase.completed_tasks} / {phase.total_tasks} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Mastery Breakdown */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#10B981" /> Target Role Skill Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Strong Mastery ({skills.strong?.length || 0} skills)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.strong?.map(s => (
                  <span key={s} className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: '#FBBF24', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Currently Developing ({skills.improve?.length || 0} skills)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.improve?.map(s => (
                  <span key={s} className="badge badge-amber" style={{ fontSize: '0.78rem' }}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: '#F87171', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Target Skills to Master ({skills.missing?.length || 0} skills)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.missing?.map(s => (
                  <span key={s} className="badge badge-rose" style={{ fontSize: '0.78rem' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
