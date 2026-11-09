import React, { useState } from 'react';
import { Sparkles, Send, ArrowRight, Tv, Users, Flame, Shield } from 'lucide-react';
import { PRESET_FRIENDS_TO_CALL } from '../data/defaultContestants.js';

export const BackstageLobbyView = ({
  seats,
  onCallFriendToStage,
  onSwitchToStage,
}) => {
  const [messages, setMessages] = useState([
    { sender: 'Aman Sharma', text: 'Tera bhai Inferno desk pe aag laga dega!', time: '10:42 PM', team: 'inferno' },
    { sender: 'Kabir Verma', text: 'Titans defense is impenetrable tonight. Bring it on.', time: '10:43 PM', team: 'titans' },
    { sender: 'Anchor (Tera Bhai)', text: 'Chairs are getting unlocked! Who wants to step up to the stage next?', time: '10:44 PM' }
  ]);
  const [newInput, setNewInput] = useState('');

  const emptyInfernoSeats = seats.filter(s => s.team === 'inferno' && s.isLocked).length;
  const emptyTitansSeats = seats.filter(s => s.team === 'titans' && s.isLocked).length;

  const handleSendMessage = () => {
    if (!newInput.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: 'You (VIP Guest)',
        text: newInput.trim(),
        time: 'Just now'
      }
    ]);
    setNewInput('');
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[580px] bg-gradient-to-b from-slate-950 via-[#0a0d18] to-black p-4 lg:p-8 overflow-y-auto select-none">
      {/* Background Studio Ambient Neon */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lobby Header */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 font-display">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>VIP BACKSTAGE GREEN ROOM & LOBBY</span>
          </div>
          <h2 className="text-xl lg:text-3xl font-extrabold text-white mt-1">
            Champions Tera Bhai Competitor Lounge
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Where invited friends chill, prep their tactics, and wait for the Anchor to summon them to the live stage.
          </p>
        </div>

        <button
          onClick={onSwitchToStage}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-bold text-xs lg:text-sm rounded-xl shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <span>Enter Live Stage Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Waiting Contestants & Live Broadcast Feed & Banter Room */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Friends Ready to Enter Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Available Friends in Green Room</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Available Stage Slots: {emptyInfernoSeats} Inferno / {emptyTitansSeats} Titans
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRESET_FRIENDS_TO_CALL.map((friend, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all shadow-xl group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-base shadow">
                      #{friend.jerseyNumber}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {friend.name}
                      </h4>
                      <span className="text-[11px] text-amber-400/90 font-medium">
                        "{friend.nickname}" · {friend.role}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic my-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  "{friend.catchphrase}"
                </p>

                {/* Call To Stage Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <button
                    disabled={emptyInfernoSeats === 0}
                    onClick={() => onCallFriendToStage(idx, 'inferno')}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600/90 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-[11px] font-bold text-white flex items-center justify-center gap-1 transition-all shadow cursor-pointer"
                  >
                    <Flame className="w-3 h-3" />
                    <span>Send to Inferno</span>
                  </button>
                  <button
                    disabled={emptyTitansSeats === 0}
                    onClick={() => onCallFriendToStage(idx, 'titans')}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-sky-600/90 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-[11px] font-bold text-white flex items-center justify-center gap-1 transition-all shadow cursor-pointer"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Send to Titans</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Live Broadcast Monitor & Backstage Banter */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Backstage Live Feed TV Monitor */}
          <div className="rounded-2xl bg-slate-950 border-2 border-amber-500/40 p-3 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                  LIVE BROADCAST FEED (STAGE CAM 1)
                </span>
              </div>
              <Tv className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* Stage Thumbnail Preview */}
            <div 
              onClick={onSwitchToStage}
              className="relative w-full h-36 rounded-xl overflow-hidden cursor-pointer group border border-slate-800"
            >
              <img
                src="/public/assets/aistudio/image_756983fa.png"
                alt="Stage Monitor"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-amber-400 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  <span>Click to Return to Stage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Green Room Contestant Banter Chat */}
          <div className="flex-1 rounded-2xl bg-slate-900/70 border border-slate-800 p-4 flex flex-col justify-between shadow-xl min-h-[260px]">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                Live Backstage Banter & Strategy
              </span>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {messages.map((msg, i) => (
                  <div key={i} className="text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-bold ${
                        msg.team === 'inferno' ? 'text-rose-400' : msg.team === 'titans' ? 'text-sky-400' : 'text-amber-400'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-slate-300 leading-snug">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Input message */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
              <input
                type="text"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Send banter to contestants..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
