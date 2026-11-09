import React, { useState } from 'react';
import { Crown, Flame, Shield } from 'lucide-react';
import { AnchorCharacter } from './AnchorCharacter.jsx';
import { ContestantSeat } from './ContestantSeat.jsx';
import { BigScreenDisplay } from './BigScreenDisplay.jsx';

export const StageView = ({
  seats,
  anchor,
  currentCamera,
  lighting,
  currentRound,
  infernoScore,
  titansScore,
  activeQuestion,
  buzzedContestantName,
  buzzedTeam,
  onUnlockSeat,
  onSeatClick,
  onTriggerBuzzer,
  onAnchorSpeak,
  onNextQuestion,
  onAwardPoints,
}) => {
  const [stageMode, setStageMode] = useState('interactive3d');

  const infernoSeats = seats.filter(s => s.team === 'inferno');
  const titansSeats = seats.filter(s => s.team === 'titans');

  // Camera Viewport Transformations for smooth cinematic broadcast switching
  const getCameraStyle = () => {
    switch (currentCamera) {
      case 'anchor':
        return 'scale(1.4) translateY(12%)';
      case 'inferno':
        return 'scale(1.35) translateX(24%) translateY(6%)';
      case 'titans':
        return 'scale(1.35) translateX(-24%) translateY(6%)';
      case 'jumbotron':
        return 'scale(1.25) translateY(-14%)';
      default:
        return 'scale(1) translate(0, 0)';
    }
  };

  // Lighting Filter Preset
  const getLightingFilter = () => {
    switch (lighting) {
      case 'inferno-red':
        return 'hue-rotate(-20deg) saturate(1.4)';
      case 'titans-blue':
        return 'hue-rotate(180deg) saturate(1.3)';
      case 'dramatic-dim':
        return 'brightness(0.7) contrast(1.3)';
      case 'winner-disco':
        return 'saturate(1.8) contrast(1.15)';
      default:
        return 'none';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[580px] bg-slate-950 overflow-hidden flex flex-col justify-between select-none">
      {/* Top Floating Stage Mode Switcher */}
      <div className="absolute top-3 left-4 z-40 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-1 rounded-xl shadow-lg">
        <button
          onClick={() => setStageMode('interactive3d')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            stageMode === 'interactive3d'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dynamic 3D Arena Stage
        </button>
        <button
          onClick={() => setStageMode('broadcastPhoto')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            stageMode === 'broadcastPhoto'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Photoreal Artwork Overlay
        </button>
      </div>

      {/* Camera Live Indicator */}
      <div className="absolute top-3 right-4 z-40 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-rose-500/40 px-3 py-1.5 rounded-xl shadow-lg">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <span className="text-[11px] font-mono font-bold text-rose-300 uppercase">
          CAM: {currentCamera.toUpperCase()}
        </span>
      </div>

      {/* Main Viewport Container with Smooth Camera Transforms */}
      <div
        className="relative w-full h-full flex flex-col justify-between transition-transform duration-700 ease-out origin-center"
        style={{
          transform: getCameraStyle(),
          filter: getLightingFilter(),
        }}
      >
        {stageMode === 'broadcastPhoto' ? (
          /* Broadcast Master Artwork Composite with Live Interactive Overlays */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src="/public/assets/aistudio/image_756983fa.png"
              alt="Champions Tera Bhai Reality Show Master Stage"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center pointer-events-none"
            />

            {/* Interactive Overlay Layer: Hotspots for the chairs and anchor */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
              {/* Top Jumbotron Info Card */}
              <div className="flex justify-center mt-2">
                <div className="bg-slate-950/80 backdrop-blur-md border border-amber-400/50 rounded-xl px-4 py-2 shadow-2xl flex items-center gap-6">
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
                    <Flame className="w-4 h-4" />
                    <span>INFERNO: {infernoScore} PTS</span>
                  </div>
                  <div className="text-amber-400 font-crown font-black text-xs uppercase tracking-widest">
                    CHAMPIONS TERA BHAI
                  </div>
                  <div className="flex items-center gap-2 text-sky-400 font-mono font-bold text-xs">
                    <span>TITANS: {titansScore} PTS</span>
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Trigger Pods directly mapping to image layout */}
              <div className="grid grid-cols-3 gap-6 items-end pb-8">
                {/* Left: Inferno Desks Click Zone */}
                <div className="bg-slate-950/75 backdrop-blur-md border border-rose-500/50 rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-400 font-display">TEAM INFERNO DESK</span>
                    <span className="text-[10px] text-slate-300 font-mono">{infernoSeats.filter(s => !s.isLocked).length}/4 SEATED</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {infernoSeats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => seat.isLocked ? onUnlockSeat(seat.id) : onSeatClick(seat)}
                        className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
                          seat.isLocked
                            ? 'bg-rose-950/80 border border-amber-400/80 text-amber-300 hover:scale-105'
                            : 'bg-rose-600/90 text-white shadow-md'
                        }`}
                      >
                        <div className="text-[10px] font-bold">
                          {seat.isLocked ? '🔒 Unlock' : seat.contestant?.name.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center: Anchor Voice Trigger Pod */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onAnchorSpeak('Hello everyone! Welcome to Champions Tera Bhai!', 'welcome')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Host: "Hello Everyone!"</span>
                  </button>
                  {anchor.isSpeaking && (
                    <div className="mt-2 bg-slate-950/90 border border-amber-400 rounded-lg px-3 py-1 text-xs text-amber-200">
                      "{anchor.currentDialogue}"
                    </div>
                  )}
                </div>

                {/* Right: Titans Desks Click Zone */}
                <div className="bg-slate-950/75 backdrop-blur-md border border-sky-500/50 rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-400 font-display">TEAM TITANS DESK</span>
                    <span className="text-[10px] text-slate-300 font-mono">{titansSeats.filter(s => !s.isLocked).length}/4 SEATED</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {titansSeats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => seat.isLocked ? onUnlockSeat(seat.id) : onSeatClick(seat)}
                        className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
                          seat.isLocked
                            ? 'bg-sky-950/80 border border-amber-400/80 text-amber-300 hover:scale-105'
                            : 'bg-sky-600/90 text-white shadow-md'
                        }`}
                      >
                        <div className="text-[10px] font-bold">
                          {seat.isLocked ? '🔒 Unlock' : seat.contestant?.name.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dynamic Interactive 3D Arena Stage View */
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Arena Top Lights & Truss Lighting Rig */}
            <div className="relative z-0 w-full h-36 flex justify-around pointer-events-none overflow-hidden">
              <div className="w-44 h-96 bg-gradient-to-b from-amber-400/35 via-yellow-300/10 to-transparent blur-md transform -rotate-12 animate-sweep-left" />
              <div className="w-52 h-96 bg-gradient-to-b from-rose-500/30 via-red-500/10 to-transparent blur-md transform rotate-6 animate-sweep-right" />
              <div className="w-52 h-96 bg-gradient-to-b from-sky-400/30 via-blue-500/10 to-transparent blur-md transform -rotate-6 animate-sweep-left" />
              <div className="w-44 h-96 bg-gradient-to-b from-amber-400/35 via-yellow-300/10 to-transparent blur-md transform rotate-12 animate-sweep-right" />
            </div>

            {/* Giant Arena Jumbotron Screen in the background */}
            <div className="relative z-10 px-4 -mt-20">
              <BigScreenDisplay
                currentRound={currentRound}
                infernoScore={infernoScore}
                titansScore={titansScore}
                activeQuestion={activeQuestion}
                buzzedContestantName={buzzedContestantName}
                buzzedTeam={buzzedTeam}
                onNextQuestion={onNextQuestion}
                onAwardPoints={onAwardPoints}
              />
            </div>

            {/* STAGE GROUND WITH 3D PERSPECTIVE FLOOR */}
            <div className="relative z-20 w-full flex-1 flex flex-col justify-end pt-4 pb-2">
              <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950 via-[#0a0c16] to-transparent pointer-events-none">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#f59e0b_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_70%,#000_70%,transparent_100%)]" />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[700px] h-[180px] rounded-[100%] border-2 border-amber-400/40 shadow-[0_0_40px_rgba(251,191,36,0.3)] pointer-events-none" />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[550px] h-[140px] rounded-[100%] border border-rose-500/30 pointer-events-none" />
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[400px] h-[100px] rounded-[100%] border border-sky-400/30 pointer-events-none" />
              </div>

              {/* THREE MAIN STAGE ZONES */}
              <div className="relative z-20 max-w-7xl mx-auto w-full px-4 grid grid-cols-12 gap-3 lg:gap-6 items-end">
                {/* 1. LEFT ZONE: TEAM INFERNO */}
                <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
                  <div className="w-full flex justify-around items-end gap-1.5 px-2">
                    {infernoSeats.map(seat => (
                      <ContestantSeat
                        key={seat.id}
                        seat={seat}
                        team="inferno"
                        onUnlockSeat={onUnlockSeat}
                        onSeatClick={onSeatClick}
                        onTriggerBuzzer={onTriggerBuzzer}
                      />
                    ))}
                  </div>

                  {/* Team Inferno Heavy Broadcast Gaming Desk */}
                  <div className="w-full relative -mt-3 flex flex-col items-center">
                    <div className="w-full h-5 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 rounded-t-xl border-t border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center justify-center">
                      <div className="w-1/3 h-1 bg-rose-200/60 rounded-full" />
                    </div>

                    <div className="w-full h-14 bg-gradient-to-b from-rose-950 via-slate-950 to-black border-x-2 border-b-2 border-rose-600/80 rounded-b-xl px-4 flex items-center justify-between shadow-2xl relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-600/25 border border-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/40">
                          <Flame className="w-5 h-5 text-rose-400 fill-rose-500 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs lg:text-sm font-extrabold text-white font-display tracking-wider">
                            TEAM INFERNO
                          </span>
                          <span className="block text-[9px] text-rose-400 font-mono">
                            HEAT BATTLE STATION
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm lg:text-base font-black font-mono text-rose-300">
                          {infernoScore} PTS
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-5 desk-ground-shadow rounded-full -mt-2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. CENTER ZONE: HOST ANCHOR & GOLDEN PODIUM */}
                <div className="col-span-12 lg:col-span-2 flex flex-col items-center justify-end">
                  <AnchorCharacter
                    anchor={anchor}
                    onTriggerDialogue={(text, gesture) => onAnchorSpeak(text, gesture)}
                  />
                </div>

                {/* 3. RIGHT ZONE: TEAM TITANS */}
                <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
                  <div className="w-full flex justify-around items-end gap-1.5 px-2">
                    {titansSeats.map(seat => (
                      <ContestantSeat
                        key={seat.id}
                        seat={seat}
                        team="titans"
                        onUnlockSeat={onUnlockSeat}
                        onSeatClick={onSeatClick}
                        onTriggerBuzzer={onTriggerBuzzer}
                      />
                    ))}
                  </div>

                  {/* Team Titans Heavy Broadcast Gaming Desk */}
                  <div className="w-full relative -mt-3 flex flex-col items-center">
                    <div className="w-full h-5 bg-gradient-to-r from-sky-600 via-blue-500 to-sky-700 rounded-t-xl border-t border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center justify-center">
                      <div className="w-1/3 h-1 bg-sky-200/60 rounded-full" />
                    </div>

                    <div className="w-full h-14 bg-gradient-to-b from-sky-950 via-slate-950 to-black border-x-2 border-b-2 border-sky-600/80 rounded-b-xl px-4 flex items-center justify-between shadow-2xl relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-600/25 border border-sky-400 flex items-center justify-center shadow-lg shadow-sky-600/40">
                          <Shield className="w-5 h-5 text-sky-400 fill-sky-400 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs lg:text-sm font-extrabold text-white font-display tracking-wider">
                            TEAM TITANS
                          </span>
                          <span className="block text-[9px] text-sky-400 font-mono">
                            CRYO BATTLE STATION
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm lg:text-base font-black font-mono text-sky-300">
                          {titansScore} PTS
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-5 desk-ground-shadow rounded-full -mt-2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
