import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Circle, Layers, BookOpen, Rocket, ExternalLink, 
  ChevronDown, ChevronUp, Calendar, Clock, Trophy, Sparkles, AlertCircle 
} from 'lucide-react';

export default function RoadmapPage({ roadmapData, activeUser, onProgressUpdate }) {
  const roadmap = roadmapData?.roadmap || {};
  const phases = roadmap.phases || [];
  const stats = roadmapData?.stats || { total_tasks: 0, completed_tasks: 0, overall_progress: 0 };
  const userProfile = roadmapData?.user_profile || {};

  const [expandedPhases, setExpandedPhases] = useState({ 1: true, 2: true, 3: true, 4: true });
  const [togglingTask, setTogglingTask] = useState(null);

  const togglePhaseExpand = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleTaskToggle = async (taskId, currentCompletedStatus) => {
    if (togglingTask) return;
    setTogglingTask(taskId);

    const newStatus = !currentCompletedStatus;

    try {
      const res = await fetch('http://127.0.0.1:5000/api/progress/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: activeUser.user_id,
          roadmap_id: activeUser.roadmap_id,
          task_id: taskId,
          is_completed: newStatus
        })
      });

      if (!res.ok) throw new Error("Progress update failed");
      const result = await res.json();

      if (newStatus) {
        // Trigger celebratory confetti effect!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8B5CF6', '#3B82F6', '#10B981', '#EC4899']
        });
      }

      onProgressUpdate(taskId, newStatus, result.stats);
    } catch (err) {
      console.error(err);
      alert("Failed to update task progress.");
    } finally {
      setTogglingTask(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2.2rem',
        background: 'linear-gradient(135deg, rgba(22, 27, 38, 0.95) 0%, rgba(15, 20, 31, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={14} /> AI Personalized Roadmap
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{roadmap.title || `${userProfile.target_role} Roadmap`}</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.3rem', maxWidth: '700px' }}>
              {roadmap.overview}
            </p>
          </div>

          <div style={{
            background: 'rgba(11, 15, 23, 0.8)',
            border: '1px solid var(--bg-card-border)',
            padding: '1rem 1.5rem',
            borderRadius: '14px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Completion Progress</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C084FC', lineHeight: 1, marginTop: '0.2rem' }}>
              {stats.overall_progress}%
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{stats.completed_tasks} / {stats.total_tasks} Tasks Done</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="progress-bar-track" style={{ height: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${stats.overall_progress}%` }}></div>
          </div>
        </div>

        {/* Quick Context Tags */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.88rem', color: '#94A3B8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} color="#3B82F6" /> Total Duration: {roadmap.total_weeks} Weeks</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} color="#F59E0B" /> Weekly Commitment: {userProfile.hours_per_week} hrs/wk</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Trophy size={16} color="#10B981" /> 4 Milestones & Capstones</span>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Vertical Timeline Connecting Beam */}
        <div style={{
          position: 'absolute',
          top: '30px',
          bottom: '30px',
          left: '27px',
          width: '3px',
          background: 'linear-gradient(180deg, #8B5CF6 0%, #3B82F6 50%, #10B981 100%)',
          zIndex: 0,
          borderRadius: '2px',
          opacity: 0.5
        }}></div>

        {phases.map((phase) => {
          const isExpanded = expandedPhases[phase.phase_id] ?? true;
          const phaseTasks = phase.tasks || [];
          const phaseCompletedCount = phaseTasks.filter(t => t.is_completed).length;
          const phasePercent = phaseTasks.length > 0 ? Math.round((phaseCompletedCount / phaseTasks.length) * 100) : 0;

          return (
            <div key={phase.phase_id} style={{ position: 'relative', zIndex: 1, paddingLeft: '4.5rem' }}>
              
              {/* Timeline Node Badge */}
              <div style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: phasePercent === 100 ? '#10B981' : (phasePercent > 0 ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)' : '#161B26'),
                border: '3px solid #0B0F17',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#FFF',
                boxShadow: phasePercent > 0 ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none'
              }}>
                {phasePercent === 100 ? <CheckCircle2 size={24} /> : phase.phase_id}
              </div>

              {/* Phase Glass Card */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Phase Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }} onClick={() => togglePhaseExpand(phase.phase_id)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="badge badge-purple">{phase.duration}</span>
                      <span style={{ fontSize: '0.85rem', color: phasePercent === 100 ? '#34D399' : '#94A3B8', fontWeight: 600 }}>
                        {phaseCompletedCount}/{phaseTasks.length} Tasks ({phasePercent}%)
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.3rem' }}>{phase.title}</h2>
                  </div>

                  <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '-0.5rem' }}>
                  {phase.focus}
                </p>

                {isExpanded && (
                  <>
                    {/* Topics Covered */}
                    {phase.topics && phase.topics.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem 1rem', background: 'rgba(11, 15, 23, 0.6)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Key Topics:</span>
                        {phase.topics.map((topic, i) => (
                          <span key={i} className="badge badge-blue" style={{ fontSize: '0.78rem' }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Interactive Task Checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Layers size={16} color="#8B5CF6" /> Actionable Tasks Checklist
                      </h4>

                      {phaseTasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => handleTaskToggle(task.id, task.is_completed)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.85rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: task.is_completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(11, 15, 23, 0.6)',
                            border: task.is_completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--bg-card-border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>
                            {task.is_completed ? (
                              <CheckCircle2 size={22} color="#10B981" />
                            ) : (
                              <Circle size={22} color="#64748B" />
                            )}
                          </div>

                          <div style={{ flex: 1 }}>
                            <h5 style={{ 
                              fontSize: '0.95rem', 
                              fontWeight: 600, 
                              color: task.is_completed ? '#94A3B8' : '#F1F5F9',
                              textDecoration: task.is_completed ? 'line-through' : 'none'
                            }}>
                              {task.title}
                            </h5>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                              {task.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Phase Project Card */}
                    {phase.project && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C084FC', fontWeight: 700 }}>
                          <Rocket size={18} /> Phase Hands-On Project: {phase.project.title}
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
                          {phase.project.description}
                        </p>
                        {phase.project.deliverables && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                            {phase.project.deliverables.map((del, idx) => (
                              <span key={idx} style={{ fontSize: '0.78rem', color: '#94A3B8', background: 'rgba(0, 0, 0, 0.3)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                                ✓ {del}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Curated Resources */}
                    {phase.resources && phase.resources.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <BookOpen size={14} color="#3B82F6" /> Recommended Learning Resources
                        </h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                          {phase.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                color: '#60A5FA',
                                fontSize: '0.82rem',
                                textDecoration: 'none'
                              }}
                            >
                              <span>{res.name}</span>
                              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>({res.type})</span>
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  </>
                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
