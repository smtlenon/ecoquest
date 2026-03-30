import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Mission } from '../data';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface MissionCardProps {
  mission: Mission;
  onSelect: (mission: Mission) => void;
}

const CATEGORY_LABELS: Record<Mission['category'], string> = {
  waste: 'Waste',
  water: 'Water',
  energy: 'Energy',
  nature: 'Nature',
  community: 'Community',
};

export function MissionCard({ mission, onSelect }: MissionCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(mission)}
      className={clsx(
        "relative flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer",
        mission.completed ? "opacity-75 grayscale-[0.5]" : "hover:shadow-md transition-shadow"
      )}
    >
      <div className="h-32 w-full relative">
        <img 
          src={mission.image} 
          alt={mission.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-emerald-700 shadow-sm">
          +{mission.points} PTS
        </div>
        <div className="absolute top-2 left-2 bg-black/45 backdrop-blur-sm px-2 py-1 rounded-lg text-[11px] font-semibold text-white tracking-wide">
          {CATEGORY_LABELS[mission.category]}
        </div>
      </div>
      
      <div className="p-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-800 leading-tight mb-1">{mission.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{mission.description}</p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {mission.completed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
