'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MusicProvider } from '@/context/MusicContext';

// Dynamically import all scenes for smooth client-only rendering
const IntroScene = dynamic(() => import('@/components/scenes/IntroScene').then((m) => m.IntroScene), { ssr: false });
const DuoScene = dynamic(() => import('@/components/scenes/DuoScene').then((m) => m.DuoScene), { ssr: false });
const MemoriesScene = dynamic(() => import('@/components/scenes/MemoriesScene').then((m) => m.MemoriesScene), { ssr: false });
const MixtapeScene = dynamic(() => import('@/components/scenes/MixtapeScene').then((m) => m.MixtapeScene), { ssr: false });
const JourneyScene = dynamic(() => import('@/components/scenes/JourneyScene').then((m) => m.JourneyScene), { ssr: false });
const LetterScene = dynamic(() => import('@/components/scenes/LetterScene').then((m) => m.LetterScene), { ssr: false });
const CapsuleScene = dynamic(() => import('@/components/scenes/CapsuleScene').then((m) => m.CapsuleScene), { ssr: false });
const LanternsScene = dynamic(() => import('@/components/scenes/LanternsScene').then((m) => m.LanternsScene), { ssr: false });
const SkyScene = dynamic(() => import('@/components/scenes/SkyScene').then((m) => m.SkyScene), { ssr: false });

export type SceneType =
  | 'intro'
  | 'us'
  | 'memories'
  | 'mixtape'
  | 'journey'
  | 'letter'
  | 'capsule'
  | 'lanterns'
  | 'sky';

function ScrapbookApp() {
  const [scene, setScene] = useState<SceneType>('intro');
  const [autoPlayTrigger, setAutoPlayTrigger] = useState(false);

  const handleReplay = () => {
    setScene('intro');
    setAutoPlayTrigger(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <main className="w-full min-h-screen bg-paper overflow-hidden relative">
      {/* 1. Intro 3D Desk & Envelope */}
      {scene === 'intro' && (
        <IntroScene
          onOpenComplete={() => setScene('us')}
          onEnvelopeOpen={() => setAutoPlayTrigger(true)}
        />
      )}

      {/* 2. The Duo / Brotherhood Chapter */}
      {scene === 'us' && (
        <DuoScene onContinue={() => setScene('memories')} />
      )}

      {/* 3. Memories Desk & Studio (lofi-cam, vault album) */}
      {scene === 'memories' && (
        <MemoriesScene
          onContinue={() => setScene('mixtape')}
          onReplay={handleReplay}
        />
      )}

      {/* 4. Retro Mixtape Deck & Cassette */}
      {scene === 'mixtape' && (
        <MixtapeScene
          onContinue={() => setScene('journey')}
          onBack={() => setScene('memories')}
        />
      )}

      {/* 5. Memory Journey & Milestones Roadmap */}
      {scene === 'journey' && (
        <JourneyScene
          onContinue={() => setScene('letter')}
          onBack={() => setScene('mixtape')}
        />
      )}

      {/* 6. Unfolding Handwritten Letter */}
      {scene === 'letter' && (
        <LetterScene
          onContinue={() => setScene('capsule')}
          onBackToDesk={() => setScene('journey')}
          onReplay={handleReplay}
        />
      )}

      {/* 7. The Time Capsule Jar */}
      {scene === 'capsule' && (
        <CapsuleScene
          onContinue={() => setScene('lanterns')}
          onBackToLetter={() => setScene('letter')}
          onReplay={handleReplay}
        />
      )}

      {/* 8. Sky of Floating Wishing Lanterns in 3D */}
      {scene === 'lanterns' && (
        <LanternsScene
          onContinue={() => setScene('sky')}
          onBack={() => setScene('capsule')}
        />
      )}

      {/* 9. The Living Memory 3D Finale */}
      {scene === 'sky' && (
        <SkyScene onContinue={handleReplay} />
      )}

      {/* Global Persistent Floating Audio Player */}
      <AudioPlayer scene={scene} autoPlayTrigger={autoPlayTrigger} />
    </main>
  );
}

export default function Home() {
  return (
    <MusicProvider>
      <ScrapbookApp />
    </MusicProvider>
  );
}
