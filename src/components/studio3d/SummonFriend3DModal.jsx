import React, { useState } from 'react';
import { X, UserPlus, Flame, Shield, Sparkles } from 'lucide-react';
import { useStageStore } from '../../store/useStageStore.js';
import { PRESET_FRIENDS_TO_CALL } from '../../data/defaultContestants.js';

export const SummonFriend3DModal = ({
  isOpen,
  onClose,
  initialChairId,
}) => {
  const chairs = useStageStore((s) => s.chairs);
  const contestants = useStageStore((s) => s.contestants);
  const summonFriendToChair = useStageStore((s) => s.summonFriendToChair);

  const [selectedChairId, setSelectedChairId] = useState(
    initialChairId || chairs[0]?.id || 'inferno-seat-0'
  );
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customJersey, setCustomJersey] = useState(10);
  const [customRole, setCustomRole] = useState('Stage Champion');

  if (!isOpen) return null;

  const handleSelectPreset = (idx) => {
    setSelectedPresetIdx(idx);
    const p = PRESET_FRIENDS_TO_CALL[idx];
    setCustomName(p.name);
    setCustomJersey(p.jerseyNumber);
    setCustomRole(p.role);
  };

  const handleSummon = () => {
    const p = PRESET_FRIENDS_TO_CALL[selectedPresetIdx];
    const friendName = customName.trim() || p.name;

    summonFriendToChair(selectedChairId, {
      name: friendName,
      nickname: p.nickname,
      role: customRole || p.role,
      jerseyNumber: customJersey || p.jerseyNumber,
      avatarId: p.avatarId,
      catchphrase: p.catchphrase,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-none">
      <div className="relative w-full max-w-xl bg-slate-950 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Summon Friend to 3D Stage Chair
              </h3>
              <p className="text-xs text-amber-300/80">
                Unlock chair on live stage with hydraulic sound & 3D entrance
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* 1. Choose Stage Chair */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Select Stage Chair (10 Total: 5 Inferno / 5 Titans)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Inferno Chairs */}
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>TEAM INFERNO DESK (RED)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {chairs
                    .filter((c) => c.team === 'inferno')
                    .map((chair) => {
                      const occupant = chair.contestantId ? contestants[chair.contestantId] : null;
                      return (
                        <button
                          key={chair.id}
                          onClick={() => setSelectedChairId(chair.id)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedChairId === chair.id
                              ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/40'
                              : 'bg-slate-900/90 text-rose-300 border-rose-500/30 hover:border-rose-400'
                          }`}
                        >
                          <div>Seat #{chair.seatIndex + 1}</div>
                          <div className="text-[9px] opacity-80 truncate">
                            {occupant ? occupant.name : 'Vacant'}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Titans Chairs */}
              <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>TEAM TITANS DESK (BLUE)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {chairs
                    .filter((c) => c.team === 'titans')
                    .map((chair) => {
                      const occupant = chair.contestantId ? contestants[chair.contestantId] : null;
                      return (
                        <button
                          key={chair.id}
                          onClick={() => setSelectedChairId(chair.id)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedChairId === chair.id
                              ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/40'
                              : 'bg-slate-900/90 text-sky-300 border-sky-500/30 hover:border-sky-400'
                          }`}
                        >
                          <div>Seat #{chair.seatIndex + 1}</div>
                          <div className="text-[9px] opacity-80 truncate">
                            {occupant ? occupant.name : 'Vacant'}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Quick Choose Friend Profile */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Choose Friend Profile or Type Custom Name
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {PRESET_FRIENDS_TO_CALL.map((friend, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-3 py-2 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                    selectedPresetIdx === idx
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-300">{friend.name}</div>
                  <div className="text-[10px] text-slate-400">{friend.role}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Friend Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Rahul, Priya, Kabir..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Jersey Number</label>
                <input
                  type="number"
                  value={customJersey}
                  onChange={(e) => setCustomJersey(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSummon}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Assign to Stage Chair & Summon!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
