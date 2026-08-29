import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import OnboardingPage from './pages/OnboardingPage';
import AnalysisPage from './pages/AnalysisPage';
import RoadmapPage from './pages/RoadmapPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  // Restore active page or default to landing
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('pathai_active_page') || 'landing';
  });

  const [prefilledRole, setPrefilledRole] = useState(() => {
    return localStorage.getItem('pathai_prefilled_role') || '';
  });

  // Restore user session from localStorage if present
  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('pathai_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      user_id: null,
      profile: null,
      skill_gap: null,
      roadmap_id: null,
      name: ''
    };
  });

  // Restore roadmap data from localStorage
  const [roadmapData, setRoadmapData] = useState(() => {
    const saved = localStorage.getItem('pathai_roadmap_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return null;
  });

  // Sync active page to localStorage
  useEffect(() => {
    localStorage.setItem('pathai_active_page', activePage);
  }, [activePage]);

  // Sync active user to localStorage
  useEffect(() => {
    if (activeUser?.user_id) {
      localStorage.setItem('pathai_active_user', JSON.stringify(activeUser));
    }
  }, [activeUser]);

  // Sync roadmap data to localStorage
  useEffect(() => {
    if (roadmapData?.roadmap_id || roadmapData?.roadmap) {
      localStorage.setItem('pathai_roadmap_data', JSON.stringify(roadmapData));
    }
  }, [roadmapData]);

  // Callback when a career is selected from Career Explorer
  const handleSelectCareerFromExplorer = (selectedRole) => {
    setPrefilledRole(selectedRole);
    localStorage.setItem('pathai_prefilled_role', selectedRole);
    setActivePage('onboarding');
  };

  // Callback when onboarding + skill gap analysis completes
  const handleCompleteOnboarding = (analysisResponse, userProfile) => {
    const updatedUser = {
      user_id: analysisResponse.user_id,
      profile: userProfile,
      skill_gap: analysisResponse.skill_gap,
      name: userProfile.name,
      roadmap_id: activeUser?.roadmap_id || null
    };

    setActiveUser(updatedUser);
    localStorage.setItem('pathai_active_user', JSON.stringify(updatedUser));
    setActivePage('analysis');
  };

  // Callback when AI Roadmap is generated
  const handleGenerateRoadmap = async (roadmap, roadmapId) => {
    const updatedUser = {
      ...activeUser,
      roadmap_id: roadmapId
    };

    setActiveUser(updatedUser);
    localStorage.setItem('pathai_active_user', JSON.stringify(updatedUser));

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/roadmap/${activeUser.user_id}`);
      if (res.ok) {
        const fullData = await res.json();
        setRoadmapData(fullData);
        localStorage.setItem('pathai_roadmap_data', JSON.stringify(fullData));
      } else {
        const fallbackData = { roadmap, stats: { total_tasks: 12, completed_tasks: 0, overall_progress: 0 } };
        setRoadmapData(fallbackData);
        localStorage.setItem('pathai_roadmap_data', JSON.stringify(fallbackData));
      }
    } catch (e) {
      const fallbackData = { roadmap, stats: { total_tasks: 12, completed_tasks: 0, overall_progress: 0 } };
      setRoadmapData(fallbackData);
      localStorage.setItem('pathai_roadmap_data', JSON.stringify(fallbackData));
    }

    setActivePage('roadmap');
  };

  // Callback when a task checkbox is toggled
  const handleProgressUpdate = (taskId, isCompleted, newStats) => {
    if (!roadmapData) return;

    setRoadmapData(prev => {
      if (!prev) return prev;
      const updatedPhases = (prev.roadmap?.phases || []).map(phase => ({
        ...phase,
        tasks: (phase.tasks || []).map(task => {
          if (task.id === taskId) {
            return { ...task, is_completed: isCompleted };
          }
          return task;
        })
      }));

      const updated = {
        ...prev,
        roadmap: {
          ...prev.roadmap,
          phases: updatedPhases
        },
        stats: newStats || prev.stats
      };

      localStorage.setItem('pathai_roadmap_data', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="app-container">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage}
        activeUser={activeUser}
      />

      <main className="main-content">
        {activePage === 'landing' && (
          <LandingPage 
            onStartOnboarding={() => setActivePage('onboarding')} 
            onOpenExplorer={() => setActivePage('explorer')}
          />
        )}

        {activePage === 'explorer' && (
          <CareerExplorerPage 
            onSelectCareer={handleSelectCareerFromExplorer}
          />
        )}

        {activePage === 'onboarding' && (
          <OnboardingPage 
            onCompleteOnboarding={handleCompleteOnboarding} 
            prefilledRole={prefilledRole}
          />
        )}

        {activePage === 'analysis' && (
          <AnalysisPage 
            activeUser={activeUser} 
            onGenerateRoadmap={handleGenerateRoadmap}
          />
        )}

        {activePage === 'roadmap' && (
          <RoadmapPage 
            roadmapData={roadmapData}
            activeUser={activeUser}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage 
            activeUser={activeUser}
            roadmapData={roadmapData}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#64748B',
        fontSize: '0.85rem'
      }}>
        <p>© 2026 PathAI Multi-Career Learning Roadmap Platform</p>
      </footer>
    </div>
  );
}
