import React, { useState } from 'react';
import { StudioScene } from './components/studio3d/StudioScene.jsx';
import { StudioHUD } from './components/studio3d/StudioHUD.jsx';
import { SummonFriend3DModal } from './components/studio3d/SummonFriend3DModal.jsx';

export default function App() {
  const [isSummonModalOpen, setIsSummonModalOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030408]">
      {/* 1. Real 3D Studio Scene (React Three Fiber + Three.js) */}
      <StudioScene />

      {/* 2. Broadcast Television HUD Overlay */}
      <StudioHUD onOpenSummonModal={() => setIsSummonModalOpen(true)} />

      {/* 3. Summon Friend to Chair Modal */}
      <SummonFriend3DModal
        isOpen={isSummonModalOpen}
        onClose={() => setIsSummonModalOpen(false)}
      />
    </div>
  );
}
