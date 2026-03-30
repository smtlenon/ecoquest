import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { MapView } from './components/MapView';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';
import { Rewards } from './components/Rewards';
import { ActionSubmission } from './components/ActionSubmission';
import { CURRENT_USER, MISSIONS, FEED_ITEMS, User, Mission } from './data';
import { Toaster, toast } from 'sonner';
import Confetti from 'react-confetti';

// Simple hook for window size if needed
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  
  // Data State
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [missions, setMissions] = useState<Mission[]>(MISSIONS);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();

  const handleMissionSelect = (mission: Mission) => {
    if (mission.completed) return;
    setSelectedMission(mission);
    setIsSubmissionOpen(true);
  };

  const handleMissionComplete = (missionId: string) => {
    // Update mission status
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, completed: true } : m
    ));

    // Update user points
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setUser(prev => ({
        ...prev,
        points: prev.points + mission.points,
        streak: prev.streak + 1 // Simplified streak logic
      }));
      
      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleRedeem = (cost: number, itemName: string) => {
    setUser(prev => ({
      ...prev,
      points: prev.points - cost
    }));
    toast.success(`Redeemed: ${itemName}!`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  if (!hasOnboarded) {
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center font-sans text-gray-900 selection:bg-emerald-200">
        <div className="w-full max-w-md bg-white h-screen shadow-2xl overflow-hidden relative flex flex-col">
          <Onboarding onComplete={() => setHasOnboarded(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen flex justify-center font-sans text-gray-900 selection:bg-emerald-200">
      <Toaster position="top-center" richColors />
      
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} style={{ position: 'fixed', zIndex: 100 }} />}

      <div className="w-full max-w-md bg-white h-screen shadow-2xl overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 relative">
          {currentTab === 'home' && (
            <Home 
              user={user} 
              missions={missions} 
              feed={FEED_ITEMS} 
              onMissionSelect={handleMissionSelect} 
            />
          )}
          {currentTab === 'map' && <MapView />}
          {currentTab === 'rewards' && <Rewards user={user} onRedeem={handleRedeem} />}
          {currentTab === 'leaderboard' && <Leaderboard />}
          {currentTab === 'profile' && <Profile onNavigate={setCurrentTab} />}
        </div>

        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

        <ActionSubmission 
          mission={selectedMission}
          isOpen={isSubmissionOpen}
          onClose={() => setIsSubmissionOpen(false)}
          onComplete={handleMissionComplete}
        />
      </div>
    </div>
  );
}
