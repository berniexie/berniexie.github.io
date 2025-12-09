import React from 'react';
import { Plane } from 'lucide-react';

interface Trip {
  city: string;
  country: string;
  coordinates: [number, number];
  score: number;
  summary?: string;
  isHome?: boolean;
}

interface BoardingPassProps {
  trip: Trip;
  homeTrip?: Trip | null;
}

export const BoardingPass: React.FC<BoardingPassProps> = ({ trip }) => {
  // Barcode simulation - Flipped 90 degrees (Vertical strip)
  const Barcode = () => (
    <div className="flex flex-col items-stretch w-8 h-full gap-[2px] opacity-80">
      {Array.from({ length: 24 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-current" 
          style={{ 
            height: Math.random() > 0.5 ? '2px' : '4px',
            opacity: Math.random() > 0.3 ? 1 : 0.5
          }} 
        />
      ))}
    </div>
  );

  return (
    <div className="glass-card rounded-xl shadow-2xl overflow-hidden w-[380px] h-[160px] relative group transition-colors duration-300 flex flex-row">
      {/* Left Side Decoration (formerly Top) */}
      <div className="w-1.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Main Pass Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1 rounded-full">
              <Plane className="w-3 h-3 text-white transform -rotate-45" />
            </div>
            <span className="font-display font-bold text-white tracking-widest text-xs">HERBERT AIR</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 tracking-[0.2em]">
             BX-{trip.city.length}{Math.floor(trip.score)}X
           </div>
        </div>

        <div className="flex justify-between items-end">
          {/* Destination */}
          <div>
            <div className="text-zinc-500 text-[10px] font-mono mb-0.5">DESTINATION</div>
            <div className="text-3xl font-display font-bold text-white uppercase tracking-wide leading-none">
              {trip.city}
            </div>
            <div className="text-zinc-400 text-[10px] uppercase mt-1">{trip.country}</div>
          </div>

          {/* Rating */}
          <div className="text-right">
             <div className="text-zinc-600 text-[10px] font-mono uppercase mb-0.5">RATING</div>
             <div className="flex items-baseline justify-end gap-1">
               <span className="text-white font-mono font-bold text-2xl">{trip.score}</span>
               <span className="text-zinc-600 text-[10px]">/ 10</span>
             </div>
          </div>
        </div>
      </div>

      {/* Perforated Divider (Vertical) */}
      <div className="relative flex flex-col items-center justify-center h-full">
         <div className="h-full w-[1px] border-l border-dashed border-zinc-700"></div>
         {/* Notches */}
         <div className="absolute top-[-6px] left-[-6px] w-3 h-3 bg-black rounded-full z-10"></div>
         <div className="absolute bottom-[-6px] left-[-6px] w-3 h-3 bg-black rounded-full z-10"></div>
      </div>

      {/* Barcode Section (Stub) */}
      <div className="bg-black/30 w-16 p-2 flex items-center justify-center">
         <div className="text-white/20 h-full py-2">
           <Barcode />
         </div>
      </div>
    </div>
  );
};
