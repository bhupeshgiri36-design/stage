import React from 'react';
import { X, Flame, Shield, Award, Zap, Sparkles, MessageSquare } from 'lucide-react';

export const HotSeatModal = ({
  isOpen,
  onClose,
  seat,
  onTriggerBuzzer,
  onAdjustScore,
  onAnchorRoastOrPraise,
}) => {
  if (!isOpen || !seat || !seat.contestant) return null;

  const contestant = seat.contestant;
  const isInferno = contestant.team === 'inferno';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-950 border-2 border-amber-500/70 rounded-2xl shadow-2xl shadow-amber-500/30 overflow-hidden">
        {/* Header with Team Color Accent */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isInferno ? 'bg-gradient-to-r from-rose-950/80 to-slate-950 border-rose-500/30' : 'bg-gradient-to-r from-sky-950/80 to-slate-950 border-sky-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg shadow-lg ${
              isInferno ? 'bg-rose-600/30 border-rose-400 text-rose-300' : 'bg-sky-600/30 border-sky-400 text-sky-300'
            }`}>
              #{contestant.jerseyNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white font-display">
                  {contestant.name}
                </h3>
                {isInferno ? <Flame className="w-4 h-4 text-rose-400" /> : <Shield className="w-4 h-4 text-sky-400" />}
              </div>
              <span className="text-xs text-amber-400 font-medium">
                "{contestant.nickname || 'Stage Contender'}" · {contestant.role}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contestant Info Body */}
        <div className="p-6 space-y-5">
          {/* Catchphrase Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Contestant Signature Catchphrase
            </span>
            <p className="text-sm font-semibold text-amber-200 italic">
              "{contestant.catchphrase || 'Champions Tera Bhai!'}"
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Score</span>
              <span className="text-lg font-black font-mono text-amber-300">{contestant.score} PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Stage Team</span>
              <span className={`text-xs font-bold uppercase mt-1 block ${isInferno ? 'text-rose-400' : 'text-sky-400'}`}>
                {isInferno ? 'Team Inferno' : 'Team Titans'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Stage Chair</span>
              <span className="text-xs font-bold text-white mt-1 block font-mono">
                Seat #{contestant.seatIndex + 1}
              </span>
            </div>
          </div>

          {/* Director Actions on Contestant */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Host / Stage Interactions
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onTriggerBuzzer(contestant.id)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Desk Buzzer</span>
              </button>

              <button
                onClick={() => onAdjustScore(contestant.id, 50)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Award +50 Points</span>
              </button>

              <button
                onClick={() => onAnchorRoastOrPraise(contestant.name, true)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Host Hype / Praise</span>
              </button>

              <button
                onClick={() => onAnchorRoastOrPraise(contestant.name, false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                <span>Host Playful Roast</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
