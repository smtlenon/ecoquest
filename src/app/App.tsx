import React, { useState, useEffect, useRef } from 'react';
import { Home } from './components/Home';
import { MapView } from './components/MapView';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';
import { Rewards } from './components/Rewards';
import { ActionSubmission } from './components/ActionSubmission';
import { OpeningPage } from './components/OpeningPage';
import { DashboardTransition } from './components/DashboardTransition';
import { AppData, ClaimedReward, FRESH_USER, HERO_MISSIONS, HERO_USER, Mission, MISSIONS, Reward, User } from '../data';
import { loadAppData, saveAppData } from './services/appDataService';
import { Toaster, toast } from 'sonner';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { AnimatePresence, motion } from 'motion/react';

const CONFETTI_COLORS = ['#1E9E63', '#DDF5E7', '#FFE7B8', '#178A55', '#FFFFFF'];

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
    if (!saved) return MISSIONS;

    const parsed = JSON.parse(saved) as Mission[];
    const currentIds = new Set(MISSIONS.map((mission) => mission.id));
    const isCompatible = parsed.length === MISSIONS.length && parsed.every((mission) => currentIds.has(mission.id));

    if (!isCompatible) {
      localStorage.setItem('ecoquest-missions', JSON.stringify(MISSIONS));
      return MISSIONS;
    }

    return parsed;
  } catch {
    return MISSIONS;
  }
};

const buildClaimInstructions = (reward: Reward): string => {
  if (reward.category === 'food') {
    return 'Show this code at the cashier before payment. One-time use only.';
  }

  if (reward.category === 'voucher') {
    return 'Present this code at the customer service counter to redeem your voucher.';
  }

  return 'Show this code to the EcoQuest booth or support team to claim your merch item.';
};

const buildClaimRecord = (reward: Reward): ClaimedReward => {
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 30);

  return {
    id: `claim-${now.getTime()}`,
    rewardId: reward.id,
    title: reward.title,
    partner: reward.partner,
    pointsSpent: reward.points,
    code: `EQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    redeemedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: 'unclaimed',
    instructions: buildClaimInstructions(reward),
  };
};

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
  const [showMissionConfetti, setShowMissionConfetti] = useState(false);
  const [missionConfettiRecycle, setMissionConfettiRecycle] = useState(false);
  const missionConfettiTimersRef = useRef<number[]>([]);

  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize();

  useEffect(() => {
    return () => {
      missionConfettiTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      missionConfettiTimersRef.current = [];
    };
  }, []);

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
            claimedRewards: loaded.claimedRewards ?? [],
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
    setAppData((prev: AppData | null) => {
      if (!prev) return prev;

      const targetMission = prev.missions.find((item: Mission) => item.id === mission.id);
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
        missions: prev.missions.map((item: Mission) =>
          item.id === targetMission.id ? { ...item, completed: true } : item
        ),
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });

    missionConfettiTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    missionConfettiTimersRef.current = [];

    setShowMissionConfetti(true);
    setMissionConfettiRecycle(true);

    const stopEmissionTimer = window.setTimeout(() => {
      setMissionConfettiRecycle(false);
    }, 3000);

    const hideCanvasTimer = window.setTimeout(() => {
      setShowMissionConfetti(false);
    }, 9000);

    missionConfettiTimersRef.current.push(stopEmissionTimer, hideCanvasTimer);
  };

  const handleRedeem = (reward: Reward): ClaimedReward | null => {
    const claim = buildClaimRecord(reward);

    setAppData((prev: AppData | null) => {
      if (!prev || prev.user.points < reward.points) return prev;

      const updatedUser = {
        ...prev.user,
        points: prev.user.points - reward.points,
      };

      return {
        ...prev,
        user: updatedUser,
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
        claimedRewards: [claim, ...(prev.claimedRewards ?? [])],
      };
    });

    toast.success(`Redeemed: ${reward.title}`);
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 3500);

    return claim;
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

  const handleAdjustPoints = (delta: number) => {
    setAppData((prev: AppData | null) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev.user,
        points: Math.max(0, prev.user.points + delta),
      };

      return {
        ...prev,
        user: updatedUser,
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });
  };

  const handleSetPoints = (points: number) => {
    setAppData((prev: AppData | null) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev.user,
        points: Math.max(0, points),
      };

      return {
        ...prev,
        user: updatedUser,
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });
  };

  const handleSetStreak = (streak: number) => {
    setAppData((prev: AppData | null) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev.user,
        streak: Math.max(0, streak),
      };

      return {
        ...prev,
        user: updatedUser,
        leaderboard: upsertUserInLeaderboard(prev.leaderboard, updatedUser),
      };
    });
  };

  const handleResetMissions = () => {
    setAppData((prev: AppData | null) => {
      if (!prev) return prev;

      return {
        ...prev,
        missions: prev.missions.map((mission: Mission) => ({ ...mission, completed: false })),
      };
    });
  };

  const handleResetRedeemedRewards = () => {
    setAppData((prev: AppData | null) => {
      if (!prev) return prev;

      return {
        ...prev,
        rewards: prev.rewards.map((reward: Reward) => ({ ...reward, redeemed: false })),
        claimedRewards: [],
      };
    });
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
          claimedRewards={appData.claimedRewards ?? []}
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
        onAdjustPoints={handleAdjustPoints}
        onSetPoints={handleSetPoints}
        onSetStreak={handleSetStreak}
        onResetMissions={handleResetMissions}
        onResetRedeemedRewards={handleResetRedeemedRewards}
      />
    );
  };

  return (
    <div className="bg-neutral-100 ios-app-shell flex min-h-[100dvh] justify-center font-sans text-gray-900 selection:bg-emerald-200">
      <Toaster position="top-center" richColors />

      {showConfetti && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          numberOfPieces={180}
          recycle={false}
          style={{ position: 'fixed', zIndex: 100 }}
        />
      )}

      {showMissionConfetti && (
        <>
          <Confetti
            width={windowWidth}
            height={windowHeight}
            recycle={missionConfettiRecycle}
            numberOfPieces={480}
            gravity={0.17}
            wind={0.01}
            colors={CONFETTI_COLORS}
            confettiSource={{ x: windowWidth * 0.15, y: 0, w: windowWidth * 0.7, h: 16 }}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
          />
          <Confetti
            width={windowWidth}
            height={windowHeight}
            recycle={missionConfettiRecycle}
            numberOfPieces={260}
            gravity={0.24}
            wind={-0.015}
            colors={['#FFFFFF', '#FFE7B8', '#1E9E63']}
            confettiSource={{ x: windowWidth * 0.25, y: 0, w: windowWidth * 0.5, h: 8 }}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000, opacity: 0.95 }}
          />
        </>
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
