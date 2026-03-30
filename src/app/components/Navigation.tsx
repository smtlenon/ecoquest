import React from 'react';
import { Home, User, Gift } from 'lucide-react';
import { clsx } from 'clsx';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 pb-6 flex justify-center gap-8 items-center z-40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] shrink-0 w-full">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              "flex flex-col items-center gap-1 transition-all duration-300 relative",
              isActive ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <div className={clsx(
              "p-2 rounded-xl transition-all",
              isActive && "bg-emerald-50"
            )}>
              <Icon className={clsx("w-6 h-6", isActive && "fill-current")} />
            </div>
            <span className={clsx("text-[10px] font-medium transition-opacity", isActive ? "opacity-100 font-bold" : "opacity-0 hidden")}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
