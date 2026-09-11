import React from 'react';
import { Compass, Sparkles, Map, BarChart3, Home, PlusCircle } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeUser }) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'explorer', label: 'Explore Careers', icon: Compass },
    { id: 'onboarding', label: 'Build Roadmap', icon: PlusCircle },
    { id: 'roadmap', label: 'My Roadmap', icon: Map, disabled: !activeUser?.roadmap_id },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, disabled: !activeUser?.user_id }
  ];

  return (
    <header style={{
      sticky: 'top',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(9, 13, 22, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.85rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('landing')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={20} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFF' }}>
              Path<span style={{ color: '#C084FC' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500, marginTop: '-3px' }}>
              Multi-Career Roadmap Platform
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  color: isActive ? '#C084FC' : (isDisabled ? '#475569' : '#CBD5E1'),
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isDisabled ? 0.4 : 1
                }}
              >
                <Icon size={16} color={isActive ? '#C084FC' : '#94A3B8'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Call To Action */}
        <div>
          <button 
            className="btn-primary" 
            onClick={() => setActivePage('onboarding')}
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', borderRadius: '10px' }}
          >
            <PlusCircle size={16} /> Create Roadmap
          </button>
        </div>
      </div>
    </header>
  );
}
