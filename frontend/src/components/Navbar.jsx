import React, { useState } from 'react';
import { Compass, Sparkles, Map, BarChart3, Home, PlusCircle, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'explorer', label: 'Explore Careers', icon: Compass },
    { id: 'onboarding', label: 'Build Roadmap', icon: PlusCircle },
    { id: 'roadmap', label: 'My Roadmap', icon: Map, disabled: !activeUser?.roadmap_id },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, disabled: !activeUser?.user_id }
  ];

  const handleNavClick = (id, disabled) => {
    if (disabled) return;
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header-container" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 1.25rem',
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto'
    }}>
      <div className="navbar-pill" style={{
        background: 'rgba(13, 16, 40, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(113, 56, 255, 0.22)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 0 20px rgba(113, 56, 255, 0.1)',
        borderRadius: '20px',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease'
      }}>
        {/* Left: Brand Logo & Subtitle */}
        <div 
          onClick={() => setActivePage('landing')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(113, 56, 255, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em', 
              color: '#FFFFFF',
              lineHeight: 1.15
            }}>
              Path<span style={{ color: '#A855F7' }}>AI</span>
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              color: '#A5AEC7', 
              fontWeight: 500, 
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap'
            }}>
              Multi-Career Roadmap Platform
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, isDisabled)}
                disabled={isDisabled}
                title={isDisabled ? (item.id === 'roadmap' ? 'Complete onboarding to generate your roadmap' : 'Complete onboarding to view dashboard') : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '12px',
                  border: isActive 
                    ? '1px solid rgba(168, 85, 247, 0.5)' 
                    : '1px solid transparent',
                  background: isActive 
                    ? 'rgba(113, 56, 255, 0.18)' 
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : (isDisabled ? '#4B5563' : '#A5AEC7'),
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isDisabled ? 0.45 : 1,
                  boxShadow: isActive ? '0 0 15px rgba(113, 56, 255, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isDisabled) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !isDisabled) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#A5AEC7';
                  }
                }}
              >
                <Icon size={15} color={isActive ? '#A855F7' : (isDisabled ? '#4B5563' : '#A5AEC7')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: CTA Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="navbar-cta-btn" 
            onClick={() => setActivePage('onboarding')}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.62rem 1.25rem', 
              fontSize: '0.88rem', 
              fontWeight: 700,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #7138FF 0%, #386BFF 100%)',
              boxShadow: '0 4px 18px rgba(113, 56, 255, 0.4)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(113, 56, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(113, 56, 255, 0.4)';
            }}
          >
            <PlusCircle size={16} />
            <span>Create Roadmap</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-nav-drawer"
          style={{
            marginTop: '0.65rem',
            background: 'rgba(13, 16, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(113, 56, 255, 0.3)',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, isDisabled)}
                disabled={isDisabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(113, 56, 255, 0.25)' : 'transparent',
                  border: isActive ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : (isDisabled ? '#4B5563' : '#A5AEC7'),
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Icon size={18} color={isActive ? '#A855F7' : (isDisabled ? '#4B5563' : '#A5AEC7')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
