import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import OnboardingPage from './pages/OnboardingPage';
import AnalysisPage from './pages/AnalysisPage';
import RoadmapPage from './pages/RoadmapPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [prefilledRole, setPrefilledRole] = useState('');
  
  // User session state
  const [activeUser, setActiveUser] = useState({
    user_id: null,
    profile: null,
    skill_gap: null,
    roadmap_id: null
  });

  const [roadmapData, setRoadmapData] = useState(null);

  // Callback when a career is selected from Career Explorer
  const handleSelectCareerFromExplorer = (selectedRole) => {
    setPrefilledRole(selectedRole);
    setActivePage('onboarding');
  };

  // Callback when onboarding + skill gap analysis completes
  const handleCompleteOnboarding = (analysisResponse, userProfile) => {
    setActiveUser(prev => ({
      ...prev,
      user_id: analysisResponse.user_id,
      profile: userProfile,
      skill_gap: analysisResponse.skill_gap,
      name: userProfile.name
    }));
    setActivePage('analysis');
  };

  // Callback when AI Roadmap is generated
  const handleGenerateRoadmap = async (roadmap, roadmapId) => {
    setActiveUser(prev => ({
      ...prev,
      roadmap_id: roadmapId
    }));

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/roadmap/${activeUser.user_id}`);
      if (res.ok) {
        const fullData = await res.json();
        setRoadmapData(fullData);
      } else {
        setRoadmapData({ roadmap, stats: { total_tasks: 12, completed_tasks: 0, overall_progress: 0 } });
      }
    } catch (e) {
      setRoadmapData({ roadmap, stats: { total_tasks: 12, completed_tasks: 0, overall_progress: 0 } });
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

      return {
        ...prev,
        roadmap: {
          ...prev.roadmap,
          phases: updatedPhases
        },
        stats: newStats || prev.stats
      };
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
