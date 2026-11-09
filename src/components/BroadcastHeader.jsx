import React from 'react';
import { Crown, Volume2, VolumeX, Mic, MicOff, UserPlus } from 'lucide-react';

export const BroadcastHeader = ({
  currentCamera,
  onCameraChange,
  onOpenInviteModal,
  isMuted,
  onToggleMute,
  isSpeechEnabled,
  onToggleSpeech,
  infernoScore,
  titansScore,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between gap-4 lg:gap-8 px-4 lg:px-8 py-3 bg-slate-950/85 backdrop-blur-md border-b border-amber-500/25">
      {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#stage" 
          onClick={(e) => { e.preventDefault(); onCameraChange('wide'); }}
          className="flex items-center gap-2.5 text-lg lg:text-xl font-extrabold tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 whitespace-nowrap group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-slate-950" />
          </div>
          <span className="uppercase tracking-wider">CHAMPIONS TERA BHAI</span>
        </a>
      </div>

      {/* Zone 2: 4-5 Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-slate-300">
        <button
          onClick={() => onCameraChange('wide')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            currentCamera === 'wide' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Main Arena
        </button>
        <button
          onClick={() => onCameraChange('anchor')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            currentCamera === 'anchor' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : 'hover:text-white'
          }`}
        >
          Anchor Cam
        </button>
        <button
          onClick={() => onCameraChange('inferno')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            currentCamera === 'inferno' ? 'text-rose-400 border-b-2 border-rose-500 font-semibold' : 'hover:text-rose-300'
          }`}
        >
          Team Inferno ({infernoScore} pts)
        </button>
        <button
          onClick={() => onCameraChange('titans')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            currentCamera === 'titans' ? 'text-sky-400 border-b-2 border-sky-400 font-semibold' : 'hover:text-sky-300'
          }`}
        >
          Team Titans ({titansScore} pts)
        </button>
        <button
          onClick={() => onCameraChange('lobby')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            currentCamera === 'lobby' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : 'hover:text-white'
          }`}
        >
          VIP Backstage Lobby
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action + Utility Affordances */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Audio Mute Control */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Speech Synthesizer Control */}
        <button
          onClick={onToggleSpeech}
          title={isSpeechEnabled ? 'Anchor Voice Enabled' : 'Anchor Voice Muted'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
        >
          {isSpeechEnabled ? <Mic className="w-4 h-4 text-amber-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Primary Call to Action: Invite / Call Friend to Chair */}
        <button
          onClick={onOpenInviteModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs lg:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-lg hover:from-amber-300 hover:to-yellow-400 active:scale-95 transition-all shadow-md shadow-amber-500/25 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>Call Friend To Chair</span>
        </button>
      </div>
    </header>
  );
};
