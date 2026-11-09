import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Crown, 
  Flame, 
  Shield, 
  Zap, 
  Sparkles, 
  Video, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  UserPlus, 
  Trophy,
  Play
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects.js';
import { speechService } from '../services/speechService.js';
import { PRESET_FRIENDS_TO_CALL } from '../data/defaultContestants.js';

export const ArenaStagePanel = ({
  seats = [],
  onSeatsChange = () => {},
  anchor = {},
  onAnchorSpeak = () => {},
  isMuted = false,
  onToggleMute = () => {},
  isSpeechEnabled = true,
  onToggleSpeech = () => {},
}) => {
  // Camera perspective: 'arena-circular' or 'broadcast-front' or close-ups
  const [camera, setCamera] = useState('arena-circular');
  const [activeBuzzerId, setActiveBuzzerId] = useState(null);
  const [buzzedTeam, setBuzzedTeam] = useState(null);
  const [buzzerWinner, setBuzzerWinner] = useState(null);
  const [isFriendInvitePopupOpen, setIsFriendInvitePopupOpen] = useState(false);
  const [targetSeatId, setTargetSeatId] = useState(null);

  const infernoSeats = seats.filter(s => s.team === 'inferno');
  const titansSeats = seats.filter(s => s.team === 'titans');

  const infernoScore = infernoSeats.reduce((acc, s) => acc + (s.contestant?.score || 0), 0);
  const titansScore = titansSeats.reduce((acc, s) => acc + (s.contestant?.score || 0), 0);

  // Switch camera with smooth whoosh sound
  const handleSwitchCamera = (newCam) => {
    soundEffects.playCameraWhoosh();
    setCamera(newCam);
  };

  // Trigger Desk Buzzer Strike
  const handleContestantBuzzer = (contestant) => {
    soundEffects.playBuzzer();
    setActiveBuzzerId(contestant.id);
    setBuzzedTeam(contestant.team);
    setBuzzerWinner(contestant.name);

    onSeatsChange(prev =>
      prev.map(s => {
        if (s.contestant && s.contestant.id === contestant.id) {
          return {
            ...s,
            contestant: {
              ...s.contestant,
              isBuzzed: true,
              score: s.contestant.score + 50,
              state: 'answering',
            },
          };
        }
        return s;
      })
    );

    // Host verbal reaction
    onAnchorSpeak(
      `Buzzer locked in by ${contestant.name} for ${contestant.team === 'inferno' ? 'Team Inferno' : 'Team Titans'}! Outstanding reaction speed!`,
      'mic-raise'
    );

    setTimeout(() => {
      setActiveBuzzerId(null);
      setBuzzerWinner(null);
      onSeatsChange(prev =>
        prev.map(s =>
          s.contestant
            ? {
                ...s,
                contestant: {
                  ...s.contestant,
                  isBuzzed: false,
                  state: 'seated',
                },
              }
            : s
        )
      );
    }, 3500);
  };

  // Face-Off Buzzer Race (simulate rapid buzz-in)
  const handleTriggerBuzzerRace = () => {
    soundEffects.playSuspenseDrone();
    onAnchorSpeak('Hands hovering above the buzzers! 3, 2, 1... HIT IT!', 'welcome');

    setTimeout(() => {
      const allContestants = seats.map(s => s.contestant).filter(Boolean);
      if (allContestants.length > 0) {
        const randomContestant = allContestants[Math.floor(Math.random() * allContestants.length)];
        handleContestantBuzzer(randomContestant);
      }
    }, 2200);
  };

  // Unlock Chair and Summon Friend to Stage
  const handleUnlockChair = (seatId) => {
    setTargetSeatId(seatId);
    setIsFriendInvitePopupOpen(true);
  };

  const confirmSummonFriend = (presetIndex) => {
    if (!targetSeatId) return;
    const friend = PRESET_FRIENDS_TO_CALL[presetIndex];
    const targetSeat = seats.find(s => s.id === targetSeatId);
    if (!targetSeat) return;

    setIsFriendInvitePopupOpen(false);

    // 1. Play hydraulic sound and mark unlocking
    soundEffects.playChairUnlock();
    onSeatsChange(prev =>
      prev.map(s => (s.id === targetSeatId ? { ...s, isUnlocking: true, isLocked: false } : s))
    );

    // 2. Anchor speech announcement
    onAnchorSpeak(
      `Ladies and gentlemen, unlocking the chair for our friend ${friend.name}! Welcome to the stage of Champions Tera Bhai!`,
      targetSeat.team === 'inferno' ? 'point-left' : 'point-right'
    );

    // 3. Settle character onto chair
    setTimeout(() => {
      onSeatsChange(prev =>
        prev.map(s => {
          if (s.id === targetSeatId) {
            return {
              ...s,
              isLocked: false,
              isUnlocking: false,
              contestant: {
                id: `c-${Date.now()}`,
                name: friend.name,
                nickname: friend.nickname,
                team: s.team,
                seatIndex: s.seatIndex,
                avatarId: friend.avatarId,
                jerseyNumber: friend.jerseyNumber,
                role: friend.role,
                score: 150,
                isBuzzed: false,
                state: 'seated',
                catchphrase: friend.catchphrase,
              },
            };
          }
          return s;
        })
      );

      soundEffects.playApplause();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: targetSeat.team === 'inferno' ? ['#f43f5e', '#fbbf24'] : ['#38bdf8', '#fbbf24'],
      });
    }, 1200);
  };

  // Grand Crowning Ceremony
  const handleCrowningCeremony = () => {
    soundEffects.playThemeStinger();
    soundEffects.playApplause();

    const winnerName = infernoScore >= titansScore ? 'TEAM INFERNO' : 'TEAM TITANS';
    onAnchorSpeak(
      `THE GRAND CROWNING MOMENT! With supreme skill and fire, ${winnerName} lifts the Golden Crown of Champions Tera Bhai!`,
      'celebrate'
    );

    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#38bdf8', '#ffffff'],
    });
  };

  return (
    <div className="relative w-full h-screen bg-[#030408] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. TOP MINIMAL BROADCAST FLOATING OVERLAY */}
      <div className="relative z-40 w-full px-4 lg:px-8 py-3 flex items-center justify-between gap-4 bg-gradient-to-b from-slate-950/90 to-transparent">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-black font-crown tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 leading-none">
              CHAMPIONS TERA BHAI
            </h1>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              3D VIRTUAL REALITY SHOW STAGE
            </span>
          </div>
        </div>

        {/* Live Scores Center Indicator */}
        <div className="flex items-center gap-6 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 px-4 py-1.5 rounded-full shadow-xl">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold text-rose-400 font-mono">INFERNO: {infernoScore}</span>
          </div>
          <span className="text-amber-400 font-bold text-xs">VS</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 font-mono">TITANS: {titansScore}</span>
            <Shield className="w-4 h-4 text-sky-400 fill-sky-400" />
          </div>
        </div>

        {/* Audio & Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={onToggleSpeech}
            className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isSpeechEnabled ? 'Anchor Voice Enabled' : 'Anchor Voice Muted'}
          >
            {isSpeechEnabled ? <Mic className="w-4 h-4 text-amber-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* 2. THE 3D VIRTUAL STAGE ARENA */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        {/* Arena Floodlights & Volumetric Spotlights */}
        <div className="absolute inset-x-0 top-0 h-96 pointer-events-none overflow-hidden z-10">
          <div className="absolute left-[15%] top-0 w-48 h-[600px] bg-gradient-to-b from-amber-400/30 via-yellow-300/10 to-transparent blur-xl transform -rotate-20 animate-sweep-left" />
          <div className="absolute left-[35%] top-0 w-52 h-[600px] bg-gradient-to-b from-rose-500/25 via-red-500/10 to-transparent blur-xl transform rotate-10 animate-sweep-right" />
          <div className="absolute right-[35%] top-0 w-52 h-[600px] bg-gradient-to-b from-sky-400/25 via-blue-500/10 to-transparent blur-xl transform -rotate-10 animate-sweep-left" />
          <div className="absolute right-[15%] top-0 w-48 h-[600px] bg-gradient-to-b from-amber-400/30 via-yellow-300/10 to-transparent blur-xl transform rotate-20 animate-sweep-right" />
        </div>

        {/* CAMERA PERSPECTIVE CONTAINER */}
        <div 
          className={`relative w-full h-full flex flex-col justify-between transition-all duration-700 ease-out origin-center ${
            camera === 'arena-circular' 
              ? 'scale-100 translate-y-0' 
              : camera === 'broadcast-front'
              ? 'scale-110 translate-y-4'
              : camera === 'anchor-closeup'
              ? 'scale-140 translate-y-16'
              : camera === 'inferno-desk'
              ? 'scale-135 translate-x-28 translate-y-8'
              : 'scale-135 -translate-x-28 translate-y-8'
          }`}
        >
          {/* A. ARENA BACKDROP: Giant Curved Crown Screen & Grand Illuminated Staircase */}
          <div className="relative w-full z-10 flex flex-col items-center pt-2">
            {/* Giant Curved LED Screen */}
            <div className="relative w-full max-w-4xl h-36 lg:h-44 rounded-b-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border-x-2 border-b-2 border-amber-400/50 p-4 shadow-[0_0_60px_rgba(251,191,36,0.25)] flex flex-col items-center justify-center overflow-hidden">
              {/* Screen Top Crown Insignia with Laurel Leaves matching images */}
              <div className="relative flex flex-col items-center animate-stadium-pulse">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-amber-500/20 border border-amber-400/70 flex items-center justify-center shadow-lg shadow-amber-500/40">
                  <Crown className="w-8 h-8 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
                </div>
                <h2 className="text-xl lg:text-3xl font-black font-crown tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 uppercase mt-1">
                  CHAMPIONS TERA BHAI
                </h2>
                <div className="px-4 py-0.5 rounded-full bg-red-700/80 text-[10px] lg:text-xs font-bold text-white tracking-widest uppercase shadow">
                  A REALITY COMPETITION SHOW
                </div>
              </div>

              {/* Dynamic Aura behind the screen */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/15 via-transparent to-sky-600/15 pointer-events-none" />
            </div>

            {/* Central Grand Glowing Staircase */}
            <div className="relative w-64 lg:w-80 flex flex-col items-center -mt-2 z-0">
              <div className="w-40 h-2 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
              <div className="w-48 h-2.5 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 rounded-full mt-0.5 shadow-[0_0_14px_rgba(251,191,36,0.6)]" />
              <div className="w-56 h-3 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 rounded-full mt-0.5 shadow-[0_0_16px_rgba(251,191,36,0.6)]" />
              <div className="w-64 h-3.5 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 rounded-full mt-0.5 shadow-[0_0_18px_rgba(251,191,36,0.6)]" />
            </div>
          </div>

          {/* B. CIRCULAR STAGE FLOOR & GLOWING CONCENTRIC RINGS */}
          <div className="relative w-full flex-1 flex flex-col justify-end pb-8">
            {/* The Glossy Marble Circular Stage Floor */}
            <div className="absolute inset-x-0 bottom-0 h-[420px] bg-gradient-to-t from-[#04050a] via-[#080b18] to-transparent pointer-events-none">
              {/* Marble texture veins & perspective lines */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_60%,#fbbf24_0%,transparent_60%)]" />

              {/* Concentric Glowing Neon Rings on the Floor */}
              {/* Outer Golden Ring */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[920px] h-[280px] rounded-[100%] border-4 border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.5)] pointer-events-none animate-ring-slow" />
              {/* Mid Red/Magenta Ring */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[720px] h-[210px] rounded-[100%] border-2 border-rose-500/70 shadow-[0_0_35px_rgba(244,63,94,0.5)] pointer-events-none" />
              {/* Inner Orange Stage Ring directly around Anchor Podium */}
              <div className="absolute bottom-18 left-1/2 -translate-x-1/2 w-[460px] h-[140px] rounded-[100%] border-2 border-amber-300 shadow-[0_0_30px_rgba(252,211,77,0.7)] pointer-events-none" />
            </div>

            {/* THREE ROBOTIC BROADCAST CAMERAS ON PERIMETER */}
            <div className="absolute inset-x-0 bottom-4 flex justify-between px-16 lg:px-28 pointer-events-none z-30">
              {/* Left Broadcast Robot Camera */}
              <div className="flex flex-col items-center animate-camera-pan">
                <div className="w-8 h-6 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center relative shadow-xl">
                  <div className="w-3 h-3 rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </div>
                </div>
                <div className="w-1.5 h-10 bg-slate-800 shadow" />
                <div className="w-8 h-2 bg-slate-900 rounded-full" />
              </div>

              {/* Center Robot Camera */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-7 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center relative shadow-xl">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </div>
                </div>
                <div className="w-2 h-12 bg-slate-800 shadow" />
                <div className="w-10 h-2.5 bg-slate-900 rounded-full" />
              </div>

              {/* Right Broadcast Robot Camera */}
              <div className="flex flex-col items-center animate-camera-pan" style={{ animationDelay: '2s' }}>
                <div className="w-8 h-6 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center relative shadow-xl">
                  <div className="w-3 h-3 rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </div>
                </div>
                <div className="w-1.5 h-10 bg-slate-800 shadow" />
                <div className="w-8 h-2 bg-slate-900 rounded-full" />
              </div>
            </div>

            {/* C. THE MAIN INTERACTIVE STAGE DESKS & CENTER ANCHOR PODIUM */}
            <div className="relative z-20 max-w-7xl mx-auto w-full px-4 grid grid-cols-12 gap-3 lg:gap-6 items-end">
              
              {/* 1. TEAM INFERNO (LEFT CURVED RED DESK WITH 5 GAMING CHAIRS & MOVING CHARACTERS) */}
              <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
                {/* 5 Gaming Chairs behind desk */}
                <div className="w-full flex justify-around items-end gap-1 px-1">
                  {infernoSeats.map(seat => (
                    <div 
                      key={seat.id} 
                      className={`relative flex flex-col items-center transition-all duration-500 ${
                        seat.isLocked ? 'scale-90 opacity-60' : 'scale-100 opacity-100'
                      }`}
                    >
                      {/* Chair Unit with Gold Crown Headrest */}
                      <div 
                        onClick={() => seat.isLocked ? handleUnlockChair(seat.id) : seat.contestant && handleContestantBuzzer(seat.contestant)}
                        className="relative w-14 lg:w-16 h-28 lg:h-32 flex flex-col items-center justify-end cursor-pointer group hover:scale-105 transition-transform"
                        title={seat.isLocked ? 'Click to Unlock Seat & Call Friend' : 'Click to Hit Buzzer!'}
                      >
                        {/* Chair Backrest with Golden Crown */}
                        <div className="absolute inset-x-0 top-0 bottom-4 rounded-t-xl bg-gradient-to-b from-[#1a1e29] to-[#0a0d14] border-2 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] flex flex-col items-center pt-1.5">
                          {/* Embroidered Crown on Headrest */}
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <div className="w-full h-0.5 bg-rose-500/40 my-1" />
                        </div>

                        {/* Seated Contestant Character (Moving!) */}
                        {seat.contestant && (
                          <div className="relative z-10 flex flex-col items-center mb-1">
                            {/* Moving Character Head (Bobbing, breathing, wearing headset) */}
                            <div className="relative w-9 h-9 animate-character-head">
                              <div className="w-8 h-8 rounded-full bg-amber-200 border border-amber-400 relative overflow-hidden shadow">
                                <div className="absolute top-0 inset-x-0 h-3 bg-slate-900" />
                                <div className="absolute top-3.5 inset-x-1.5 flex justify-between">
                                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                                </div>
                              </div>
                              {/* Esports Headset with Mic */}
                              <div className="absolute -inset-0.5 rounded-full border-t-2 border-slate-950 pointer-events-none" />
                              <div className="absolute -left-0.5 top-2 w-2 h-3 bg-slate-950 rounded-sm" />
                              <div className="absolute -right-0.5 top-2 w-2 h-3 bg-slate-950 rounded-sm" />
                            </div>

                            {/* Red Flame Jersey & Moving Body */}
                            <div className={`w-11 h-9 rounded-t-lg bg-gradient-to-b from-rose-600 to-red-800 border-t border-rose-400 flex flex-col items-center justify-center shadow-lg ${
                              seat.contestant.isBuzzed ? 'animate-buzzer-hit' : 'animate-idle-breathe'
                            }`}>
                              <span className="text-[9px] font-black font-mono text-white leading-none">
                                #{seat.contestant.jerseyNumber}
                              </span>
                              <span className="text-[7px] font-bold text-white uppercase tracking-wider truncate max-w-[40px]">
                                {seat.contestant.name.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* If seat is locked, show padlock */}
                        {seat.isLocked && (
                          <div className="relative z-10 flex flex-col items-center mb-4">
                            <div className="w-6 h-6 rounded-full bg-slate-950/90 border border-amber-400 flex items-center justify-center shadow-lg">
                              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <span className="text-[8px] font-bold text-amber-300 mt-1 uppercase">CALL</span>
                          </div>
                        )}

                        {/* Hydraulic Column & Heavy 5-Star Base Touching Floor */}
                        <div className="w-2.5 h-4 bg-slate-800" />
                        <div className="w-12 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
                        {/* Ground Contact Shadow (Guarantees zero floating!) */}
                        <div className="w-14 h-2 chair-base-shadow rounded-full pointer-events-none -mt-1" />
                      </div>

                      {/* Seat Number Tag */}
                      <span className="text-[8px] font-mono font-bold text-rose-400/90 mt-0.5">
                        S{seat.seatIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Team Inferno Curved Glowing Red Desk */}
                <div className="w-full relative -mt-1 flex flex-col items-center">
                  {/* Glowing Desk Top with Buzzers */}
                  <div className="w-full h-6 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 rounded-t-2xl border-t border-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.8)] flex items-center justify-around px-4">
                    {infernoSeats.map(seat => (
                      <button
                        key={seat.id}
                        disabled={seat.isLocked}
                        onClick={() => seat.contestant && handleContestantBuzzer(seat.contestant)}
                        className={`w-5 h-3 rounded-full transition-all cursor-pointer ${
                          seat.contestant?.isBuzzed 
                            ? 'bg-amber-300 shadow-[0_0_15px_rgba(252,211,77,1)] scale-125' 
                            : 'bg-red-950 hover:bg-rose-400 border border-rose-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Desk Front Panel with TEAM INFERNO Flame Emblem */}
                  <div className="w-full h-16 bg-gradient-to-b from-rose-950 via-slate-950 to-black border-x-2 border-b-2 border-rose-500 rounded-b-2xl px-4 flex items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/50">
                        <Flame className="w-6 h-6 text-rose-400 fill-rose-500 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-base lg:text-lg font-black font-display tracking-wider text-white uppercase block leading-none">
                          TEAM INFERNO
                        </span>
                        <span className="text-[9px] font-bold text-rose-400 tracking-widest font-mono">
                          HEAT BATTLE STATION
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base lg:text-lg font-black font-mono text-rose-300">
                        {infernoScore} PTS
                      </span>
                    </div>
                  </div>

                  {/* Ground Contact Shadow under table */}
                  <div className="w-full h-4 desk-ground-shadow rounded-full -mt-2 pointer-events-none" />
                </div>
              </div>

              {/* 2. CENTER: ANCHOR HOST & GOLDEN CROWN PODIUM */}
              <div className="col-span-12 lg:col-span-2 flex flex-col items-center justify-end relative">
                {/* Floating Anchor Speech Bubble with Caption */}
                {anchor.currentDialogue && (
                  <div className="absolute -top-16 max-w-xs bg-slate-950/95 border border-amber-400 rounded-2xl px-3.5 py-2 shadow-2xl shadow-amber-500/30 backdrop-blur-md z-40 transition-all text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400 uppercase font-display">
                        TERA BHAI HOST
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium leading-tight">
                      "{anchor.currentDialogue}"
                    </p>
                  </div>
                )}

                {/* Moving Anchor Character Body */}
                <div 
                  onClick={() => onAnchorSpeak('Hello everyone! Welcome to Champions Tera Bhai!', 'welcome')}
                  className="relative z-10 flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
                  title="Click to make Anchor speak!"
                >
                  <div className="w-40 lg:w-48 h-56 lg:h-64 relative">
                    <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]">
                      <defs>
                        <linearGradient id="maroonSuitStage" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#800f2f" />
                          <stop offset="60%" stopColor="#590d22" />
                          <stop offset="100%" stopColor="#2b0913" />
                        </linearGradient>
                        <linearGradient id="goldTrimStage" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fde047" />
                          <stop offset="100%" stopColor="#ca8a04" />
                        </linearGradient>
                      </defs>

                      {/* Suit & Torso */}
                      <g className="animate-idle-breathe">
                        <path d="M 60 140 L 45 250 L 155 250 L 140 140 Z" fill="url(#maroonSuitStage)" stroke="#4a0418" strokeWidth="2" />
                        <polygon points="90,140 110,140 100,185" fill="#18181b" />
                        <line x1="100" y1="185" x2="100" y2="245" stroke="#27272a" strokeWidth="2" />
                        <polygon points="62,140 92,140 100,210 78,210" fill="url(#maroonSuitStage)" stroke="url(#goldTrimStage)" strokeWidth="1.5" />
                        <polygon points="138,140 108,140 100,210 122,210" fill="url(#maroonSuitStage)" stroke="url(#goldTrimStage)" strokeWidth="1.5" />
                      </g>

                      {/* Right Hand Waving ("Hello Everyone" Pose matching Image 2!) */}
                      <g className="transition-all duration-300">
                        <path d="M 140 145 L 182 135 L 195 125" fill="none" stroke="url(#maroonSuitStage)" strokeWidth="16" strokeLinecap="round" />
                        <circle cx="195" cy="125" r="8" fill="#f5c296" />
                        {/* Mic in hand */}
                        <rect x="188" y="110" width="8" height="20" rx="3" fill="#18181b" />
                        <circle cx="192" cy="107" r="7" fill="#3f3f46" stroke="url(#goldTrimStage)" strokeWidth="1" />
                      </g>

                      {/* Left Arm Rest */}
                      <g>
                        <path d="M 60 145 Q 48 190 52 230" fill="none" stroke="url(#maroonSuitStage)" strokeWidth="16" strokeLinecap="round" />
                        <circle cx="52" cy="235" r="7" fill="#f5c296" />
                      </g>

                      {/* Neck */}
                      <rect x="91" y="120" width="18" height="25" fill="#f5c296" />

                      {/* Head, Hair, Beard, Sunglasses */}
                      <g className="animate-character-head">
                        <path d="M 72 85 C 68 55, 132 55, 128 85 C 133 98, 130 115, 128 118 C 122 108, 120 85, 100 82 C 80 85, 78 108, 72 118 Z" fill="#18181b" />
                        <ellipse cx="100" cy="100" rx="26" ry="30" fill="#f5c296" />
                        <path d="M 78 102 C 80 128, 120 128, 122 102 C 125 125, 115 133, 100 133 C 85 133, 75 125, 78 102 Z" fill="#18181b" />
                        {/* Speaking Mouth */}
                        {anchor.isSpeaking ? (
                          <ellipse cx="100" cy="120" rx="6" ry="4" fill="#7f1d1d" className="animate-mouth-talk" />
                        ) : (
                          <path d="M 93 120 Q 100 123 107 120" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" fill="none" />
                        )}
                        {/* Sunglasses */}
                        <path d="M 77 92 L 95 92 C 95 101, 77 101, 77 92 Z" fill="#09090b" stroke="url(#goldTrimStage)" strokeWidth="1.2" />
                        <path d="M 105 92 L 123 92 C 123 101, 105 101, 105 92 Z" fill="#09090b" stroke="url(#goldTrimStage)" strokeWidth="1.2" />
                        <line x1="95" y1="94" x2="105" y2="94" stroke="url(#goldTrimStage)" strokeWidth="1.5" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Golden Crown Podium */}
                <div className="relative z-20 w-36 lg:w-44 -mt-14 flex flex-col items-center">
                  <div className="w-full h-4 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-t-lg shadow-md flex items-center justify-center">
                    <div className="w-12 h-1 bg-amber-200 rounded-full" />
                  </div>
                  <div className="w-32 lg:w-38 h-24 lg:h-28 bg-gradient-to-b from-amber-950 via-slate-900 to-black border-x-2 border-b-2 border-amber-500/80 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                    <Crown className="w-8 h-8 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-stadium-pulse" />
                    <span className="text-[9px] font-crown font-black text-amber-300 tracking-widest uppercase mt-1">
                      CHAMPIONS
                    </span>
                  </div>
                  <div className="w-40 lg:w-48 h-3.5 bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 rounded-b-xl shadow-xl" />
                  {/* Ground Shadow */}
                  <div className="w-48 h-4 desk-ground-shadow rounded-full -mt-1 pointer-events-none" />
                </div>
              </div>

              {/* 3. TEAM TITANS (RIGHT CURVED BLUE DESK WITH 5 GAMING CHAIRS & MOVING CHARACTERS) */}
              <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
                {/* 5 Gaming Chairs behind desk */}
                <div className="w-full flex justify-around items-end gap-1 px-1">
                  {titansSeats.map(seat => (
                    <div 
                      key={seat.id} 
                      className={`relative flex flex-col items-center transition-all duration-500 ${
                        seat.isLocked ? 'scale-90 opacity-60' : 'scale-100 opacity-100'
                      }`}
                    >
                      {/* Chair Unit with Gold Crown Headrest */}
                      <div 
                        onClick={() => seat.isLocked ? handleUnlockChair(seat.id) : seat.contestant && handleContestantBuzzer(seat.contestant)}
                        className="relative w-14 lg:w-16 h-28 lg:h-32 flex flex-col items-center justify-end cursor-pointer group hover:scale-105 transition-transform"
                        title={seat.isLocked ? 'Click to Unlock Seat & Call Friend' : 'Click to Hit Buzzer!'}
                      >
                        {/* Chair Backrest with Golden Crown */}
                        <div className="absolute inset-x-0 top-0 bottom-4 rounded-t-xl bg-gradient-to-b from-[#1a1e29] to-[#0a0d14] border-2 border-sky-500/80 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex flex-col items-center pt-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <div className="w-full h-0.5 bg-sky-500/40 my-1" />
                        </div>

                        {/* Seated Contestant Character (Moving!) */}
                        {seat.contestant && (
                          <div className="relative z-10 flex flex-col items-center mb-1">
                            {/* Moving Character Head */}
                            <div className="relative w-9 h-9 animate-character-head">
                              <div className="w-8 h-8 rounded-full bg-amber-200 border border-amber-400 relative overflow-hidden shadow">
                                <div className="absolute top-0 inset-x-0 h-3 bg-slate-900" />
                                <div className="absolute top-3.5 inset-x-1.5 flex justify-between">
                                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                                </div>
                              </div>
                              {/* Esports Headset with Mic */}
                              <div className="absolute -inset-0.5 rounded-full border-t-2 border-slate-950 pointer-events-none" />
                              <div className="absolute -left-0.5 top-2 w-2 h-3 bg-slate-950 rounded-sm" />
                              <div className="absolute -right-0.5 top-2 w-2 h-3 bg-slate-950 rounded-sm" />
                            </div>

                            {/* Blue Wolf Jersey & Moving Body */}
                            <div className={`w-11 h-9 rounded-t-lg bg-gradient-to-b from-sky-600 to-blue-800 border-t border-sky-400 flex flex-col items-center justify-center shadow-lg ${
                              seat.contestant.isBuzzed ? 'animate-buzzer-hit' : 'animate-idle-breathe'
                            }`}>
                              <span className="text-[9px] font-black font-mono text-white leading-none">
                                #{seat.contestant.jerseyNumber}
                              </span>
                              <span className="text-[7px] font-bold text-white uppercase tracking-wider truncate max-w-[40px]">
                                {seat.contestant.name.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* If seat is locked, show padlock */}
                        {seat.isLocked && (
                          <div className="relative z-10 flex flex-col items-center mb-4">
                            <div className="w-6 h-6 rounded-full bg-slate-950/90 border border-amber-400 flex items-center justify-center shadow-lg">
                              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <span className="text-[8px] font-bold text-amber-300 mt-1 uppercase">CALL</span>
                          </div>
                        )}

                        {/* Hydraulic Column & Heavy 5-Star Base Touching Floor */}
                        <div className="w-2.5 h-4 bg-slate-800" />
                        <div className="w-12 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
                        {/* Ground Contact Shadow (Guarantees zero floating!) */}
                        <div className="w-14 h-2 chair-base-shadow rounded-full pointer-events-none -mt-1" />
                      </div>

                      {/* Seat Number Tag */}
                      <span className="text-[8px] font-mono font-bold text-sky-400/90 mt-0.5">
                        S{seat.seatIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Team Titans Curved Glowing Blue Desk */}
                <div className="w-full relative -mt-1 flex flex-col items-center">
                  {/* Glowing Desk Top with Buzzers */}
                  <div className="w-full h-6 bg-gradient-to-r from-sky-600 via-blue-500 to-sky-700 rounded-t-2xl border-t border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.8)] flex items-center justify-around px-4">
                    {titansSeats.map(seat => (
                      <button
                        key={seat.id}
                        disabled={seat.isLocked}
                        onClick={() => seat.contestant && handleContestantBuzzer(seat.contestant)}
                        className={`w-5 h-3 rounded-full transition-all cursor-pointer ${
                          seat.contestant?.isBuzzed 
                            ? 'bg-amber-300 shadow-[0_0_15px_rgba(252,211,77,1)] scale-125' 
                            : 'bg-blue-950 hover:bg-sky-400 border border-sky-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Desk Front Panel with TEAM TITANS Wolf Emblem */}
                  <div className="w-full h-16 bg-gradient-to-b from-sky-950 via-slate-950 to-black border-x-2 border-b-2 border-sky-500 rounded-b-2xl px-4 flex items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-400 flex items-center justify-center shadow-lg shadow-sky-600/50">
                        <Shield className="w-6 h-6 text-sky-400 fill-sky-500 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-base lg:text-lg font-black font-display tracking-wider text-white uppercase block leading-none">
                          TEAM TITANS
                        </span>
                        <span className="text-[9px] font-bold text-sky-400 tracking-widest font-mono">
                          CRYO BATTLE STATION
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base lg:text-lg font-black font-mono text-sky-300">
                        {titansScore} PTS
                      </span>
                    </div>
                  </div>

                  {/* Ground Contact Shadow under table */}
                  <div className="w-full h-4 desk-ground-shadow rounded-full -mt-2 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. SLEEK STAGE BROADCAST CONTROL BAR (CAMERA SWITCHER & ACTIONS) */}
      <div className="relative z-40 w-full px-4 lg:px-8 py-3 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Camera Angles Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <div className="flex items-center gap-1 px-2 text-[10px] uppercase font-bold text-amber-400 font-mono">
            <Video className="w-3.5 h-3.5" />
            <span>Camera</span>
          </div>
          <button
            onClick={() => handleSwitchCamera('arena-circular')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              camera === 'arena-circular' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Stadium Orbit 3D (Angle 1)
          </button>
          <button
            onClick={() => handleSwitchCamera('broadcast-front')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              camera === 'broadcast-front' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Broadcast Front (Angle 2)
          </button>
          <button
            onClick={() => handleSwitchCamera('anchor-closeup')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              camera === 'anchor-closeup' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Anchor Cam
          </button>
        </div>

        {/* Live Stage Actions */}
        <div className="flex items-center gap-2">
          {/* Host Speech Trigger */}
          <button
            onClick={() => onAnchorSpeak('Hello everyone! Welcome to Champions Tera Bhai! Today is battle night!', 'welcome')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Host: "Hello Everyone!"</span>
          </button>

          {/* Buzzer Race Face-Off */}
          <button
            onClick={handleTriggerBuzzerRace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Face-Off Buzzer!</span>
          </button>

          {/* Grand Crowning Moment */}
          <button
            onClick={handleCrowningCeremony}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Crown Champion</span>
          </button>
        </div>
      </div>

      {/* QUICK IN-STAGE FRIEND SUMMON POPUP */}
      {isFriendInvitePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-950 border-2 border-amber-400 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Summon Friend to Stage Chair
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select which friend to summon onto the stage panel:
            </p>

            <div className="space-y-2 mb-4">
              {PRESET_FRIENDS_TO_CALL.map((friend, idx) => (
                <button
                  key={idx}
                  onClick={() => confirmSummonFriend(idx)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:bg-slate-800/80 text-left flex items-center justify-between transition-all cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{friend.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">#{friend.jerseyNumber} · {friend.role}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold">
                    Unlock Chair →
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFriendInvitePopupOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
