import React from 'react';
import { User } from '../data';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardProps {
  users: User[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  if (sortedUsers.length < 3) {
    return (
      <div className="flex flex-col h-full bg-gray-50 pb-6 items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Eco Champions</h1>
        <p className="text-gray-500 mt-2">Leaderboard data is still loading. Keep completing missions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-6">
      <div className="bg-emerald-600 pt-12 pb-8 px-6 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold mb-1">Eco Champions</h1>
          <p className="text-emerald-100 text-sm">Top contributors this month</p>
        </div>
        
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center mt-8 gap-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full border-4 border-slate-300 overflow-hidden mb-2 relative">
               <img src={sortedUsers[1].avatar} alt="" className="w-full h-full object-cover" />
               <div className="absolute bottom-0 w-full bg-slate-300 text-slate-800 text-[10px] font-bold text-center">2</div>
             </div>
             <p className="text-xs font-bold text-emerald-100 w-20 text-center truncate">{sortedUsers[1].name}</p>
             <p className="text-sm font-bold">{sortedUsers[1].points}</p>
             <div className="w-16 h-24 bg-emerald-500/50 rounded-t-lg mt-2 flex items-end justify-center pb-2">
               <span className="text-2xl font-bold text-emerald-200">2</span>
             </div>
          </div>
          
          {/* 1st Place */}
          <div className="flex flex-col items-center z-10 -mb-4">
             <div className="relative">
               <Trophy className="w-8 h-8 text-yellow-300 absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-sm" />
               <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 relative shadow-lg shadow-yellow-500/20">
                 <img src={sortedUsers[0].avatar} alt="" className="w-full h-full object-cover" />
               </div>
             </div>
             <p className="text-xs font-bold text-white w-24 text-center truncate">{sortedUsers[0].name}</p>
             <p className="text-lg font-bold text-yellow-300">{sortedUsers[0].points}</p>
             <div className="w-20 h-32 bg-emerald-400 rounded-t-lg mt-2 flex items-end justify-center pb-4 shadow-lg">
               <span className="text-4xl font-bold text-emerald-800">1</span>
             </div>
          </div>
          
          {/* 3rd Place */}
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full border-4 border-orange-300 overflow-hidden mb-2 relative">
               <img src={sortedUsers[2].avatar} alt="" className="w-full h-full object-cover" />
               <div className="absolute bottom-0 w-full bg-orange-300 text-orange-900 text-[10px] font-bold text-center">3</div>
             </div>
             <p className="text-xs font-bold text-emerald-100 w-20 text-center truncate">{sortedUsers[2].name}</p>
             <p className="text-sm font-bold">{sortedUsers[2].points}</p>
             <div className="w-16 h-20 bg-emerald-500/30 rounded-t-lg mt-2 flex items-end justify-center pb-2">
               <span className="text-2xl font-bold text-emerald-200">3</span>
             </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-3">
        {sortedUsers.slice(3).map((user, index) => (
          <div key={user.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-gray-400 font-bold w-6 text-center">{index + 4}</span>
              <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.school}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-600">{user.points}</p>
              <p className="text-[10px] text-gray-400">PTS</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
