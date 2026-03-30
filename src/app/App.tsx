import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { MapView } from './components/MapView';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';
import { Rewards } from './components/Rewards';
import { ActionSubmission } from './components/ActionSubmission';
import { OpeningPage } from './components/OpeningPage';
import { DashboardTransition } from './components/DashboardTransition';
import { CURRENT_USER, MISSIONS, FEED_ITEMS, User, Mission } from './data';
import { Toaster, toast } from 'sonner';
import Confetti from 'react-confetti';
import { AnimatePresence, motion } from 'motion/react';

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
  const [hasStarted, setHasStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  const [user, setUser] = useState<User>(CURRENT_USER);
  const [missions, setMissions] = useState<Mission[]>(MISSIONS);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    const setViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-vh', `${viewportHeight * 0.01}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.visualViewport?.addEventListener('resize', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.visualViewport?.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  const handleMissionSelect = (mission: Mission) => {
    if (mission.completed) return;
    setSelectedMission(mission);
    setIsSubmissionOpen(true);
  };

  const handleMissionComplete = (missionId: string) => {
    setMissions((prev) => prev.map((mission) =>
      mission.id === missionId ? { ...mission, completed: true } : mission
    ));

    const mission = missions.find((item) => item.id === missionId);
    if (!mission) return;

    setUser((prev) => ({
      ...prev,
      points: prev.points + mission.points,
      streak: prev.streak + 1,
    }));

    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 4500);
  };

  const handleRedeem = (cost: number, itemName: string) => {
    setUser((prev) => ({
      ...prev,
      points: prev.points - cost,
    }));

    toast.success(`Redeemed: ${itemName}`);
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 3500);
  };

  const handleStart = () => {
    setIsStarting(true);
    window.setTimeout(() => {
      setHasStarted(true);
      setIsStarting(false);
    }, 1700);
  };

  const renderCurrentTab = () => {
    if (currentTab === 'home') {
      return (
        <Home
          user={user}
          missions={missions}
          feed={FEED_ITEMS}
          onMissionSelect={handleMissionSelect}
        />
      );
    }

    if (currentTab === 'map') return <MapView />;
    if (currentTab === 'rewards') return <Rewards user={user} onRedeem={handleRedeem} />;
    if (currentTab === 'leaderboard') return <Leaderboard />;
    return <Profile onNavigate={setCurrentTab} />;
  };

  return (
    <div className="bg-neutral-100 ios-app-shell flex justify-center font-sans text-gray-900 selection:bg-emerald-200">
      <Toaster position="top-center" richColors />

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={180}
          recycle={false}
          style={{ position: 'fixed', zIndex: 100 }}
        />
      )}

      <div className="w-full max-w-md bg-white ios-app-shell shadow-2xl overflow-hidden relative flex flex-col">
        {!hasStarted && !isStarting ? (
          <OpeningPage onStart={handleStart} />
        ) : isStarting ? (
          <DashboardTransition />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="h-full"
                >
                  {renderCurrentTab()}
                </motion.div>
              </AnimatePresence>
            </div>

            <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

            <ActionSubmission
              mission={selectedMission}
              isOpen={isSubmissionOpen}
              onClose={() => setIsSubmissionOpen(false)}
              onComplete={handleMissionComplete}
            />
          </>
        )}
      </div>
    </div>
  );
}
