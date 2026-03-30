import React from 'react';
import { Hotspot } from '../data';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  hotspots: Hotspot[];
}

export function MapView({ hotspots }: MapViewProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50 pb-6">
      <div className="px-6 pt-12 pb-4 bg-white shadow-sm z-10">
        <h1 className="text-2xl font-bold text-gray-900">Eco Hotspots</h1>
        <p className="text-gray-500">Find cleanup events and recycling centers nearby.</p>
      </div>
      
      <div className="flex-1 relative bg-emerald-50 overflow-hidden">
        {/* Abstract Map Design */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />
        
        {/* River */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-20 text-blue-400 fill-current">
              <path d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z" />
           </svg>
        </div>

        {/* Hotspots */}
        {hotspots.map((spot, i) => (
          <div 
            key={spot.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              top: `${30 + (i * 15)}%`, 
              left: `${20 + (i * 20)}%` 
            }}
          >
            <div className="relative group">
               <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 animate-pulse">
                 <MapPin className="w-6 h-6" />
               </div>
               <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-lg whitespace-nowrap z-20">
                 <p className="font-bold text-sm text-gray-800">{spot.name}</p>
                 <p className="text-xs text-emerald-600 font-medium">{spot.status}</p>
               </div>
            </div>
          </div>
        ))}

        <button className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl flex items-center gap-2 font-bold active:scale-95 transition-transform z-30">
          <Navigation className="w-5 h-5" />
          Navigate
        </button>
      </div>
    </div>
  );
}
