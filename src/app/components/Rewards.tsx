import React from 'react';
import { RewardItem, User } from '../data';
import { Gift, ShoppingBag, Ticket, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface RewardsProps {
  user: User;
  rewards: RewardItem[];
  canClaimDailyReward: boolean;
  onClaimDailyReward: () => void;
  onRedeem: (item: RewardItem) => void;
}

export function Rewards({ user, rewards, canClaimDailyReward, onClaimDailyReward, onRedeem }: RewardsProps) {
  const handleRedeem = (item: RewardItem) => {
    if (user.points >= item.cost) {
      onRedeem(item);
    } else {
      toast.error(`You need ${item.cost - user.points} more points to redeem this!`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-emerald-600 pt-12 pb-8 px-6 text-white rounded-b-3xl shadow-lg relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
             <div>
               <h1 className="text-2xl font-bold">Rewards Shop</h1>
               <p className="text-emerald-100 text-sm">Treat yourself for saving the planet</p>
             </div>
             <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
               <Leaf className="w-4 h-4 text-emerald-100" />
               <span className="font-bold">{user.points} pts</span>
             </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-800">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Daily Reward</p>
                <p className="text-xs text-emerald-100">Claim your +10 login bonus</p>
              </div>
            </div>
            <button
              onClick={onClaimDailyReward}
              className="bg-white text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:bg-gray-200 disabled:text-gray-500"
              disabled={!canClaimDailyReward}
            >
              {canClaimDailyReward ? 'Claim' : 'Claimed'}
            </button>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          Available Items
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {rewards.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mt-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                   <span className="font-bold text-emerald-600">{item.cost} pts</span>
                   <button 
                     onClick={() => handleRedeem(item)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                       user.points >= item.cost 
                         ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                         : "bg-gray-100 text-gray-400 cursor-not-allowed"
                     }`}
                   >
                     Redeem <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
