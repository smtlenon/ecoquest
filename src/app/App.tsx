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
import { AppData, FRESH_USER, HERO_MISSIONS, HERO_USER, Mission, MISSIONS, RewardItem, User } from './data';
import { loadAppData, saveAppData } from './services/appDataService';
import { Toaster, toast } from 'sonner';
import Confetti from 'react-confetti';
import { AnimatePresence, motion } from 'motion/react';

const upsertUserInLeaderboard = (leaderboard: User[], user: User): User[] => {
  const withoutCurrent = leaderboard.filter((entry) => entry.id !== user.id);
  return [user, ...withoutCurrent];
};

const getSavedUser = (): User => {
  try {
    const saved = localStorage.getItem('ecoquest-user');
    return saved ? (JSON.parse(saved) as User) : FRESH_USER;
  } catch {
    return FRESH_USER;
  }
};

const getSavedMissions = (): Mission[] => {
  try {
    const saved = localStorage.getItem('ecoquest-missions');
    return saved ? (JSON.parse(saved) as Mission[]) : MISSIONS;
  } catch {
    return MISSIONS;
  }
};

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
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('ecoquest-onboarded') === 'true';
  });
  const [hasStarted, setHasStarted] = useState(hasOnboarded);
  const [isStarting, setIsStarting] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    let isMounted = true;

    loadAppData()
      .then((loaded) => {
        if (isMounted) {
          const user = getSavedUser();
          const missions = getSavedMissions();

          setAppData({
            ...loaded,
            user,
            missions,
            leaderboard: upsertUserInLeaderboard(loaded.leaderboard, user),
          });
        }
      })
      .catch(() => {
        toast.error('Could not load app data.');
      })
      .finally(() => {
        if (isMounted) {
          setIsDataLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('ecoquest-onboarded', String(hasOnboarded));
  }, [hasOnboarded]);

  useEffect(() => {
    if (!appData) return;
    localStorage.setItem('ecoquest-user', JSON.stringify(appData.user));
  }, [appData?.user]);

  useEffect(() => {
    if (!appData) return;
    localStorage.setItem('ecoquest-missions', JSON.stringify(appData.missions));
  }, [appData?.missions]);

  useEffect(() => {
    if (!appData) return;

    saveAppData(appData).catch(() => {
      toast.error('Failed to save your latest changes.');
    });
  }, [appData]);

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

  const handleMissionComplete = (mission: Mission) => {
    setAppData((prev) => {
      if (!prev) return prev;

      const targetMission = prev.missions.find((item) => item.id === mission.id);
      if (!targetMission || targetMission.completed) {
        return prev;
      }

      const updatedUser = {
        ...prev.user,
        points: prev.user.points + targetMission.points,
        streak: prev.user.streak + 1,
      };

      return {
        ...prev,
        user: updatedUser,
        missions: prev.missions.map((item) =>
          item.id === targetMission.id ? { ...item, completed: true } : item
        ),
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });

    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 4500);
  };

  const handleRedeem = (item: RewardItem) => {
    setAppData((prev) => {
      if (!prev || prev.user.points < item.cost) return prev;

      const updatedUser = {
        ...prev.user,
        points: prev.user.points - item.cost,
      };

      return {
        ...prev,
        user: updatedUser,
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });

    toast.success(`Redeemed: ${item.name}`);
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 3500);
  };

  const canClaimDailyReward = (() => {
    if (!appData?.dailyBonusClaimedAt) return true;

    const claimed = new Date(appData.dailyBonusClaimedAt).toDateString();
    const today = new Date().toDateString();
    return claimed !== today;
  })();

  const handleClaimDailyReward = () => {
    if (!appData) return;
    if (!canClaimDailyReward) {
      toast.info('Daily reward already claimed. Come back tomorrow.');
      return;
    }

    setAppData((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev.user,
        points: prev.user.points + 10,
      };

      return {
        ...prev,
        user: updatedUser,
        dailyBonusClaimedAt: new Date().toISOString(),
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });

    toast.success('Daily reward claimed: +10 points');
  };

  const handleStart = () => {
    setIsStarting(true);
    setHasOnboarded(true);
    window.setTimeout(() => {
      setHasStarted(true);
      setIsStarting(false);
    }, 1700);
  };

  const handleFreshStart = () => {
    localStorage.setItem('ecoquest-user', JSON.stringify(FRESH_USER));
    localStorage.setItem('ecoquest-missions', JSON.stringify(MISSIONS));
    localStorage.removeItem('ecoquest-onboarded');
    window.location.reload();
  };

  const handleHeroState = () => {
    localStorage.setItem('ecoquest-user', JSON.stringify(HERO_USER));
    localStorage.setItem('ecoquest-missions', JSON.stringify(HERO_MISSIONS));
    localStorage.setItem('ecoquest-onboarded', 'true');
    window.location.reload();
  };

  const renderCurrentTab = () => {
    if (!appData) return null;

    if (currentTab === 'home') {
      return (
        <Home
          user={appData.user}
          missions={appData.missions}
          feed={appData.feed}
          onMissionSelect={handleMissionSelect}
        />
      );
    }

    if (currentTab === 'map') return <MapView hotspots={appData.hotspots} />;
    if (currentTab === 'rewards') {
      return (
        <Rewards
          user={appData.user}
          rewards={appData.rewards}
          canClaimDailyReward={canClaimDailyReward}
          onClaimDailyReward={handleClaimDailyReward}
          onRedeem={handleRedeem}
        />
      );
    }
    if (currentTab === 'leaderboard') return <Leaderboard users={appData.leaderboard} />;
    return (
      <Profile
        user={appData.user}
        onNavigate={setCurrentTab}
        onFreshStart={handleFreshStart}
        onHeroState={handleHeroState}
      />
    );
  };

  return (
    <div className="bg-neutral-100 ios-app-shell flex min-h-[100dvh] justify-center font-sans text-gray-900 selection:bg-emerald-200">
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
        ) : isDataLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Loading your data...</p>
          </div>
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
