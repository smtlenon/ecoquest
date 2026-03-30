import React from 'react';
import { User, Mission, FeedItem } from '../data';
import { MissionCard } from './MissionCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Bell, Flame, MapPin, Search } from 'lucide-react';

interface HomeProps {
  user: User;
  missions: Mission[];
  feed: FeedItem[];
  onMissionSelect: (mission: Mission) => void;
}

export function Home({ user, missions, feed, onMissionSelect }: HomeProps) {
  const progress = (user.points % 1000) / 1000 * 100; // Simplified level progress

  return (
    <div className="flex flex-col pb-6 space-y-6">
      {/* Header */}
      <header className="px-6 pt-12 pb-2 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-full border-2 border-emerald-100 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              Lvl {user.level}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Magandang araw,</p>
            <h1 className="text-lg font-bold text-gray-900">{user.name.split(' ')[0]}!</h1>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="p-2 rounded-full bg-orange-50 text-orange-500 flex items-center gap-1">
             <Flame className="w-5 h-5 fill-current" />
             <span className="text-sm font-bold">{user.streak}</span>
           </button>
           <button className="p-2 rounded-full bg-gray-50 text-gray-600 relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </button>
        </div>
      </header>

      {/* Progress Card */}
      <div className="px-6">
        <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-emerald-100 text-xs font-medium mb-1">Total Impact Points</p>
                <h2 className="text-3xl font-bold">{user.points.toLocaleString()}</h2>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-xs font-medium">{1000 - (user.points % 1000)} pts to Level {user.level + 1}</p>
              </div>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-300 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Missions */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Daily Missions</h2>
          <button className="text-emerald-600 text-sm font-semibold">View All</button>
        </div>
        <div className="grid gap-4">
          {missions.map((mission) => (
            <MissionCard 
              key={mission.id} 
              mission={mission} 
              onSelect={onMissionSelect} 
            />
          ))}
        </div>
      </div>

      {/* Community Feed */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Community Activity</h2>
        <div className="flex flex-col gap-4">
          {feed.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
              <img 
                src={item.userAvatar} 
                alt={item.userName} 
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-bold">{item.userName}</span> {item.action}
                </p>
                {item.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                    <span className="mx-1">•</span>
                    {item.timestamp}
                  </div>
                )}
              </div>
              {item.image && (
                 <ImageWithFallback 
                   src={item.image} 
                   alt="Proof"
                   className="w-16 h-16 rounded-lg object-cover" 
                 />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
