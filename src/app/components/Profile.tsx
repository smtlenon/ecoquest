import React, { useState } from 'react';
import { Badge, User } from '../../data';
import { Settings, Share2, Award, Zap, Calendar } from 'lucide-react';
import { FilmingControls } from './FilmingControls';

interface ProfileProps {
  user: User;
  onNavigate?: (tab: string) => void;
  onFreshStart: () => void;
  onHeroState: () => void;
  onAdjustPoints: (delta: number) => void;
  onSetPoints: (points: number) => void;
  onSetStreak: (streak: number) => void;
  onResetMissions: () => void;
  onResetRedeemedRewards: () => void;
}

export function Profile({
  user,
  onNavigate,
  onFreshStart,
  onHeroState,
  onAdjustPoints,
  onSetPoints,
  onSetStreak,
  onResetMissions,
  onResetRedeemedRewards,
}: ProfileProps) {
  const [cheatInput, setCheatInput] = useState<string>('');
  const [setPointsInput, setSetPointsInput] = useState<string>('');
  const [setStreakInput, setSetStreakInput] = useState<string>('');
  const [devMessage, setDevMessage] = useState<string | null>(null);

  const showDevMessage = (message: string) => {
    setDevMessage(message);
    window.setTimeout(() => setDevMessage(null), 2000);
  };

  const handleCheatApply = () => {
    const delta = parseInt(cheatInput, 10);
    if (isNaN(delta)) return;

    onAdjustPoints(delta);
    setCheatInput('');
    showDevMessage('✓ Points updated');
  };

  const handleSetPoints = () => {
    const nextPoints = parseInt(setPointsInput, 10);
    if (isNaN(nextPoints)) return;

    onSetPoints(nextPoints);
    setSetPointsInput('');
    showDevMessage('✓ Points set');
  };

  const handleSetStreak = () => {
    const nextStreak = parseInt(setStreakInput, 10);
    if (isNaN(nextStreak)) return;

    onSetStreak(nextStreak);
    setSetStreakInput('');
    showDevMessage('✓ Streak set');
  };

  const handleResetMissions = () => {
    onResetMissions();
    showDevMessage('✓ Missions reset');
  };

  const handleResetRedeemedRewards = () => {
    onResetRedeemedRewards();
    showDevMessage('✓ Redeemed rewards reset');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-6">
      {/* Cover & Profile Header */}
      <div className="bg-white pb-6 rounded-b-3xl shadow-sm">
        <div className="h-32 bg-emerald-100 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-white/50 backdrop-blur-sm rounded-full text-emerald-800 hover:bg-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/50 backdrop-blur-sm rounded-full text-emerald-800 hover:bg-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 relative -mt-12 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-3">{user.name}</h1>
          <p className="text-emerald-600 font-medium text-sm">{user.school}</p>
          <p className="text-gray-500 text-sm mt-1 text-center max-w-xs">{user.bio}</p>
          
          <div className="flex gap-8 mt-6 w-full justify-center">
             <div className="text-center">
               <p className="text-xl font-bold text-gray-900">{user.level}</p>
               <p className="text-xs text-gray-500 uppercase tracking-wide">Level</p>
             </div>
             <div className="w-px bg-gray-200 h-10"></div>
             <div className="text-center">
               <p className="text-xl font-bold text-gray-900">{user.points}</p>
               <p className="text-xs text-gray-500 uppercase tracking-wide">Points</p>
             </div>
             <div className="w-px bg-gray-200 h-10"></div>
             <div className="text-center">
               <p className="text-xl font-bold text-gray-900">{user.streak}</p>
               <p className="text-xs text-gray-500 uppercase tracking-wide">Streak</p>
             </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Badges & Achievements</h2>
          <button className="text-emerald-600 text-sm font-semibold">View All</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {user.badges.map((badge: Badge) => (
            <div key={badge.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
               <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                 {badge.icon}
               </div>
               <div>
                 <p className="font-bold text-gray-800 text-sm">{badge.name}</p>
                 <p className="text-[10px] text-gray-500 line-clamp-1">{badge.description}</p>
               </div>
            </div>
          ))}
          
          {/* Locked Badges Placeholders */}
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 border-dashed flex items-center gap-3 opacity-60">
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
               <Award className="w-5 h-5 text-gray-400" />
             </div>
             <div>
               <p className="font-bold text-gray-600 text-sm">Tree Hugger</p>
               <p className="text-[10px] text-gray-500">Plant 5 trees</p>
             </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 border-dashed flex items-center gap-3 opacity-60">
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
               <Zap className="w-5 h-5 text-gray-400" />
             </div>
             <div>
               <p className="font-bold text-gray-600 text-sm">Energy Saver</p>
               <p className="text-[10px] text-gray-500">Save 100kWh</p>
             </div>
          </div>
        </div>
      </div>

      {/* Rewards Teaser */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white flex justify-between items-center shadow-lg shadow-emerald-200">
           <div>
             <p className="text-emerald-100 text-xs font-bold mb-1">REWARDS SHOP</p>
             <h3 className="font-bold text-lg leading-tight">Redeem your<br/>hard-earned points</h3>
           </div>
           <button 
             onClick={() => onNavigate?.('rewards')}
             className="bg-white text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
           >
             Open Shop
           </button>
        </div>
      </div>

      {/* Stats/Graph Placeholder */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Impact Stats</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-end gap-2 h-32 w-full justify-between px-2">
             {[40, 70, 30, 85, 50, 60, 90].map((h, i) => (
               <div key={i} className="w-full bg-emerald-100 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-1000 group-hover:bg-emerald-600"
                    style={{ height: `${h}%` }}
                  ></div>
               </div>
             ))}
           </div>
           <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium uppercase">
             <span>Mon</span>
             <span>Tue</span>
             <span>Wed</span>
             <span>Thu</span>
             <span>Fri</span>
             <span>Sat</span>
             <span>Sun</span>
           </div>
        </div>
      </div>

      <FilmingControls onFreshStart={onFreshStart} onHeroState={onHeroState} />

      <div className="px-6 mt-8 pt-4 border-t border-dashed border-[#5A6A62]/30">
        <p className="text-xs font-mono text-[#5A6A62]/50 mb-2">Dev Tools</p>
        <p className="text-xs text-[#5A6A62] mb-1">Adjust Points</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={cheatInput}
            onChange={(event) => setCheatInput(event.target.value)}
            className="rounded-lg border border-[#5A6A62]/30 px-3 py-2 text-sm text-[#1E2A24] bg-[#F5FBF4] w-full"
            placeholder="500"
          />
          <button
            type="button"
            onClick={handleCheatApply}
            className="rounded-lg bg-[#5A6A62] text-white text-sm px-4 py-2 font-medium"
          >
            Apply
          </button>
        </div>

        <p className="text-xs text-[#5A6A62] mb-1 mt-3">Set Streak (Exact)</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={setStreakInput}
            onChange={(event) => setSetStreakInput(event.target.value)}
            className="rounded-lg border border-[#5A6A62]/30 px-3 py-2 text-sm text-[#1E2A24] bg-[#F5FBF4] w-full"
            placeholder="7"
          />
          <button
            type="button"
            onClick={handleSetStreak}
            className="rounded-lg bg-[#5A6A62] text-white text-sm px-4 py-2 font-medium"
          >
            Apply
          </button>
        </div>

        <p className="text-xs text-[#5A6A62] mb-1 mt-3">Reset Missions</p>
        <button
          type="button"
          onClick={handleResetMissions}
          className="rounded-lg bg-[#5A6A62] text-white text-sm px-4 py-2 font-medium"
        >
          Mark All Uncompleted
        </button>

        <p className="text-xs text-[#5A6A62] mb-1 mt-3">Reset Redeemed Rewards</p>
        <button
          type="button"
          onClick={handleResetRedeemedRewards}
          className="rounded-lg bg-[#5A6A62] text-white text-sm px-4 py-2 font-medium"
        >
          Clear Redeemed Rewards
        </button>

        {devMessage ? <p className="text-xs text-[#1E9E63] mt-2 font-medium">{devMessage}</p> : null}
      </div>
    </div>
  );
}
