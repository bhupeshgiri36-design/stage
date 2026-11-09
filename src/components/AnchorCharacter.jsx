import React from 'react';
import { Crown } from 'lucide-react';

export const AnchorCharacter = ({
  anchor,
  onTriggerDialogue,
}) => {
  const isSpeaking = anchor.isSpeaking;

  return (
    <div className="relative flex flex-col items-center justify-end h-full select-none">
      {/* Dynamic Subtitle / Teleprompter Bubble */}
      {anchor.currentDialogue && (
        <div className="absolute -top-14 max-w-sm lg:max-w-md bg-slate-950/90 border border-amber-400/60 rounded-xl px-4 py-2.5 shadow-2xl shadow-amber-500/20 backdrop-blur-md z-30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-display">
              {anchor.name} (LIVE HOST)
            </span>
            {isSpeaking && (
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ON AIR
              </span>
            )}
          </div>
          <p className="text-xs lg:text-sm text-slate-100 font-medium leading-relaxed">
            "{anchor.currentDialogue}"
          </p>
        </div>
      )}

      {/* Anchor Character Body & Animations */}
      <div 
        className="relative z-10 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => {
          onTriggerDialogue('Hello everyone! Welcome to Champions Tera Bhai! Today we write history!', 'welcome');
        }}
        title="Click to hear Anchor speak!"
      >
        {/* Character Illustration SVG */}
        <div className="relative w-48 h-64 lg:w-56 lg:h-72">
          <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]">
            <defs>
              <linearGradient id="maroonSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#800f2f" />
                <stop offset="50%" stopColor="#590d22" />
                <stop offset="100%" stopColor="#2b0913" />
              </linearGradient>
              <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5c296" />
                <stop offset="100%" stopColor="#dca072" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
            </defs>

            {/* Torso & Suit */}
            <g className={isSpeaking ? 'animate-idle-breathe' : ''}>
              {/* Suit Body */}
              <path 
                d="M 60 140 L 45 250 L 155 250 L 140 140 Z" 
                fill="url(#maroonSuit)" 
                stroke="#4a0418" 
                strokeWidth="2"
              />

              {/* Inner Black Shirt with Open Collar */}
              <polygon points="90,140 110,140 100,185" fill="#18181b" />
              <line x1="100" y1="185" x2="100" y2="245" stroke="#27272a" strokeWidth="2" />

              {/* Gold Chain / Necklace */}
              <path d="M 92 152 Q 100 166 108 152" fill="none" stroke="url(#goldTrim)" strokeWidth="2.5" />

              {/* Suit Lapels with Gold Edge Trim */}
              <polygon points="62,140 92,140 100,210 78,210" fill="url(#maroonSuit)" stroke="url(#goldTrim)" strokeWidth="1.5" />
              <polygon points="138,140 108,140 100,210 122,210" fill="url(#maroonSuit)" stroke="url(#goldTrim)" strokeWidth="1.5" />

              {/* Pocket Square in Gold */}
              <polygon points="72,175 82,172 80,180" fill="url(#goldTrim)" />
            </g>

            {/* Left Arm Gesture based on state */}
            {anchor.gesture === 'point-left' ? (
              <g className="transition-all duration-300">
                <path d="M 60 145 L 18 165 L 10 172" fill="none" stroke="url(#maroonSuit)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="10" cy="172" r="7" fill="url(#skinGrad)" />
                {/* Pointing finger */}
                <line x1="10" y1="172" x2="2" y2="172" stroke="url(#skinGrad)" strokeWidth="4" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <path d="M 60 145 Q 48 190 52 230" fill="none" stroke="url(#maroonSuit)" strokeWidth="16" strokeLinecap="round" />
                <circle cx="52" cy="235" r="7" fill="url(#skinGrad)" />
              </g>
            )}

            {/* Right Arm & Microphone Handling */}
            {anchor.gesture === 'welcome' ? (
              <g className="transition-all duration-300">
                <path d="M 140 145 L 182 135 L 195 125" fill="none" stroke="url(#maroonSuit)" strokeWidth="16" strokeLinecap="round" />
                <circle cx="195" cy="125" r="8" fill="url(#skinGrad)" />
                {/* Mic in hand */}
                <rect x="188" y="110" width="8" height="20" rx="3" fill="#18181b" />
                <circle cx="192" cy="107" r="7" fill="#3f3f46" stroke="url(#goldTrim)" strokeWidth="1" />
              </g>
            ) : anchor.gesture === 'point-right' ? (
              <g className="transition-all duration-300">
                <path d="M 140 145 L 182 165 L 192 172" fill="none" stroke="url(#maroonSuit)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="192" cy="172" r="7" fill="url(#skinGrad)" />
                <line x1="192" y1="172" x2="200" y2="172" stroke="url(#skinGrad)" strokeWidth="4" strokeLinecap="round" />
              </g>
            ) : (
              /* Default Mic-at-Chest Pose */
              <g className="transition-all duration-300">
                <path d="M 140 145 Q 150 180 120 190" fill="none" stroke="url(#maroonSuit)" strokeWidth="16" strokeLinecap="round" />
                <circle cx="118" cy="190" r="7" fill="url(#skinGrad)" />
                {/* Broadcast Mic with Gold Grille */}
                <rect x="114" y="172" width="7" height="22" rx="2" fill="#09090b" transform="rotate(-15, 117, 183)" />
                <ellipse cx="119" cy="170" rx="6" ry="7" fill="#27272a" stroke="url(#goldTrim)" strokeWidth="1.2" />
                {/* On-air mic ring */}
                <circle cx="119" cy="177" r="2.5" fill="#ef4444" />
              </g>
            )}

            {/* Neck */}
            <rect x="91" y="120" width="18" height="25" fill="url(#skinGrad)" />

            {/* Head & Face */}
            <g>
              {/* Hair (Styled Pompadour / Modern Fade) */}
              <path d="M 72 85 C 68 55, 132 55, 128 85 C 133 98, 130 115, 128 118 C 122 108, 120 85, 100 82 C 80 85, 78 108, 72 118 Z" fill="url(#hairGrad)" />

              {/* Head Base */}
              <ellipse cx="100" cy="100" rx="26" ry="30" fill="url(#skinGrad)" />

              {/* Well-Groomed Beard & Mustache */}
              <path d="M 78 102 C 80 128, 120 128, 122 102 C 125 125, 115 133, 100 133 C 85 133, 75 125, 78 102 Z" fill="#18181b" />
              <path d="M 88 113 Q 100 110 112 113 Q 100 117 88 113 Z" fill="#18181b" />

              {/* Animated Speaking Mouth */}
              {isSpeaking ? (
                <ellipse cx="100" cy="120" rx="6" ry="4" fill="#7f1d1d" className="animate-mouth-talk" />
              ) : (
                <path d="M 93 120 Q 100 123 107 120" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" fill="none" />
              )}

              {/* Stylish Black Sunglasses (Iconic Host Look) */}
              <g>
                {/* Left Lens */}
                <path d="M 77 92 L 95 92 C 95 101, 77 101, 77 92 Z" fill="#09090b" stroke="url(#goldTrim)" strokeWidth="1.2" />
                {/* Right Lens */}
                <path d="M 105 92 L 123 92 C 123 101, 105 101, 105 92 Z" fill="#09090b" stroke="url(#goldTrim)" strokeWidth="1.2" />
                {/* Bridge */}
                <line x1="95" y1="94" x2="105" y2="94" stroke="url(#goldTrim)" strokeWidth="1.5" />
                {/* Lens Highlights */}
                <line x1="80" y1="94" x2="88" y2="98" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
                <line x1="108" y1="94" x2="116" y2="98" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Ears */}
              <ellipse cx="73" cy="100" rx="4" ry="7" fill="url(#skinGrad)" />
              <ellipse cx="127" cy="100" rx="4" ry="7" fill="url(#skinGrad)" />
            </g>
          </svg>
        </div>
      </div>

      {/* Anchor Podium (Tapered 3D Metallic with Crown Emblem) */}
      <div className="relative z-20 w-44 lg:w-52 -mt-16 flex flex-col items-center">
        {/* Podium Top Rim with Gold Trim */}
        <div className="w-full h-4 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-t-lg shadow-md shadow-amber-500/30 flex items-center justify-center">
          <div className="w-12 h-1 bg-amber-200/80 rounded-full" />
        </div>

        {/* Podium Body with glowing Gold Crown Emblem */}
        <div className="w-36 lg:w-44 h-28 lg:h-32 bg-gradient-to-b from-amber-950 via-slate-900 to-black border-x-2 border-b-2 border-amber-500/60 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Neon inner edge highlights */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

          {/* Golden Crown Emblem */}
          <div className="relative flex flex-col items-center animate-stadium-pulse">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-amber-500/15 border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Crown className="w-8 h-8 lg:w-9 lg:h-9 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </div>
            <span className="text-[9px] lg:text-[10px] font-crown font-black tracking-widest text-amber-300 uppercase mt-1">
              CHAMPIONS
            </span>
          </div>
        </div>

        {/* Podium Base Tier */}
        <div className="w-48 lg:w-56 h-4 bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 rounded-b-xl shadow-xl flex items-center justify-center" />

        {/* Circular Floor Rings & Ground Contact Shadow */}
        <div className="relative w-64 lg:w-72 h-10 -mt-2 flex items-center justify-center">
          {/* Deep Ground Shadow - Guarantees non-floating anchor podium! */}
          <div className="absolute inset-x-2 inset-y-1 rounded-full desk-ground-shadow" />
          {/* Glowing Stage Floor Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.4)] pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-purple-500/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
