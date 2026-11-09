import React from 'react';
import { Video, Sparkles, Volume2, Mic, Trophy, Zap } from 'lucide-react';
import { ANCHOR_QUICK_LINES } from '../data/defaultContestants.js';

export const DirectorControlBar = ({
  currentCamera,
  onCameraChange,
  lighting,
  onLightingChange,
  currentRound,
  onRoundChange,
  onTriggerAnchorSpeech,
  onPlaySFX,
}) => {
  return (
    <div className="relative z-30 w-full bg-slate-950/95 border-t border-amber-500/30 px-3 lg:px-6 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Group 1: Camera Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <div className="flex items-center gap-1 px-2 text-[10px] uppercase font-bold text-slate-400 font-mono">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Cam</span>
          </div>
          {['wide', 'anchor', 'inferno', 'titans', 'jumbotron', 'lobby'].map((cam) => (
            <button
              key={cam}
              onClick={() => onCameraChange(cam)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                currentCamera === cam
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cam === 'wide' ? 'Arena' : cam === 'anchor' ? 'Anchor' : cam === 'jumbotron' ? 'Screen' : cam}
            </button>
          ))}
        </div>

        {/* Group 2: Anchor Voice Dialogue Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <div className="flex items-center gap-1 px-2 text-[10px] uppercase font-bold text-amber-400 font-mono">
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anchor</span>
          </div>
          {ANCHOR_QUICK_LINES.slice(0, 4).map((line) => (
            <button
              key={line.id}
              onClick={() => onTriggerAnchorSpeech(line.speech, line.gesture)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-200 bg-slate-950 hover:bg-slate-800 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap border border-slate-800"
            >
              {line.label}
            </button>
          ))}
        </div>

        {/* Group 3: Live Reality Show SFX Soundboard */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <div className="flex items-center gap-1 px-2 text-[10px] uppercase font-bold text-slate-400 font-mono">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SFX</span>
          </div>
          <button
            onClick={() => onPlaySFX('stinger')}
            className="px-2 py-1 rounded text-[10px] font-semibold text-amber-300 hover:bg-slate-800 cursor-pointer"
          >
            Stinger
          </button>
          <button
            onClick={() => onPlaySFX('applause')}
            className="px-2 py-1 rounded text-[10px] font-semibold text-emerald-300 hover:bg-slate-800 cursor-pointer"
          >
            Cheers
          </button>
          <button
            onClick={() => onPlaySFX('buzzer')}
            className="px-2 py-1 rounded text-[10px] font-semibold text-rose-400 hover:bg-slate-800 cursor-pointer"
          >
            Buzzer
          </button>
          <button
            onClick={() => onPlaySFX('drone')}
            className="px-2 py-1 rounded text-[10px] font-semibold text-purple-300 hover:bg-slate-800 cursor-pointer"
          >
            Suspense
          </button>
        </div>

        {/* Group 4: Lighting Atmosphere Mode */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <div className="flex items-center gap-1 px-2 text-[10px] uppercase font-bold text-slate-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Light</span>
          </div>
          <button
            onClick={() => onLightingChange('arena-gold')}
            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
              lighting === 'arena-gold' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Gold
          </button>
          <button
            onClick={() => onLightingChange('inferno-red')}
            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
              lighting === 'inferno-red' ? 'bg-rose-600 text-white font-bold' : 'text-rose-300 hover:text-white'
            }`}
          >
            Inferno
          </button>
          <button
            onClick={() => onLightingChange('titans-blue')}
            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
              lighting === 'titans-blue' ? 'bg-sky-600 text-white font-bold' : 'text-sky-300 hover:text-white'
            }`}
          >
            Titans
          </button>
          <button
            onClick={() => onLightingChange('dramatic-dim')}
            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
              lighting === 'dramatic-dim' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dim
          </button>
        </div>

        {/* Group 5: Game Round Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onRoundChange('buzzer-duel')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              currentRound === 'buzzer-duel' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Buzzer Round</span>
          </button>
          <button
            onClick={() => onRoundChange('crowning')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              currentRound === 'crowning' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3 h-3" />
            <span>Finale Crown</span>
          </button>
        </div>
      </div>
    </div>
  );
};
