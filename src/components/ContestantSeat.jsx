import React from 'react';
import { Lock, Unlock, Zap, Flame, Shield } from 'lucide-react';

export const ContestantSeat = ({
  seat,
  team,
  onUnlockSeat,
  onSeatClick,
  onTriggerBuzzer,
}) => {
  const isInferno = team === 'inferno';
  const contestant = seat.contestant;
  const isLocked = seat.isLocked;
  const isUnlocking = seat.isUnlocking;

  // Theme styling based on team
  const accentColor = isInferno ? '#f43f5e' : '#38bdf8';
  const jerseyBg = isInferno ? 'bg-gradient-to-b from-rose-600 to-red-800' : 'bg-gradient-to-b from-sky-600 to-blue-800';
  const deskTrimBorder = isInferno ? 'border-rose-500/70' : 'border-sky-500/70';

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Dynamic Action Trigger / State Indicator Above Chair */}
      <div className="absolute -top-10 z-20 transition-all duration-300">
        {isLocked ? (
          <button
            onClick={() => onUnlockSeat(seat.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-300 bg-slate-950/90 border border-amber-400/80 rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Unlock Chair</span>
          </button>
        ) : isUnlocking ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-500/40">
            <Unlock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Summoning Friend...</span>
          </div>
        ) : contestant ? (
          <div 
            onClick={() => onSeatClick(seat)}
            className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-200 shadow cursor-pointer hover:border-amber-400 transition-colors"
          >
            <span className={isInferno ? 'text-rose-400' : 'text-sky-400'}>#{contestant.jerseyNumber}</span>
            <span className="font-medium text-white">{contestant.name.split(' ')[0]}</span>
            {contestant.isBuzzed && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* The Moving Chair Unit (Slides forward when unlocked) */}
      <div
        className={`relative transition-all duration-700 ease-out flex flex-col items-center ${
          isLocked
            ? 'scale-90 translate-y-3 opacity-65 grayscale-[35%]'
            : isUnlocking
            ? 'scale-100 translate-y-0 opacity-100 animate-pulse'
            : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Holographic Lock Ring on Floor when Locked */}
        {isLocked && (
          <div className="absolute -inset-x-3 bottom-4 h-8 rounded-full border-2 border-dashed border-amber-500/50 flex items-center justify-center pointer-events-none animate-pulse">
            <span className="text-[9px] text-amber-400/80 font-mono tracking-wider">SEAT {seat.seatIndex + 1} RESERVED</span>
          </div>
        )}

        {/* Unlock Celebration Glow */}
        {isUnlocking && (
          <div className="absolute -inset-4 rounded-full border-2 border-emerald-400/80 animate-chair-unlock-ring pointer-events-none" />
        )}

        {/* Chair Backrest & Structure SVG */}
        <div className="relative w-28 h-40 lg:w-32 lg:h-44 z-10">
          <svg viewBox="0 0 120 160" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <defs>
              <linearGradient id={`chairBack-${seat.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e222d" />
                <stop offset="60%" stopColor="#12151c" />
                <stop offset="100%" stopColor="#090a0f" />
              </linearGradient>
              <linearGradient id={`chairAccent-${seat.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isInferno ? '#be123c' : '#0369a1'} />
                <stop offset="50%" stopColor={accentColor} />
                <stop offset="100%" stopColor={isInferno ? '#be123c' : '#0369a1'} />
              </linearGradient>
            </defs>

            {/* High Ergonomic Backrest */}
            <path
              d="M 32 10 Q 60 4 88 10 C 95 25, 96 65, 90 95 C 80 102, 40 102, 30 95 C 24 65, 25 25, 32 10 Z"
              fill={`url(#chairBack-${seat.id})`}
              stroke={isLocked ? '#334155' : accentColor}
              strokeWidth={isLocked ? '1.5' : '2'}
            />

            {/* Chair Racing Stripes / Side Bolsters */}
            <path
              d="M 33 22 L 40 22 C 38 55, 38 75, 42 90 L 33 88 Z"
              fill={`url(#chairAccent-${seat.id})`}
              opacity={isLocked ? 0.3 : 0.9}
            />
            <path
              d="M 87 22 L 80 22 C 82 55, 82 75, 78 90 L 87 88 Z"
              fill={`url(#chairAccent-${seat.id})`}
              opacity={isLocked ? 0.3 : 0.9}
            />

            {/* Headrest Pillow with Crown Emblem */}
            <rect x="42" y="14" width="36" height="18" rx="5" fill="#090a0f" stroke={`url(#chairAccent-${seat.id})`} strokeWidth="1" />
            <path d="M 54 23 L 57 20 L 60 23 L 63 20 L 66 23 L 64 26 L 56 26 Z" fill={isLocked ? '#64748b' : '#f59e0b'} />

            {/* Lumbar Cushion */}
            <rect x="44" y="65" width="32" height="16" rx="4" fill="#090a0f" stroke="#1e293b" strokeWidth="1" />

            {/* Contoured Seat Base Cushion */}
            <path
              d="M 22 95 Q 60 90 98 95 L 94 116 Q 60 120 26 116 Z"
              fill="#181c26"
              stroke={isLocked ? '#334155' : accentColor}
              strokeWidth="1.5"
            />

            {/* Chair Armrests (Left & Right) */}
            <path d="M 18 68 L 26 68 L 26 95 L 18 95 Z" fill="#090a0f" stroke="#334155" strokeWidth="1" rx="2" />
            <path d="M 94 68 L 102 68 L 102 95 L 94 95 Z" fill="#090a0f" stroke="#334155" strokeWidth="1" rx="2" />

            {/* Heavy Hydraulic Gas Piston Column (Anchors to ground) */}
            <rect x="56" y="116" width="8" height="22" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <rect x="54" y="122" width="12" height="4" rx="1" fill="#64748b" />

            {/* 5-Star Wheel Base */}
            <g>
              <ellipse cx="60" cy="140" rx="40" ry="10" fill="none" stroke="#334155" strokeWidth="2.5" />
              {/* Star legs */}
              <line x1="60" y1="138" x2="22" y2="142" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="138" x2="98" y2="142" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="138" x2="38" y2="147" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="138" x2="82" y2="147" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              {/* Floor castor wheels */}
              <circle cx="22" cy="143" r="3" fill="#090a0f" />
              <circle cx="98" cy="143" r="3" fill="#090a0f" />
              <circle cx="38" cy="148" r="3" fill="#090a0f" />
              <circle cx="82" cy="148" r="3" fill="#090a0f" />
            </g>
          </svg>

          {/* SEATED CONTESTANT CHARACTER (Firmly anchored into chair) */}
          {contestant && !isLocked && (
            <div 
              onClick={() => onSeatClick(seat)}
              className="absolute inset-x-2 top-3 bottom-9 z-20 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              {/* Character Head with Broadcast Esports Headset */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Hair & Head base */}
                <div className="w-10 h-10 rounded-full bg-amber-200/90 relative overflow-hidden shadow-inner border border-amber-300">
                  {/* Styled Hair */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 rounded-b-md" />
                  {/* Eyes / Face Expression */}
                  <div className="absolute top-4 inset-x-2 flex justify-between px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  </div>
                  {/* Mouth Expression */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-1 bg-rose-700 rounded-full" />
                </div>

                {/* Esports Broadcast Headset with Boom Mic */}
                <div className="absolute -inset-1 rounded-full border-t-4 border-slate-950 pointer-events-none" />
                {/* Left Ear Cushion */}
                <div className="absolute left-0 top-3 w-2.5 h-4 bg-slate-950 rounded-sm border border-slate-700" />
                {/* Right Ear Cushion */}
                <div className="absolute right-0 top-3 w-2.5 h-4 bg-slate-950 rounded-sm border border-slate-700" />
                {/* Boom Mic with status light */}
                <div className="absolute bottom-1 -left-1 w-4 h-0.5 bg-slate-950 -rotate-12 flex items-center justify-end">
                  <div className={`w-1 h-1 rounded-full ${contestant.isBuzzed ? 'bg-amber-400 animate-ping' : 'bg-red-500'}`} />
                </div>
              </div>

              {/* Team Jersey & Seated Torso */}
              <div className={`w-16 h-12 rounded-t-xl ${jerseyBg} border-t-2 ${isInferno ? 'border-rose-400' : 'border-sky-400'} flex flex-col items-center justify-center shadow-lg relative`}>
                {/* Team Insignia & Jersey Number */}
                <div className="flex items-center gap-1">
                  {isInferno ? <Flame className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" /> : <Shield className="w-2.5 h-2.5 text-cyan-200 fill-cyan-200" />}
                  <span className="text-[11px] font-black text-white font-mono tracking-tighter">
                    {contestant.jerseyNumber}
                  </span>
                </div>
                <span className="text-[8px] font-bold uppercase text-white/90 tracking-widest mt-0.5">
                  {contestant.name.split(' ')[0]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chair Base Floor Contact Shadow (Guarantees zero floating) */}
        <div className="w-28 lg:w-32 h-4 chair-base-shadow rounded-full -mt-2 pointer-events-none" />
      </div>

      {/* Individual Desk Buzzer Console Mounted in Front of Player */}
      <div className={`w-20 lg:w-24 h-7 -mt-1 rounded-t-md bg-slate-950/90 border-t border-x ${deskTrimBorder} flex items-center justify-between px-2 shadow-lg z-20`}>
        {contestant ? (
          <>
            <button
              onClick={() => onTriggerBuzzer(contestant.id)}
              title="Hit Buzzer!"
              className={`w-6 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                contestant.isBuzzed
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-110'
                  : 'bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30'
              }`}
            >
              <Zap className="w-2.5 h-2.5 text-white" />
            </button>
            <span className="text-[10px] font-mono font-bold text-amber-300">
              {contestant.score} pts
            </span>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <span className="text-[9px] text-slate-500 font-mono">SEAT {seat.seatIndex + 1}</span>
          </div>
        )}
      </div>
    </div>
  );
};
