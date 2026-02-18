'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[DML] SW registration failed:', err);
      });
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const dismiss = () => setShowBanner(false);

  return { showBanner, install, dismiss };
}

export function PWAInstallBanner() {
  const { showBanner, install, dismiss } = usePWA();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1d24] border border-[#2a2d3a] rounded-xl shadow-2xl">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          D
        </div>
        <div>
          <p className="text-sm font-semibold text-[#e2e4ed]">Install DML Editor</p>
          <p className="text-xs text-[#555874]">Use offline, app-like experience</p>
        </div>
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-[#818cf8] text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Install
        </button>
        <button
          onClick={dismiss}
          className="p-1 rounded hover:bg-[#252a36] text-[#555874] hover:text-[#8b8fa8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
