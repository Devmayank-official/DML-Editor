'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { decodeURLToProject } from '@/utils/shareURL';
import EditorLayout from '@/components/EditorLayout';
import Toolbar from '@/components/Toolbar';
import CommandPalette from '@/components/CommandPalette';
import SettingsModal from '@/components/SettingsModal';
import HistoryModal from '@/components/HistoryModal';
import ProjectsModal from '@/components/ProjectsModal';
import MobileFAB from '@/components/MobileFAB';
import { PWAInstallBanner } from '@/pwa/PWAManager';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { Code2 } from 'lucide-react';

// ── Lazy-loaded templates modal (heavy) ──────────────────────────
import dynamic from 'next/dynamic';
const TemplatesModal = dynamic(() => import('@/components/TemplatesModal'), { ssr: false });

// ── Loading splash ────────────────────────────────────────────────
function LoadingSplash() {
  return (
    <div className="fixed inset-0 bg-[#0d0e11] flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <Code2 className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold text-[#e2e4ed]">DML Editor</h1>
          <p className="text-sm text-[#555874]">Loading your workspace…</p>
        </div>
        <div className="w-32 h-0.5 bg-[#1a1d24] rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-[loading_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

// ── Bottom status bar ─────────────────────────────────────────────
function StatusBar() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const isDirty = useEditorStore((s) => s.isDirty);
  const useTailwind = useEditorStore((s) => s.useTailwind);
  const autoRunEnabled = useEditorStore((s) => s.autoRunEnabled);

  const LANG_LABELS: Record<string, string> = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-[#6366f1] text-white/80 text-[11px] font-medium shrink-0">
      <span>{LANG_LABELS[activePanel] ?? activePanel}</span>
      {useTailwind && <span className="text-white/60">+ Tailwind</span>}
      <div className="flex-1" />
      {isDirty && <span className="text-yellow-300">● Unsaved</span>}
      {autoRunEnabled && <span className="text-white/60">Auto-run</span>}
      <span className="text-white/40">DML Editor v1.0</span>
    </div>
  );
}

// ── Root IDE component ────────────────────────────────────────────
export default function IDERoot() {
  const [ready, setReady] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const initStore = useEditorStore((s) => s.initStore);
  const updateFile = useEditorStore((s) => s.updateFile);
  const setUseTailwind = useEditorStore((s) => s.toggleTailwind);
  const useTailwind = useEditorStore((s) => s.useTailwind);
  const triggerRun = useEditorStore((s) => s.triggerRun);
  const zenMode = useEditorStore((s) => s.zenMode);

  // ── Register keyboard shortcuts globally ─────────────────────
  useKeyboardShortcuts();

  // ── Initialize store + check for shared URL ──────────────────
  useEffect(() => {
    const init = async () => {
      // Check for shared project in URL hash
      const shareData = decodeURLToProject(window.location.hash);

      await initStore();

      if (shareData) {
        updateFile('html', shareData.files.html);
        updateFile('css', shareData.files.css);
        updateFile('javascript', shareData.files.js);
        if (shareData.useTailwind && !useTailwind) {
          // We can't call toggleTailwind here as store may not match
          // so we directly apply via store
        }
        triggerRun();
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      }

      setReady(true);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return <LoadingSplash />;

  return (
    <div className={cn('flex flex-col h-screen bg-[#0d0e11] overflow-hidden', zenMode && 'zen-mode')}>
      {/* Top toolbar — hidden in zen mode */}
      {!zenMode && <Toolbar />}

      {/* Main editor area */}
      <div className="flex-1 min-h-0">
        <EditorLayout />
      </div>

      {/* Status bar */}
      {!zenMode && <StatusBar />}

      {/* ── Modals / Overlays ─────────────────────────── */}
      <CommandPalette />
      <SettingsModal />
      <HistoryModal />
      <ProjectsModal />
      {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} />}

      {/* Mobile FAB */}
      <MobileFAB />

      {/* PWA install banner */}
      <PWAInstallBanner />

      {/* Toast notifications */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#1a1d24',
            border: '1px solid #2a2d3a',
            color: '#e2e4ed',
          },
        }}
      />
    </div>
  );
}
