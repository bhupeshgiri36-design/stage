import React from 'react';
import { Crown, Flame, Shield, Zap, Sparkles, Trophy } from 'lucide-react';

export const BigScreenDisplay = ({
  currentRound,
  infernoScore,
  titansScore,
  activeQuestion,
  buzzedContestantName,
  buzzedTeam,
  onNextQuestion,
  onAwardPoints,
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border-2 border-amber-400/50 p-4 lg:p-6 shadow-[0_0_50px_rgba(251,191,36,0.15)] overflow-hidden">
      {/* Curved Screen Edge Reflection */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-75" />

      {/* Screen Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        {/* Inferno Live Metric */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-400 font-display">TEAM INFERNO</span>
            <div className="text-lg lg:text-xl font-black font-mono text-rose-300 leading-none">
              {infernoScore} PTS
            </div>
          </div>
        </div>

        {/* Center Golden Crown Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Crown className="w-4 h-4" />
            <span className="text-xs lg:text-sm font-crown font-black tracking-widest uppercase">
              CHAMPIONS TERA BHAI
            </span>
          </div>
          <span className="text-[10px] text-amber-300/80 font-medium tracking-wide uppercase">
            A REALITY COMPETITION SHOW
          </span>
        </div>

        {/* Titans Live Metric */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-400 font-display">TEAM TITANS</span>
            <div className="text-lg lg:text-xl font-black font-mono text-sky-300 leading-none">
              {titansScore} PTS
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Screen Content: Depends on current round */}
      {currentRound === 'buzzer-duel' && activeQuestion ? (
        <div className="space-y-4">
          {/* Question Banner */}
          <div className="p-3 lg:p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <div className="flex items-center justify-between text-xs text-amber-400/90 font-mono mb-1">
              <span>CATEGORY: {activeQuestion.category}</span>
              <span className="font-bold text-amber-300">+{activeQuestion.points} POINTS</span>
            </div>
            <h4 className="text-base lg:text-lg font-bold text-white text-center leading-snug">
              {activeQuestion.question}
            </h4>
          </div>

          {/* Buzzer Alert Banner if someone pressed */}
          {buzzedContestantName && buzzedTeam ? (
            <div className={`p-3 rounded-lg border flex items-center justify-between animate-pulse ${
              buzzedTeam === 'inferno' 
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-600/30'
                : 'bg-sky-950/80 border-sky-500 text-sky-200 shadow-lg shadow-sky-600/30'
            }`}>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold">BUZZER LOCKED IN!</span>
                  <p className="text-sm font-extrabold text-white">
                    {buzzedContestantName} ({buzzedTeam === 'inferno' ? 'Team Inferno' : 'Team Titans'})
                  </p>
                </div>
              </div>

              {/* Award or Penalize Points */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAwardPoints(buzzedTeam, activeQuestion.points)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow cursor-pointer"
                >
                  Correct (+{activeQuestion.points})
                </button>
                <button
                  onClick={() => onAwardPoints(buzzedTeam, -50)}
                  className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded shadow cursor-pointer"
                >
                  Incorrect (-50)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-2 rounded bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-xs text-amber-300/80 font-mono animate-pulse">
                AWAITING BUZZER PRESS FROM ANY SEAT...
              </span>
            </div>
          )}

          {/* Question Options */}
          <div className="grid grid-cols-2 gap-2.5">
            {activeQuestion.options.map((opt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80 text-xs lg:text-sm text-slate-200 flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-md bg-slate-800 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="truncate">{opt}</span>
              </div>
            ))}
          </div>

          {/* Next Question Control */}
          <div className="flex justify-end pt-1">
            <button
              onClick={onNextQuestion}
              className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              Next Arena Question →
            </button>
          </div>
        </div>
      ) : currentRound === 'crowning' ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center animate-bounce shadow-xl shadow-amber-500/40">
            <Trophy className="w-9 h-9 text-amber-300" />
          </div>
          <h3 className="text-xl lg:text-2xl font-crown font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 uppercase">
            {infernoScore >= titansScore ? 'TEAM INFERNO IS CROWNED!' : 'TEAM TITANS IS CROWNED!'}
          </h3>
          <p className="text-xs lg:text-sm text-slate-300 max-w-md mx-auto">
            The grand trophy of Champions Tera Bhai has found its rightful winner! Pure fire, legendary game!
          </p>
        </div>
      ) : (
        /* Default Arena Welcome Screen */
        <div className="py-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 tracking-wider uppercase font-display">
              STAGE LIVE BROADCAST
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-lg lg:text-xl font-extrabold text-white">
            WELCOME FRIENDS TO THE BATTLE DESKS!
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Click on any locked chair to trigger the dramatic reality show unlock ceremony and bring your friends to the live stage!
          </p>
        </div>
      )}
    </div>
  );
};
