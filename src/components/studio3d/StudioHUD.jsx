import React, { useState } from 'react';
import {
  Crown,
  Flame,
  Shield,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  UserPlus,
  Sliders,
  X,
  Zap,
  RotateCcw,
  Video,
  Play,
  ChevronRight
} from 'lucide-react';
import { useStageStore } from '../../store/useStageStore.js';

// The 7 Broadcast Scenes matching image_701a3d4f.png
const BROADCAST_SCENES = [
  { id: 'welcome', number: 1, label: '1. Welcome Stage' },
  { id: 'team_intro', number: 2, label: '2. Team Intro' },
  { id: 'quiz', number: 3, label: '3. Quiz Arena' },
  { id: 'challenge', number: 4, label: '4. Challenge' },
  { id: 'face_off', number: 5, label: '5. Face-Off' },
  { id: 'results', number: 6, label: '6. Results' },
  { id: 'winner', number: 7, label: '7. Winner Crown' },
];

export const StudioHUD = ({ onOpenSummonModal }) => {
  const currentScene = useStageStore((s) => s.currentScene);
  const setScene = useStageStore((s) => s.setScene);

  const isMotionBlurEnabled = useStageStore((s) => s.isMotionBlurEnabled);
  const toggleMotionBlur = useStageStore((s) => s.toggleMotionBlur);
  const anchor = useStageStore((s) => s.anchor);
  const setAnchorDialogue = useStageStore((s) => s.setAnchorDialogue);

  const infernoScore = useStageStore((s) => s.infernoScore);
  const titansScore = useStageStore((s) => s.titansScore);

  const isMuted = useStageStore((s) => s.isMuted);
  const toggleMute = useStageStore((s) => s.toggleMute);
  const isSpeechEnabled = useStageStore((s) => s.isSpeechEnabled);
  const toggleSpeech = useStageStore((s) => s.toggleSpeech);

  const contestants = useStageStore((s) => s.contestants);
  const activePodiumId = useStageStore((s) => s.activeContestantAtPodiumId);
  const sendContestantBackToChair = useStageStore((s) => s.sendContestantBackToChair);
  const triggerBuzzerDuel = useStageStore((s) => s.triggerBuzzerDuel);
  const setCamera = useStageStore((s) => s.setCamera);

  // Discreet drawer for optional controls (opened via top right Sliders button)
  const [isDirectorPanelOpen, setIsDirectorPanelOpen] = useState(false);

  const activeContestant = activePodiumId ? contestants[activePodiumId] : null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 lg:p-6 z-30 select-none">
      {/* 1. TOP BROADCAST BAR (Exact match to image_701a3d4f.png) */}
      <div className="flex items-center justify-between gap-2 lg:gap-4 pointer-events-auto w-full">
        {/* Left: Gold Crown Box + Show Title + LIVE badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/40 border border-amber-300/60 flex-shrink-0">
            <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm lg:text-lg font-black font-crown tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 leading-none drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
                CHAMPIONS TERA BHAI
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono font-black text-[9px] lg:text-[10px] tracking-wider shadow-md shadow-rose-600/50 border border-rose-400/40">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="text-[8px] lg:text-[10px] font-extrabold tracking-[0.2em] text-slate-300 uppercase mt-0.5">
              A REALITY COMPETITION SHOW
            </div>
          </div>
        </div>

        {/* Center: Sleek Capsule Scoreboard Bug (INFERNO 1060 VS 1100 TITANS) */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-5 py-2 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-xs lg:text-sm font-black font-mono text-rose-400 tracking-wider">
              INFERNO {infernoScore}
            </span>
          </div>
          <span className="text-amber-400 font-crown font-black text-xs lg:text-sm tracking-widest px-1">
            VS
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs lg:text-sm font-black font-mono text-sky-400 tracking-wider">
              {titansScore} TITANS
            </span>
            <Shield className="w-4 h-4 text-sky-400 fill-sky-400" />
          </div>
        </div>

        {/* Right: 3 Circular Frosted Buttons (Audio, Mic, Mixer/Settings) */}
        <div className="flex items-center gap-2">
          {/* Audio Sound Toggle */}
          <button
            onClick={toggleMute}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-lg backdrop-blur-md cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 lg:w-5 lg:h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            )}
          </button>

          {/* Host Voice Toggle */}
          <button
            onClick={toggleSpeech}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-lg backdrop-blur-md cursor-pointer"
            title={isSpeechEnabled ? 'Host Voice On' : 'Host Voice Off'}
          >
            {isSpeechEnabled ? (
              <Mic className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
            ) : (
              <MicOff className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500" />
            )}
          </button>

          {/* Director Settings / Mixer Panel Toggle */}
          <button
            onClick={() => setIsDirectorPanelOpen(!isDirectorPanelOpen)}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-all shadow-lg backdrop-blur-md cursor-pointer"
            title="Studio Settings & Director Controls"
          >
            <Sliders className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Scoreboard Fallback */}
      <div className="sm:hidden flex justify-center pointer-events-auto my-1">
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-3.5 py-1 rounded-full shadow-lg">
          <div className="flex items-center gap-1.5 text-rose-400 font-mono font-black text-[11px]">
            <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>{infernoScore}</span>
          </div>
          <span className="text-amber-400 font-crown font-black text-[10px]">VS</span>
          <div className="flex items-center gap-1.5 text-sky-400 font-mono font-black text-[11px]">
            <span>{titansScore}</span>
            <Shield className="w-3 h-3 fill-sky-400 text-sky-400" />
          </div>
        </div>
      </div>

      {/* 2. LOWER-CENTER HOST DIALOGUE BANNER (Chamfered Hexagon Card with Gold Border) */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto mb-2">
        {/* Active Contestant on Center Stage Callout (if active) */}
        {activeContestant && (
          <div className="bg-slate-950/90 border border-emerald-400/80 rounded-2xl px-4 py-2 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in duration-200">
            <div>
              <span className="text-[8px] font-mono font-bold uppercase text-emerald-400">
                ★ CENTER STAGE HOT SEAT ★
              </span>
              <h3 className="text-xs lg:text-sm font-black text-white leading-tight">
                {activeContestant.name} ({activeContestant.team === 'inferno' ? 'Team Inferno' : 'Team Titans'})
              </h3>
            </div>
            <button
              onClick={() => sendContestantBackToChair(activeContestant.id)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Return to Chair</span>
            </button>
          </div>
        )}

        {/* Chamfered Gold Teleprompter Card as seen in image_701a3d4f.png */}
        <div
          className="relative max-w-2xl w-full mx-auto px-8 py-3 bg-slate-950/95 border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.35)] backdrop-blur-md text-center transition-all animate-in fade-in duration-150"
          style={{
            clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)',
          }}
        >
          {/* Header with Crown Icon */}
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-[11px] lg:text-xs font-black font-crown text-amber-400 uppercase tracking-[0.25em]">
              TERA BHAI HOST
            </span>
          </div>

          {/* Host Spoken Dialogue */}
          <p className="text-xs lg:text-sm font-bold text-white leading-relaxed px-4">
            "{anchor?.currentDialogue || 'Hello everyone! Welcome to CHAMPIONS TERA BHAI! The stage is set for an epic clash!'}"
          </p>
        </div>
      </div>

      {/* 3. PINNED BOTTOM SCENE SWITCHER DOCK (Exact match to image_701a3d4f.png) */}
      <div className="flex justify-center pointer-events-auto w-full pb-1">
        <div className="flex items-center gap-1 lg:gap-1.5 bg-black/90 backdrop-blur-md border border-amber-500/30 px-2 lg:px-4 py-1.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.9)] max-w-full overflow-x-auto scrollbar-none">
          {/* ▶ SCENE Label Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-400/40 text-amber-400 font-crown font-black text-[10px] lg:text-xs tracking-wider flex-shrink-0">
            <Play className="w-2.5 h-2.5 lg:w-3 lg:h-3 fill-amber-400 text-amber-400" />
            <span>SCENE</span>
          </div>

          {/* 7 Scene Buttons separated by Chevron */}
          {BROADCAST_SCENES.map((scene, idx) => {
            const isActive = currentScene === scene.id;
            return (
              <React.Fragment key={scene.id}>
                <button
                  onClick={() => setScene(scene.id)}
                  className={`px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.65)] scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {scene.label}
                </button>
                {idx < BROADCAST_SCENES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0 hidden md:inline-block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 4. OPTIONAL COLLAPSIBLE DIRECTOR DRAWER (Opened via Sliders icon) */}
      {isDirectorPanelOpen && (
        <div className="pointer-events-auto absolute bottom-16 right-4 lg:right-6 bg-slate-950/95 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 font-crown uppercase tracking-wider">
                Director Controls
              </span>
            </div>
            <button
              onClick={() => setIsDirectorPanelOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setAnchorDialogue('Hello everyone! Welcome to CHAMPIONS TERA BHAI! Today is the ultimate showdown!', 'welcome');
                setIsDirectorPanelOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow cursor-pointer transition-all"
            >
              <span>Host Welcome Line</span>
              <Mic className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                triggerBuzzerDuel();
                setIsDirectorPanelOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow cursor-pointer transition-all"
            >
              <span>Face-Off Buzzer Duel</span>
              <Zap className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                onOpenSummonModal();
                setIsDirectorPanelOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs cursor-pointer transition-all"
            >
              <span>Summon Friend to Contestant Chair</span>
              <UserPlus className="w-3.5 h-3.5" />
            </button>

            {/* Post-Processing TV Broadcast Motion Blur Toggle */}
            <button
              onClick={toggleMotionBlur}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMotionBlurEnabled
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>TV Broadcast Motion Blur</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-950/80">
                {isMotionBlurEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Cameras:</span>
              <div className="flex gap-1">
                {[
                  ['cam1_wide', 'Wide'],
                  ['cam2_anchor', 'Host'],
                  ['cam3_inferno', 'Inferno'],
                  ['cam4_titans', 'Titans'],
                  ['cam7_orbit', 'Orbit 360°'],
                ].map(([cam, label]) => (
                  <button
                    key={cam}
                    onClick={() => {
                      setCamera(cam);
                      setIsDirectorPanelOpen(false);
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-amber-500 hover:text-slate-950 font-bold cursor-pointer transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
