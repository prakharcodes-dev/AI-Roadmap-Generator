import React, { useState } from 'react';
import { 
  ArrowRight, Compass, Sparkles, CheckCircle2, ShieldCheck, 
  Trophy, ChevronRight, User, Map, Flag, Target, 
  BarChart3, Code2, Scale, Stethoscope, Database, 
  Landmark, Rocket, X, Star
} from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
);

export default function LandingPage({ onStartOnboarding, onOpenExplorer, onSelectCareer }) {
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'privacy' | 'contact'

  const popularCareers = [
    {
      id: 'software-ai',
      title: 'Software / AI Engineer',
      role: 'Software Engineer',
      skills: 'CS, Full-Stack, Machine Learning, RAG, Web Dev',
      icon: Code2,
      accentColor: '#7138FF',
      glowColor: 'rgba(113, 56, 255, 0.25)'
    },
    {
      id: 'ca',
      title: 'Chartered Accountant (CA)',
      role: 'Chartered Accountant (CA)',
      skills: 'Taxation, Audit, Accounting Standards, Corporate Law',
      icon: BarChart3,
      accentColor: '#386BFF',
      glowColor: 'rgba(56, 107, 255, 0.25)'
    },
    {
      id: 'lawyer',
      title: 'Lawyer / Legal Practice',
      role: 'Corporate Lawyer',
      skills: 'Statutory Law, Drafting, Court Advocacy, Bar Exam',
      icon: Scale,
      accentColor: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.25)'
    },
    {
      id: 'doctor',
      title: 'Medical Doctor / Healthcare',
      role: 'Medical Doctor / Physician',
      skills: 'Anatomy, Pathology, Clinical Rotations, Licensing',
      icon: Stethoscope,
      accentColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.25)'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      role: 'Data Scientist',
      skills: 'Python, SQL, Machine Learning, Statistics, Deep Learning',
      icon: Database,
      accentColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.25)'
    },
    {
      id: 'finance',
      title: 'Finance & Investment Banking',
      role: 'Finance Analyst',
      skills: 'Valuation, Financial Modeling, CFA, Portfolio Analysis',
      icon: Landmark,
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.25)'
    }
  ];

  const handleCareerCardClick = (role) => {
    if (onSelectCareer) {
      onSelectCareer(role);
    } else if (onStartOnboarding) {
      onStartOnboarding();
    }
  };

  return (
    <div className="homepage-wrapper animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '5rem',
      paddingBottom: '2rem'
    }}>

      {/* ========================================================================= */}
      {/* HERO SECTION (Two-Column) */}
      {/* ========================================================================= */}
      <section className="hero-section" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
        alignItems: 'center',
        gap: '3rem',
        paddingTop: '2.5rem',
        paddingBottom: '1rem',
        position: 'relative'
      }}>
        
        {/* Background Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(113, 56, 255, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 107, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* LEFT COLUMN: Main copy and CTAs */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Small Top Badge */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              background: 'rgba(113, 56, 255, 0.14)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#C084FC',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 0 20px rgba(113, 56, 255, 0.2)'
            }}>
              <Sparkles size={15} color="#A855F7" />
              <span>Plan • Learn • Grow</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.85rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            color: '#FFFFFF'
          }}>
            Your Personalized<br />
            <span style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #7138FF 50%, #386BFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(113, 56, 255, 0.3)'
            }}>
              Career Roadmap
            </span><br />
            in 3 Simple Steps
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.65,
            color: '#A5AEC7',
            maxWidth: '560px'
          }}>
            Choose any career path or explore your options. PathAI extracts your skills, identifies your exact skill gaps, and generates a step-by-step learning roadmap tailored to your timeline.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            paddingTop: '0.75rem'
          }}>
            <button
              onClick={onStartOnboarding}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.95rem 1.95rem',
                fontSize: '1.02rem',
                fontWeight: 700,
                color: '#FFFFFF',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
                boxShadow: '0 8px 28px rgba(113, 56, 255, 0.45)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 34px rgba(113, 56, 255, 0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(113, 56, 255, 0.45)';
              }}
            >
              <span>Create My Roadmap</span>
              <ArrowRight size={19} />
            </button>
          </div>

          {/* Quick reassurance checkmarks */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            paddingTop: '0.5rem',
            color: '#A5AEC7',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="#10B981" />
              <span>Multi-career support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="#10B981" />
              <span>AI gap analysis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="#10B981" />
              <span>Checklists & capstones</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Futuristic 3-Stage Ascending Career Pathway Illustration */}
        <div className="hero-illustration-container" style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Main Glass Illustration Card */}
          <div style={{
            width: '100%',
            maxWidth: '460px',
            background: 'linear-gradient(165deg, rgba(17, 21, 45, 0.95) 0%, rgba(9, 12, 28, 0.98) 100%)',
            border: '1px solid rgba(113, 56, 255, 0.28)',
            borderRadius: '24px',
            padding: '2rem 1.75rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(113, 56, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            {/* Ambient Card Corner Light */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            {/* Top Finish Banner: Your Dream Career Awaits! */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(113, 56, 255, 0.25) 0%, rgba(56, 107, 255, 0.2) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              marginBottom: '1.75rem',
              boxShadow: '0 0 20px rgba(113, 56, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
                }}>
                  <Flag size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    Your Dream Career Awaits!
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#C084FC', fontWeight: 600 }}>
                    Target Achieved • Verified Roadmap
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                color: '#F59E0B'
              }}>
                <Star size={14} fill="#F59E0B" />
                <Star size={14} fill="#F59E0B" />
                <Star size={14} fill="#F59E0B" />
              </div>
            </div>

            {/* Ascending Pathway Visual Container */}
            <div style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              paddingLeft: '0.5rem'
            }}>
              
              {/* Connecting Glowing Laser Track */}
              <div style={{
                position: 'absolute',
                left: '26px',
                top: '25px',
                bottom: '30px',
                width: '3px',
                background: 'linear-gradient(to bottom, #10B981 0%, #386BFF 50%, #7138FF 100%)',
                boxShadow: '0 0 12px rgba(113, 56, 255, 0.7)',
                borderRadius: '3px',
                zIndex: 0
              }} />

              {/* Stage 3: Achieve Your Goals (Top Milestone) */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.9rem 1.1rem',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
                  flexShrink: 0
                }}>
                  <Trophy size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                      3. Achieve Your Goals
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34D399',
                      fontWeight: 700
                    }}>
                      Phase 4
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#A5AEC7', marginTop: '2px' }}>
                    Capstone projects, interview prep & portfolio
                  </div>
                </div>
              </div>

              {/* Stage 2: Get Your Roadmap (Middle Milestone) */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(56, 107, 255, 0.08)',
                border: '1px solid rgba(56, 107, 255, 0.35)',
                padding: '0.9rem 1.1rem',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #386BFF 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 16px rgba(56, 107, 255, 0.5)',
                  flexShrink: 0
                }}>
                  <Map size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                      2. Get Your Roadmap
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      background: 'rgba(56, 107, 255, 0.2)',
                      color: '#60A5FA',
                      fontWeight: 700
                    }}>
                      AI Plan
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#A5AEC7', marginTop: '2px' }}>
                    Curated resources, timelines & weekly checklists
                  </div>
                </div>
              </div>

              {/* Stage 1: Assess Your Skills (Foundation Stage) */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(113, 56, 255, 0.08)',
                border: '1px solid rgba(113, 56, 255, 0.35)',
                padding: '0.9rem 1.1rem',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7138FF 0%, #5B21B6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 16px rgba(113, 56, 255, 0.5)',
                  flexShrink: 0
                }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                      1. Assess Your Skills
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      background: 'rgba(113, 56, 255, 0.2)',
                      color: '#C084FC',
                      fontWeight: 700
                    }}>
                      Step 1
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#A5AEC7', marginTop: '2px' }}>
                    Target role selection & resume or skill input
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Insight Footer */}
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#A5AEC7'
            }}>
              <span>Success Rate: <strong style={{ color: '#10B981' }}>98.4%</strong></span>
              <span>Avg. Completion: <strong style={{ color: '#FFFFFF' }}>12 Weeks</strong></span>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* HOW PATHAI WORKS (3 Horizontally Aligned Cards with Connecting Arrows) */}
      {/* ========================================================================= */}
      <section className="how-it-works-section" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        paddingTop: '1rem'
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.5vw, 2.45rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#FFFFFF'
          }}>
            How PathAI Works
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#A5AEC7',
            marginTop: '0.5rem',
            lineHeight: 1.5
          }}>
            Get your personalized career guide in just a few clicks
          </p>
        </div>

        {/* 3 Step Cards with Connecting Arrows */}
        <div className="how-it-works-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative'
        }}>
          
          {/* Card 1: Choose Your Career */}
          <div className="how-it-works-card" style={{
            background: '#11152D',
            border: '1px solid rgba(113, 56, 255, 0.22)',
            borderRadius: '20px',
            padding: '2.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.25s ease',
            height: '100%',
            position: 'relative'
          }}>
            {/* Top row: Icon & Number Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(113, 56, 255, 0.16)',
                border: '1px solid rgba(113, 56, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A855F7',
                boxShadow: '0 0 20px rgba(113, 56, 255, 0.2)'
              }}>
                <Target size={28} />
              </div>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'rgba(168, 85, 247, 0.35)',
                letterSpacing: '-0.03em'
              }}>
                01
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Choose Your Career
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#A5AEC7', lineHeight: 1.6 }}>
                Select any career field or explore your interests across Engineering, CA, Law, Medicine, Data Science, and Finance.
              </p>
            </div>
          </div>

          {/* Connecting Arrow 1 */}
          <div className="connecting-arrow" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7138FF',
            opacity: 0.75,
            padding: '0 0.25rem'
          }}>
            <ChevronRight size={32} />
          </div>

          {/* Card 2: Analyze Your Profile */}
          <div className="how-it-works-card" style={{
            background: '#11152D',
            border: '1px solid rgba(56, 107, 255, 0.22)',
            borderRadius: '20px',
            padding: '2.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.25s ease',
            height: '100%',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(56, 107, 255, 0.16)',
                border: '1px solid rgba(56, 107, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#386BFF',
                boxShadow: '0 0 20px rgba(56, 107, 255, 0.2)'
              }}>
                <BarChart3 size={28} />
              </div>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'rgba(56, 107, 255, 0.35)',
                letterSpacing: '-0.03em'
              }}>
                02
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Analyze Your Profile
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#A5AEC7', lineHeight: 1.6 }}>
                PathAI evaluates your skills, interests and goals, scoring your role readiness and detecting exact unmastered gaps.
              </p>
            </div>
          </div>

          {/* Connecting Arrow 2 */}
          <div className="connecting-arrow" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#386BFF',
            opacity: 0.75,
            padding: '0 0.25rem'
          }}>
            <ChevronRight size={32} />
          </div>

          {/* Card 3: Get Your Roadmap */}
          <div className="how-it-works-card" style={{
            background: '#11152D',
            border: '1px solid rgba(16, 185, 129, 0.22)',
            borderRadius: '20px',
            padding: '2.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.25s ease',
            height: '100%',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.16)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
              }}>
                <ShieldCheck size={28} />
              </div>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'rgba(16, 185, 129, 0.35)',
                letterSpacing: '-0.03em'
              }}>
                03
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Get Your Roadmap
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#A5AEC7', lineHeight: 1.6 }}>
                Receive a step-by-step 4-phase plan with recommended learning resources, task checklists, and capstone milestones.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* POPULAR CAREER FIELDS (6 Cards in 3-Column Grid) */}
      {/* ========================================================================= */}
      <section className="popular-careers-section" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Section Header with "View All Careers" */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.45rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#FFFFFF'
            }}>
              Popular Career Fields
            </h2>
            <p style={{
              fontSize: '1.02rem',
              color: '#A5AEC7',
              marginTop: '0.4rem'
            }}>
              Explore top career paths and start building your future
            </p>
          </div>

          <button
            onClick={onOpenExplorer}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#FFFFFF',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(113, 56, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
          >
            <span>View All Careers</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 6 Responsive Career Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {popularCareers.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => handleCareerCardClick(c.role)}
                className="career-field-card"
                style={{
                  background: '#11152D',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = c.accentColor;
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0, 0, 0, 0.5), 0 0 25px ${c.glowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35)';
                }}
              >
                {/* Top Section: Large Circular Icon Container */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: c.glowColor,
                    border: `1px solid ${c.accentColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: `0 0 20px ${c.glowColor}`
                  }}>
                    <Icon size={28} color={c.accentColor} />
                  </div>

                  {/* Circular Action Arrow Button */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A5AEC7',
                    transition: 'all 0.2s ease'
                  }}>
                    <ArrowRight size={17} />
                  </div>
                </div>

                {/* Content Section: Title and Skills */}
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '0.45rem'
                  }}>
                    {c.title}
                  </h3>
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#A5AEC7',
                    lineHeight: 1.5
                  }}>
                    {c.skills}
                  </p>
                </div>

                {/* Bottom Sub-Pill */}
                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: c.accentColor,
                  fontWeight: 600
                }}>
                  <span>Build Customized Roadmap</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM CALL-TO-ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="cta-banner-section" style={{
        marginTop: '1rem',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(113, 56, 255, 0.22) 0%, rgba(56, 107, 255, 0.18) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(113, 56, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '20%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '680px'
        }}>
          {/* Glowing Rocket Icon Badge */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 0 25px rgba(113, 56, 255, 0.6)',
            flexShrink: 0
          }}>
            <Rocket size={32} />
          </div>

          <div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Ready to shape your career?
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#A5AEC7',
              marginTop: '0.45rem',
              lineHeight: 1.5
            }}>
              Generate your custom AI learning roadmap now in less than 2 minutes. Free and tailored to your goals.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={onStartOnboarding}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '1.05rem 2.25rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#FFFFFF',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
              boxShadow: '0 8px 30px rgba(113, 56, 255, 0.55)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 38px rgba(113, 56, 255, 0.75)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(113, 56, 255, 0.55)';
            }}
          >
            <span>Create Roadmap</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="homepage-footer" style={{
        marginTop: '1.5rem',
        paddingTop: '2.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        {/* Left: Branding & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(113, 56, 255, 0.4)'
            }}>
              <Sparkles size={16} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              Path<span style={{ color: '#A855F7' }}>AI</span>
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#A5AEC7', fontWeight: 500 }}>
            Multi-Career Roadmap Platform
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            © 2026 PathAI. Empowering lifelong learning with AI-driven guidance.
          </span>
        </div>

        {/* Right: Informational Links & Social Icons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '1rem'
        }}>
          {/* Navigation links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '0.9rem',
            color: '#A5AEC7'
          }}>
            <button
              onClick={() => setActiveModal('about')}
              style={{
                background: 'none',
                border: 'none',
                color: '#A5AEC7',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#A5AEC7'}
            >
              About
            </button>

            <button
              onClick={() => setActiveModal('privacy')}
              style={{
                background: 'none',
                border: 'none',
                color: '#A5AEC7',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#A5AEC7'}
            >
              Privacy
            </button>

            <button
              onClick={() => setActiveModal('contact')}
              style={{
                background: 'none',
                border: 'none',
                color: '#A5AEC7',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#A5AEC7'}
            >
              Contact
            </button>
          </div>

          {/* Social media icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A5AEC7',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.background = 'rgba(113, 56, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#A5AEC7';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <GithubIcon size={18} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A5AEC7',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.background = 'rgba(56, 107, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(56, 107, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#A5AEC7';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <LinkedinIcon size={18} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A5AEC7',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#A5AEC7';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FOOTER INFORMATIONAL MODALS (About, Privacy, Contact) */}
      {/* ========================================================================= */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(165deg, #11152D 0%, #0D1028 100%)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '2.25rem',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8)',
            position: 'relative'
          }}>
            <button
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {activeModal === 'about' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  About PathAI
                </h3>
                <p style={{ color: '#A5AEC7', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  PathAI is an autonomous career roadmap engine designed to help professionals and students across all disciplines — from Software Engineering and AI to Chartered Accountancy, Law, Medicine, and Finance — navigate complex learning journeys.
                </p>
                <p style={{ color: '#A5AEC7', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '0.75rem' }}>
                  Our AI analyzes market demands, pinpoints exact prerequisite gaps, and builds phase-by-phase actionable milestones with verified resources.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  Privacy & Data Security
                </h3>
                <p style={{ color: '#A5AEC7', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  PathAI respects your privacy. All uploaded resumes and skill profiles are processed strictly in-memory or securely stored in your local session.
                </p>
                <p style={{ color: '#A5AEC7', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '0.75rem' }}>
                  We do not sell, scrape, or share your personal career records with external third-party advertisers.
                </p>
              </div>
            )}

            {activeModal === 'contact' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  Contact & Support
                </h3>
                <p style={{ color: '#A5AEC7', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Have questions, feature suggestions, or feedback on your generated roadmap? Reach out to our engineering and career advisor team.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', fontSize: '0.9rem' }}>
                  <div><strong>Email:</strong> support@pathai.dev</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Platform:</strong> PathAI Career Navigator</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
