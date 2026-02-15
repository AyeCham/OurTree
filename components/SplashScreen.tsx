import React, { useState, useEffect } from 'react';
import { Book, Loader2 } from 'lucide-react';
import { SPLASH_LOGO_URL, INTRO_AUDIO_URL } from '../constants';

const SplashScreen: React.FC = () => {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio(INTRO_AUDIO_URL);
    audio.volume = 0.6; // Set comfortable volume
    
    // Attempt playback
    // Note: Modern browsers may block autoplay if no user interaction has occurred yet
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio autoplay blocked by browser policy:", error);
      });
    }

    // Cleanup audio on unmount to prevent lingering sound
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-1000 overflow-hidden">
      <div className="relative mb-10">
        {logoError ? (
          <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center text-[#DB8C29]">
            <Book size={80} />
          </div>
        ) : (
          <img
            src={SPLASH_LOGO_URL}
            alt="Intro Logo"
            className="w-72 h-72 object-contain animate-pulse-slow"
            style={{ filter: "drop-shadow(0 15px 30px rgba(219, 140, 41, 0.25))" }}
            onError={() => setLogoError(true)}
          />
        )}
      </div>
      <h1 className="text-6xl font-black italic text-[#DB8C29] tracking-tighter mb-4">Our Trees</h1>
      <div className="flex items-center gap-3 text-slate-300 font-bold text-sm uppercase tracking-[0.4em] opacity-80 mt-2">
        <Loader2 className="animate-spin" size={18} /> Loading System
      </div>
    </div>
  );
};

export default SplashScreen;