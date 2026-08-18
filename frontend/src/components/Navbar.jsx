import React from 'react';
import { Sparkles, Map, BarChart3, Compass, CheckCircle2, UserCheck, Search } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeUser }) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'explorer', label: 'Career Explorer', icon: Search },
    { id: 'onboarding', label: 'Onboarding', icon: UserCheck },
    { id: 'analysis', label: 'Skill Gap', icon: Sparkles, disabled: !activeUser?.skill_gap },
    { id: 'roadmap', label: 'My Roadmap', icon: Map, disabled: !activeUser?.roadmap_id },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, disabled: !activeUser?.roadmap_id },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setActivePage('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PathAI <span style={{ color: '#8B5CF6', WebkitTextFillColor: '#8B5CF6' }}>Roadmap</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500, letterSpacing: '0.05em' }}>MULTI-CAREER PLATFORM</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && setActivePage(item.id)}
                disabled={isDisabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                  color: isActive ? '#C084FC' : (isDisabled ? '#475569' : '#94A3B8'),
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.86rem',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isDisabled ? 0.5 : 1
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile Pill */}
        <div>
          {activeUser?.name ? (
            <div 
              onClick={() => setActivePage('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>{activeUser.name}</span>
            </div>
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => setActivePage('explorer')}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              Career Explorer <Search size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
