import React, { useMemo, useState } from 'react';
import { ClaimedReward, Reward, REWARDS, User } from '../../data';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

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
        <div className="bg-[#1E9E63] rounded-2xl p-4 text-white mb-4">
          <p className="text-3xl font-bold">{user.points.toLocaleString()}</p>
          <p className="text-sm opacity-80">Available points</p>
          <p className="text-xs opacity-60">Earn more by completing Green Challenges</p>
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

      <div className="mt-2 space-y-3 px-4 pb-6 overflow-y-auto h-[calc(100%-180px)]">
        {filteredRewards.map((reward) => {
          const canRedeem = user.points >= reward.points;

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
                <button
                  onClick={() => requestRedeem(reward)}
                  disabled={!canRedeem}
                  className="bg-[#1E9E63] text-white text-xs rounded-full px-3 py-1.5 font-semibold min-h-[44px] min-w-[88px] disabled:opacity-50"
                >
                  Redeem
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
          <div className="absolute inset-0 z-20 bg-black/35 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-3xl bg-white px-5 pt-5 pb-6 shadow-2xl"
            >
              <p className="text-[#1E2A24] text-lg font-semibold text-center">Confirm Redemption</p>
              <p className="mt-4 text-base text-[#1E2A24] font-semibold text-center">{selectedReward.title}</p>
              <p className="mt-2 text-sm text-[#5A6A62] text-center">Cost: {selectedReward.points} points</p>
              <p className="text-sm text-[#5A6A62] text-center">Your points: {user.points}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={confirmRedeem}
                  className="min-h-[44px] rounded-xl bg-[#1E9E63] text-white text-sm font-semibold"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="min-h-[44px] rounded-xl bg-[#DDF5E7] text-[#1E9E63] text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {latestClaim && (
          <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-3xl bg-white px-6 pt-6 pb-6 shadow-2xl"
            >
              <p className="text-[#1E2A24] text-xl font-bold text-center">Redemption Complete</p>
              <p className="mt-4 text-base text-[#1E2A24] font-semibold text-center">{latestClaim.title}</p>
              <p className="mt-3 text-sm text-[#5A6A62] text-center">Claim Code</p>
              <p className="text-xl font-extrabold tracking-wide text-[#1E9E63] text-center">{latestClaim.code}</p>
              <p className="mt-2 text-sm text-[#5A6A62] text-center">Points spent: {latestClaim.pointsSpent}</p>
              <p className="text-sm text-[#5A6A62] text-center">Expires: {new Date(latestClaim.expiresAt).toLocaleDateString()}</p>
              <p className="mt-3 text-sm text-[#5A6A62] text-center">{latestClaim.instructions}</p>

              <button
                onClick={handleSaveCode}
                className="mt-4 w-full min-h-[44px] rounded-xl bg-[#DDF5E7] text-[#1E9E63] text-sm font-semibold"
              >
                {savedClaimId === latestClaim.id ? 'Code Saved' : 'Save Code'}
              </button>

              <button
                onClick={() => setLatestClaim(null)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-[#1E9E63] text-white text-sm font-semibold"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
