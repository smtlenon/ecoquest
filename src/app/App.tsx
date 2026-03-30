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
import { AnimatePresence, motion } from 'motion/react';
import { clsx } from 'clsx';

const CONFETTI_COLORS = ['#1E9E63', '#DDF5E7', '#FFE7B8', '#178A55', '#FFFFFF'];
const END_CARD_PRE_ROLL_SECONDS = 2;

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

    const completionById = new Map(parsed.map((mission) => [mission.id, mission.completed]));
    const merged = MISSIONS.map((mission) => ({
      ...mission,
      completed: completionById.get(mission.id) ?? mission.completed,
    }));

    localStorage.setItem('ecoquest-missions', JSON.stringify(merged));
    return merged;
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
  const [showEndCard, setShowEndCard] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const celebrationTimersRef = useRef<number[]>([]);
  const endCardTimerRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const scrollTickingRef = useRef(false);

  useEffect(() => {
    return () => {
      celebrationTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      celebrationTimersRef.current = [];
      if (endCardTimerRef.current !== null) {
        window.clearTimeout(endCardTimerRef.current);
        endCardTimerRef.current = null;
      }
    };
  }, []);

  const runCelebration = async (variant: 'redeem' | 'mission') => {
    const module = await import('canvas-confetti');
    const confetti = module.default;

    celebrationTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    celebrationTimersRef.current = [];

    const shoot = (particleCount: number, spread: number, startVelocity: number, origin: { x: number; y: number }) => {
      confetti({
        particleCount,
        spread,
        startVelocity,
        gravity: 0.92,
        ticks: 320,
        scalar: 1.35,
        origin,
        colors: CONFETTI_COLORS,
      });
    };

    if (variant === 'redeem') {
      shoot(46, 220, 74, { x: 0.5, y: 0.72 });
      const followUpA = window.setTimeout(() => shoot(28, 210, 68, { x: 0.28, y: 0.7 }), 220);
      const followUpB = window.setTimeout(() => shoot(28, 210, 68, { x: 0.72, y: 0.7 }), 420);
      const followUpC = window.setTimeout(() => shoot(24, 230, 66, { x: 0.5, y: 0.68 }), 820);
      celebrationTimersRef.current.push(followUpA, followUpB, followUpC);
      return;
    }

    shoot(62, 230, 76, { x: 0.5, y: 0.72 });
    const followUpA = window.setTimeout(() => shoot(36, 210, 66, { x: 0.22, y: 0.66 }), 180);
    const followUpB = window.setTimeout(() => shoot(36, 210, 66, { x: 0.78, y: 0.66 }), 360);
    const followUpC = window.setTimeout(() => shoot(30, 240, 64, { x: 0.5, y: 0.64 }), 900);
    const followUpD = window.setTimeout(() => shoot(26, 240, 62, { x: 0.5, y: 0.62 }), 1400);
    celebrationTimersRef.current.push(followUpA, followUpB, followUpC, followUpD);
  };

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

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !hasStarted || isStarting || isDataLoading) return;

    const SHOW_NAV_DELTA = -3;
    const HIDE_NAV_DELTA = 10;

    lastScrollTopRef.current = Math.max(0, scrollContainer.scrollTop);

    const handleScroll = () => {
      if (scrollTickingRef.current) return;

      scrollTickingRef.current = true;
      window.requestAnimationFrame(() => {
        const currentScrollTop = Math.max(0, scrollContainer.scrollTop);
        const delta = currentScrollTop - lastScrollTopRef.current;

        if (currentScrollTop <= 12) {
          setIsNavHidden(false);
        } else if (delta <= SHOW_NAV_DELTA) {
          setIsNavHidden(false);
        } else if (delta >= HIDE_NAV_DELTA) {
          setIsNavHidden(true);
        }

        lastScrollTopRef.current = currentScrollTop;
        scrollTickingRef.current = false;
      });
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [currentTab, hasStarted, isStarting, isDataLoading]);

  useEffect(() => {
    setIsNavHidden(false);
    lastScrollTopRef.current = Math.max(0, scrollContainerRef.current?.scrollTop ?? 0);
  }, [currentTab]);

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

    celebrationTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    celebrationTimersRef.current = [];
    void runCelebration('mission');
  };

  const handleRedeem = (reward: Reward): ClaimedReward | null => {
    const cooldownClaim = (appData?.claimedRewards ?? []).find(
      (claim) => claim.rewardId === reward.id && new Date(claim.expiresAt).getTime() > Date.now()
    );

    if (cooldownClaim) {
      toast.error(`This reward is on cooldown until ${new Date(cooldownClaim.expiresAt).toLocaleDateString()}.`);
      return null;
    }

    const claim = buildClaimRecord(reward);
    let redeemed = false;

    setAppData((prev: AppData | null) => {
      if (!prev || prev.user.points < reward.points) return prev;

      const hasCooldown = (prev.claimedRewards ?? []).some(
        (item) => item.rewardId === reward.id && new Date(item.expiresAt).getTime() > Date.now()
      );

      if (hasCooldown) {
        return prev;
      }

      redeemed = true;

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

    if (!redeemed) {
      toast.error('Could not complete redemption.');
      return null;
    }

    toast.success(`Redeemed: ${reward.title}`);
    void runCelebration('redeem');

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

  const handleDismissEndCard = () => {
    if (endCardTimerRef.current !== null) {
      window.clearTimeout(endCardTimerRef.current);
      endCardTimerRef.current = null;
    }

    setShowEndCard(false);
  };

  const handleShowEndCard = () => {
    if (endCardTimerRef.current !== null) {
      window.clearTimeout(endCardTimerRef.current);
      endCardTimerRef.current = null;
    }

    setShowEndCard(true);
    endCardTimerRef.current = window.setTimeout(() => {
      setShowEndCard(false);
      endCardTimerRef.current = null;
    }, 10000);
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
          onNavigateToRewards={() => setCurrentTab('rewards')}
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
        onShowEndCard={handleShowEndCard}
      />
    );
  };

  return (
    <div className="bg-neutral-100 ios-app-shell flex min-h-[100dvh] justify-center font-sans text-gray-900 selection:bg-emerald-200">
      <Toaster position="top-center" richColors />

      <AnimatePresence>
        {showEndCard && (
          <motion.button
            type="button"
            onClick={handleDismissEndCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed inset-0 z-[10050] bg-black text-white flex flex-col items-center justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: END_CARD_PRE_ROLL_SECONDS + 0.35, duration: 1.2, ease: 'easeOut' }}
              className="text-5xl font-extrabold tracking-tight"
            >
              EcoQuest
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: END_CARD_PRE_ROLL_SECONDS + 1.1, duration: 1, ease: 'easeOut' }}
              className="mt-4 text-sm tracking-[0.22em] uppercase text-[#DDF5E7]"
            >
              Small Actions. Big Impact.
            </motion.p>
          </motion.button>
        )}
      </AnimatePresence>

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
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 relative">
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

            <div
              className={clsx(
                'overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out',
                isNavHidden ? 'max-h-0 opacity-0 translate-y-4' : 'max-h-28 opacity-100 translate-y-0'
              )}
            >
              <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
            </div>

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
