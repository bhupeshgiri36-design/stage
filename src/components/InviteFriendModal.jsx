import React, { useState } from 'react';
import { X, UserPlus, Flame, Shield, Sparkles, Check, Copy } from 'lucide-react';
import { PRESET_FRIENDS_TO_CALL } from '../data/defaultContestants.js';

export const InviteFriendModal = ({
  isOpen,
  onClose,
  seats,
  onConfirmInvite,
  initialSeatId,
}) => {
  const [selectedSeatId, setSelectedSeatId] = useState(
    initialSeatId || seats.find(s => s.isLocked)?.id || seats[0]?.id
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('Reality Star');
  const [customJersey, setCustomJersey] = useState(10);
  const [customCatchphrase, setCustomCatchphrase] = useState('Champions Tera Bhai trophy meri hai!');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const currentSelectedSeat = seats.find(s => s.id === selectedSeatId) || seats[0];
  const targetTeam = currentSelectedSeat.team;

  const handleSelectPreset = (idx) => {
    setSelectedPresetIndex(idx);
    const p = PRESET_FRIENDS_TO_CALL[idx];
    setCustomName(p.name);
    setCustomRole(p.role);
    setCustomJersey(p.jerseyNumber);
    setCustomCatchphrase(p.catchphrase);
  };

  const handleSummon = () => {
    const activePreset = PRESET_FRIENDS_TO_CALL[selectedPresetIndex];
    const friendName = customName.trim() || activePreset.name;
    const role = customRole.trim() || activePreset.role;
    const jersey = customJersey || activePreset.jerseyNumber;
    const catchphrase = customCatchphrase.trim() || activePreset.catchphrase;

    onConfirmInvite(selectedSeatId, {
      name: friendName,
      nickname: activePreset.nickname,
      team: targetTeam,
      role: role,
      jerseyNumber: jersey,
      avatarId: activePreset.avatarId,
      catchphrase: catchphrase,
    });
    onClose();
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/?inviteChair=${selectedSeatId}`;
    navigator.clipboard?.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-amber-500/70 rounded-2xl shadow-2xl shadow-amber-500/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Summon Friend to Reality Show Panel
              </h3>
              <p className="text-xs text-amber-300/80">
                Unlock chair on live stage & trigger broadcast entrance sequence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Select Seat on Stage */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Select Stage Seat to Unlock
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Inferno Seats */}
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>TEAM INFERNO DESK</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {seats.filter(s => s.team === 'inferno').map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => setSelectedSeatId(seat.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                        selectedSeatId === seat.id
                          ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                          : seat.isLocked
                          ? 'bg-slate-900 text-rose-300 border-rose-500/30 hover:border-rose-400'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      <div className="font-bold">Seat #{seat.seatIndex + 1}</div>
                      <div className="text-[10px] opacity-80">
                        {seat.isLocked ? '🔒 Locked' : seat.contestant?.name.split(' ')[0] || 'Occupied'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Titans Seats */}
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>TEAM TITANS DESK</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {seats.filter(s => s.team === 'titans').map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => setSelectedSeatId(seat.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                        selectedSeatId === seat.id
                          ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/30'
                          : seat.isLocked
                          ? 'bg-slate-900 text-sky-300 border-sky-500/30 hover:border-sky-400'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      <div className="font-bold">Seat #{seat.seatIndex + 1}</div>
                      <div className="text-[10px] opacity-80">
                        {seat.isLocked ? '🔒 Locked' : seat.contestant?.name.split(' ')[0] || 'Occupied'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Choose Friend Profile */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Quick Invite Ready Friends (or Custom Name)
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {PRESET_FRIENDS_TO_CALL.map((friend, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-3 py-2 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-300">{friend.name}</div>
                  <div className="text-[10px] text-slate-400">{friend.role}</div>
                </button>
              ))}
            </div>

            {/* Custom Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Friend Full Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Rahul, Aman, Priya..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Contestant Title / Role</label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Buzzer Master, Wildcard"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Jersey Number</label>
                <input
                  type="number"
                  value={customJersey}
                  onChange={(e) => setCustomJersey(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Entrance Catchphrase</label>
                <input
                  type="text"
                  value={customCatchphrase}
                  onChange={(e) => setCustomCatchphrase(e.target.value)}
                  placeholder="Catchphrase on stage"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Shareable Invite Simulation */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-300">Invite Link for Friend</span>
              <p className="text-[10px] text-slate-400">Share with friend so they can see their stage chair!</p>
            </div>
            <button
              onClick={handleCopyInviteLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer with Primary Action */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSummon}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Summon to Stage & Unlock Chair!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
