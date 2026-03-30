import React, { useMemo, useState } from 'react';
import { ClaimedReward, Reward, REWARDS, User } from '../../data';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { CheckCircle2, Sparkles, Ticket } from 'lucide-react';

interface RewardsProps {
  user: User;
  claimedRewards: ClaimedReward[];
  onRedeem: (reward: Reward) => ClaimedReward | null;
}

type RewardCategoryTab = 'all' | 'food' | 'voucher' | 'merch';

const TAB_LABELS: Record<RewardCategoryTab, string> = {
  all: 'All',
  food: 'Food & Drinks',
  voucher: 'Gift Cards',
  merch: 'Merch',
};

export function Rewards({ user, claimedRewards, onRedeem }: RewardsProps) {
  const [activeTab, setActiveTab] = useState<RewardCategoryTab>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [latestClaim, setLatestClaim] = useState<ClaimedReward | null>(null);
  const [savedClaimId, setSavedClaimId] = useState<string | null>(null);

  const filteredRewards = useMemo(() => {
    if (activeTab === 'all') return REWARDS;
    return REWARDS.filter((reward) => reward.category === activeTab);
  }, [activeTab]);

  const nextReward = useMemo(() => {
    const sortedRewards = [...REWARDS].sort((a, b) => a.points - b.points);
    return sortedRewards.find((reward) => reward.points > user.points) ?? null;
  }, [user.points]);

  const rewardCooldownUntilById = useMemo(() => {
    const cooldownMap = new Map<string, number>();

    for (const claim of claimedRewards) {
      const cooldownUntil = new Date(claim.expiresAt).getTime();
      const existing = cooldownMap.get(claim.rewardId) ?? 0;
      if (cooldownUntil > existing) {
        cooldownMap.set(claim.rewardId, cooldownUntil);
      }
    }

    return cooldownMap;
  }, [claimedRewards]);

  const pointsToNextReward = nextReward ? Math.max(0, nextReward.points - user.points) : 0;
  const progressToNextReward = nextReward ? Math.min(100, Math.max(0, (user.points / nextReward.points) * 100)) : 100;

  const requestRedeem = (reward: Reward) => {
    if (user.points < reward.points) {
      toast.error(`You need ${reward.points - user.points} more points to redeem this.`);
      return;
    }

    setSelectedReward(reward);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;

    const claim = onRedeem(selectedReward);
    if (!claim) {
      toast.error('Could not complete redemption.');
      return;
    }

    setLatestClaim(claim);
    setSavedClaimId(null);
    setSelectedReward(null);
  };

  const handleSaveCode = async () => {
    if (!latestClaim) return;

    const summary = [
      `Reward: ${latestClaim.title}`,
      `Partner: ${latestClaim.partner}`,
      `Claim code: ${latestClaim.code}`,
      `Points spent: ${latestClaim.pointsSpent}`,
      `Expires: ${new Date(latestClaim.expiresAt).toLocaleDateString()}`,
      `Instructions: ${latestClaim.instructions}`,
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        setSavedClaimId(latestClaim.id);
        toast.success('Code details copied to clipboard.');
        return;
      }
    } catch {
      // Fallback below handles blocked clipboard access.
    }

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ecoquest-claim-${latestClaim.code}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setSavedClaimId(latestClaim.id);
    toast.success('Code details saved as a text file.');
  };

  return (
    <div className="relative h-full bg-[#F6F8F6]">
      <div className="px-4 pt-12 pb-2">
        <div className="relative overflow-hidden rounded-3xl p-6 text-white mb-4 bg-[linear-gradient(145deg,#157C4D_0%,#1E9E63_55%,#3ABA7D_100%)] shadow-[0_18px_30px_-16px_rgba(23,138,85,0.65)]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

          <div className="relative flex flex-col gap-3.5">
            <div className="inline-flex w-fit self-start items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold leading-none tracking-wide uppercase text-white">
              Eco Wallet
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-extrabold leading-none tracking-tight text-white">{user.points.toLocaleString()}</p>
              <p className="mt-1 text-sm font-medium text-white/95">Available points</p>
            </div>

            {nextReward ? (
              <div className="rounded-2xl border border-white/25 bg-white/15 p-3.5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3">
                  <p className="text-sm font-semibold leading-5 text-white">Next unlock: {nextReward.title}</p>
                  <p className="text-sm font-semibold leading-5 text-white whitespace-nowrap">{pointsToNextReward.toLocaleString()} pts to go</p>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-black/20">
                  <div
                    className="h-full rounded-full bg-[#F3FFFA] transition-all duration-500"
                    style={{ width: `${progressToNextReward}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-white leading-5">You have enough points to redeem every available reward.</p>
            )}

            <p className="pt-0.5 text-xs text-white/90 leading-4">Earn more by completing Green Challenges</p>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {(Object.keys(TAB_LABELS) as RewardCategoryTab[]).map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={isActive
                    ? 'bg-[#1E9E63] text-white rounded-full px-4 py-1.5 text-sm font-semibold min-h-[44px]'
                    : 'bg-[#DDF5E7] text-[#1E9E63] rounded-full px-4 py-1.5 text-sm min-h-[44px]'}
                >
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-3 px-4 pb-6 overflow-y-auto scrollbar-hide h-[calc(100%-180px)]">
        {filteredRewards.map((reward) => {
          const cooldownUntil = rewardCooldownUntilById.get(reward.id) ?? 0;
          const isOnCooldown = cooldownUntil > Date.now();
          const canRedeem = user.points >= reward.points && !isOnCooldown;

          return (
            <div key={reward.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-[#ececf0]">
              <div className="w-14 h-14 shrink-0 bg-[#DDF5E7] rounded-xl flex items-center justify-center text-2xl">
                {reward.emoji}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#1E2A24] text-sm">{reward.title}</p>
                <p className="text-[#5A6A62] text-xs">{reward.partner}</p>
                <p
                  className="text-[#5A6A62] text-xs mt-1"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {reward.description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-[#1E9E63] font-bold text-sm">🍃 {reward.points} pts</p>
                {isOnCooldown && (
                  <p className="text-[11px] font-medium text-[#5A6A62]">
                    Available {new Date(cooldownUntil).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={() => requestRedeem(reward)}
                  disabled={!canRedeem}
                  className="bg-[#1E9E63] text-white text-xs rounded-full px-3 py-1.5 font-semibold min-h-[44px] min-w-[88px] disabled:opacity-50"
                >
                  {isOnCooldown ? 'Redeemed' : 'Redeem'}
                </button>
              </div>
            </div>
          );
        })}

        {claimedRewards.length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-semibold text-[#1E2A24] mb-2">Claimed Rewards</h3>
            <div className="space-y-2">
              {claimedRewards.slice(0, 5).map((claim) => (
                <div key={claim.id} className="bg-white rounded-xl p-3 border border-[#ececf0]">
                  <p className="text-sm font-semibold text-[#1E2A24]">{claim.title}</p>
                  <p className="text-xs text-[#5A6A62]">Code: {claim.code}</p>
                  <p className="text-xs text-[#5A6A62]">Status: {claim.status}</p>
                  <p className="text-xs text-[#5A6A62]">Expires: {new Date(claim.expiresAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="fixed inset-0 z-20 bg-[#06100A]/65 backdrop-blur-[3px] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white px-5 pt-6 pb-6 shadow-2xl"
            >
              <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#7BE4B3]/25 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 right-[-30px] h-32 w-32 rounded-full bg-[#1E9E63]/15 blur-2xl" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#1E9E63_0%,#39BA7E_100%)]" />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.22, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF8F0] text-[#1E9E63]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-center text-[11px] font-bold tracking-[0.14em] uppercase text-[#1E9E63]">Confirm Redemption</p>
                <p className="mt-2 text-center text-lg font-bold leading-tight text-[#1E2A24]">{selectedReward.title}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.24, ease: 'easeOut' }}
                className="mt-4 rounded-2xl border border-[#D9ECE1] bg-[#F5FBF7] p-3.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5A6A62]">Cost</span>
                  <span className="font-semibold text-[#1E2A24]">{selectedReward.points} points</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[#5A6A62]">Your points</span>
                  <span className="font-semibold text-[#1E2A24]">{user.points.toLocaleString()}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.24, ease: 'easeOut' }}
                className="mt-5 grid grid-cols-2 gap-3"
              >
                <button
                  onClick={confirmRedeem}
                  className="min-h-[44px] rounded-xl bg-[#1E9E63] text-white text-sm font-semibold shadow-[0_10px_20px_-14px_rgba(30,158,99,0.9)]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="min-h-[44px] rounded-xl border border-[#CFECDD] bg-[#EAF8F0] text-[#1E9E63] text-sm font-semibold"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {latestClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="fixed inset-0 z-30 bg-[#06100A]/70 backdrop-blur-[4px] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white px-6 pt-6 pb-6 shadow-2xl"
            >
              <div className="pointer-events-none absolute -top-16 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#7BE4B3]/25 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-24 left-[-28px] h-32 w-32 rounded-full bg-[#1E9E63]/15 blur-2xl" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#1E9E63_0%,#39BA7E_100%)]" />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.22, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF8F0] text-[#1E9E63]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-center text-[11px] font-bold tracking-[0.14em] uppercase text-[#1E9E63]">Redemption Complete</p>
                <p className="mt-2 text-center text-lg font-bold leading-tight text-[#1E2A24]">{latestClaim.title}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.11, duration: 0.24, ease: 'easeOut' }}
                className="mt-4 rounded-2xl border border-[#D9ECE1] bg-[#F5FBF7] p-4"
              >
                <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold uppercase tracking-wide text-[#5A6A62]">
                  <Ticket className="h-3.5 w-3.5" />
                  Claim Code
                </p>
                <p className="mt-1 text-center font-mono text-2xl font-extrabold tracking-[0.08em] text-[#1E9E63]">{latestClaim.code}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.24, ease: 'easeOut' }}
                className="mt-3 rounded-2xl border border-[#E5ECE8] bg-[#FAFCFB] p-3.5 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6A62]">Points spent</span>
                  <span className="font-semibold text-[#1E2A24]">{latestClaim.pointsSpent}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[#5A6A62]">Expires</span>
                  <span className="font-semibold text-[#1E2A24]">{new Date(latestClaim.expiresAt).toLocaleDateString()}</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.22, ease: 'easeOut' }}
                className="mt-3 text-center text-sm leading-5 text-[#5A6A62]"
              >
                {latestClaim.instructions}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.24, ease: 'easeOut' }}
                onClick={handleSaveCode}
                className="mt-4 w-full min-h-[44px] rounded-xl border border-[#CFECDD] bg-[#EAF8F0] text-[#1E9E63] text-sm font-semibold"
              >
                {savedClaimId === latestClaim.id ? 'Code Saved' : 'Save Code'}
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.24, ease: 'easeOut' }}
                onClick={() => setLatestClaim(null)}
                className="mt-3 w-full min-h-[44px] rounded-xl bg-[#1E9E63] text-white text-sm font-semibold shadow-[0_10px_20px_-14px_rgba(30,158,99,0.9)]"
              >
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
