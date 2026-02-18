'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { buildPreviewDocument } from '@/preview/previewEngine';
import { useEditorStore } from '@/editor/editorStore';
import type { ConsoleEntry, ConsoleLevel } from '@/core/types';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Debounce delay for auto-run (ms)
const AUTO_RUN_DEBOUNCE = 800;

interface PreviewMessage {
  __dmlConsole: boolean;
  channel: string;
  level: ConsoleLevel;
  args: string[];
  timestamp: number;
}

export default function PreviewPanel() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const channelIdRef = useRef<string>(nanoid());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const files = useEditorStore((s) => s.files);
  const useTailwind = useEditorStore((s) => s.useTailwind);
  const autoRunEnabled = useEditorStore((s) => s.autoRunEnabled);
  const runTrigger = useEditorStore((s) => s.runTrigger);
  const addConsoleEntry = useEditorStore((s) => s.addConsoleEntry);

  // ── Listen for console messages from iframe ────────────────────
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data as Partial<PreviewMessage>;
      if (!data.__dmlConsole || data.channel !== channelIdRef.current) return;

      const entry: ConsoleEntry = {
        id: nanoid(),
        level: data.level ?? 'log',
        args: data.args ?? [],
        timestamp: data.timestamp ?? Date.now(),
      };

      addConsoleEntry(entry);

      // Auto-open console on errors
      if (data.level === 'error') {
        useEditorStore.getState().setConsoleOpen(true);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [addConsoleEntry]);

  // ── Render function ────────────────────────────────────────────
  const render = useCallback(() => {
    if (!iframeRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const html = buildPreviewDocument(files, useTailwind, channelIdRef.current);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const iframe = iframeRef.current;

      const handleLoad = () => {
        setIsLoading(false);
        URL.revokeObjectURL(url);
      };

      iframe.onload = handleLoad;
      iframe.src = url;
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Render failed');
    }
  }, [files, useTailwind]);

  // ── Auto-run on file changes ───────────────────────────────────
  useEffect(() => {
    if (!autoRunEnabled) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(render, AUTO_RUN_DEBOUNCE);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [files, useTailwind, autoRunEnabled, render]);

  // ── Manual run trigger ─────────────────────────────────────────
  useEffect(() => {
    if (runTrigger > 0) render();
  }, [runTrigger, render]);

  // ── Initial render ─────────────────────────────────────────────
  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full bg-white">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-[#1a1d24]/90 text-[#8b8fa8] text-xs px-2 py-1 rounded-full border border-[#2a2d3a]">
          <RefreshCw className="w-3 h-3 animate-spin-slow" />
          <span>Rendering…</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d0e11] z-10 p-8">
          <div className="flex flex-col items-center gap-3 text-center max-w-sm">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-[#e2e4ed] font-medium">Preview Error</p>
            <p className="text-xs text-[#8b8fa8] font-mono break-all">{error}</p>
            <button
              onClick={render}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        title="DML Preview"
        className="w-full h-full border-0"
        // Sandboxed: scripts allowed but top-navigation and modal blocked
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
}
