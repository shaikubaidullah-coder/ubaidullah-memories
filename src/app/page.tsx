'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AudioPlayer } from '@/components/AudioPlayer';

// Dynamically import scenes with Three.js / Canvas to ensure client-only rendering
const IntroScene = dynamic(() => import('@/components/scenes/IntroScene').then((m) => m.IntroScene), {
  ssr: false,
});
const DuoScene = dynamic(() => import('@/components/scenes/DuoScene').then((m) => m.DuoScene), {
  ssr: false,
});
const MemoriesScene = dynamic(() => import('@/components/scenes/MemoriesScene').then((m) => m.MemoriesScene), {
  ssr: false,
});
const LetterScene = dynamic(() => import('@/components/scenes/LetterScene').then((m) => m.LetterScene), {
  ssr: false,
});
const CapsuleScene = dynamic(() => import('@/components/scenes/CapsuleScene').then((m) => m.CapsuleScene), {
  ssr: false,
});
const SkyScene = dynamic(() => import('@/components/scenes/SkyScene').then((m) => m.SkyScene), {
  ssr: false,
});

export default function Home() {
  const [scene, setScene] = useState<'intro' | 'us' | 'memories' | 'letter' | 'rocket' | 'sky'>('intro');
  const [autoPlayTrigger, setAutoPlayTrigger] = useState(false);

  const handleReplay = () => {
    setScene('intro');
    setAutoPlayTrigger(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <main className="w-full min-h-screen bg-paper overflow-hidden relative">
      {scene === 'intro' && (
        <IntroScene
          onOpenComplete={() => setScene('us')}
          onEnvelopeOpen={() => setAutoPlayTrigger(true)}
        />
      )}

      {scene === 'us' && (
        <DuoScene onContinue={() => setScene('memories')} />
      )}

      {scene === 'memories' && (
        <MemoriesScene
          onContinue={() => setScene('letter')}
          onReplay={handleReplay}
        />
      )}

      {scene === 'letter' && (
        <LetterScene
          onContinue={() => setScene('rocket')}
          onBackToDesk={() => setScene('memories')}
          onReplay={handleReplay}
        />
      )}

      {scene === 'rocket' && (
        <CapsuleScene
          onContinue={() => setScene('sky')}
          onBackToLetter={() => setScene('letter')}
          onReplay={handleReplay}
        />
      )}

      {scene === 'sky' && (
        <SkyScene onContinue={handleReplay} />
      )}

      {/* Global Persistent Floating Audio Player */}
      <AudioPlayer scene={scene} autoPlayTrigger={autoPlayTrigger} />
    </main>
  );
}
