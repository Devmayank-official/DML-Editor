'use client';

import { useRef, useEffect } from 'react';
import { X, Trash2, ChevronDown } from 'lucide-react';
import { useEditorStore } from '@/editor/editorStore';
import type { ConsoleEntry, ConsoleLevel } from '@/core/types';
import { cn } from '@/lib/utils';

// ─── Level styles ─────────────────────────────────────────────────
const LEVEL_STYLES: Record<ConsoleLevel, string> = {
  log:   'text-[#e2e4ed]',
  info:  'text-[#3b82f6]',
  warn:  'text-[#f59e0b] bg-[#f59e0b0d]',
  error: 'text-[#ef4444] bg-[#ef44440d]',
  debug: 'text-[#8b8fa8]',
};

const LEVEL_BADGE: Record<ConsoleLevel, string> = {
  log:   'bg-[#2a2d3a] text-[#8b8fa8]',
  info:  'bg-[#3b82f620] text-[#3b82f6]',
  warn:  'bg-[#f59e0b20] text-[#f59e0b]',
  error: 'bg-[#ef444420] text-[#ef4444]',
  debug: 'bg-[#2a2d3a] text-[#555874]',
};

// ─── Single console entry ─────────────────────────────────────────
function ConsoleEntryRow({ entry }: { entry: ConsoleEntry }) {
  const time = new Date(entry.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const text = Array.isArray(entry.args)
    ? entry.args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
    : String(entry.args);

  return (
    <div
      className={cn(
        'flex gap-2 px-3 py-1.5 border-b border-[#1a1d24] font-mono text-xs leading-relaxed group hover:bg-[#1a1d24] transition-colors',
        LEVEL_STYLES[entry.level]
      )}
    >
      {/* Time */}
      <span className="shrink-0 text-[#555874] select-none">{time}</span>

      {/* Badge */}
      <span
        className={cn(
          'shrink-0 text-[10px] px-1 py-0.5 rounded uppercase font-semibold leading-none self-start mt-px',
          LEVEL_BADGE[entry.level]
        )}
      >
        {entry.level}
      </span>

      {/* Message */}
      <span className="break-all whitespace-pre-wrap flex-1">{text}</span>
    </div>
  );
}

// ─── Console Panel ────────────────────────────────────────────────
export default function ConsolePanel() {
  const consoleEntries = useEditorStore((s) => s.consoleEntries);
  const clearConsole = useEditorStore((s) => s.clearConsole);
  const setConsoleOpen = useEditorStore((s) => s.setConsoleOpen);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  // Auto-scroll to bottom unless user scrolled up
  useEffect(() => {
    if (autoScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleEntries]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    autoScrollRef.current = distFromBottom < 50;
  };

  const errorCount = consoleEntries.filter((e) => e.level === 'error').length;
  const warnCount = consoleEntries.filter((e) => e.level === 'warn').length;

  return (
    <div className="flex flex-col h-full bg-[#0d0e11] border-t border-[#2a2d3a]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#2a2d3a] bg-[#13151a] shrink-0">
        <span className="text-xs font-semibold text-[#8b8fa8] uppercase tracking-wider">
          Console
        </span>

        {/* Error / warn counters */}
        {errorCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ef444420] text-[#ef4444] font-semibold">
            {errorCount} error{errorCount !== 1 ? 's' : ''}
          </span>
        )}
        {warnCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b20] text-[#f59e0b] font-semibold">
            {warnCount} warn{warnCount !== 1 ? 's' : ''}
          </span>
        )}

        <div className="flex-1" />

        <button
          onClick={clearConsole}
          className="p-1 rounded hover:bg-[#1a1d24] text-[#555874] hover:text-[#8b8fa8] transition-colors"
          title="Clear console"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setConsoleOpen(false)}
          className="p-1 rounded hover:bg-[#1a1d24] text-[#555874] hover:text-[#8b8fa8] transition-colors"
          title="Close console"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Entries */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {consoleEntries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-[#555874] font-mono">No console output yet</p>
          </div>
        ) : (
          <>
            {consoleEntries.map((entry) => (
              <ConsoleEntryRow key={entry.id} entry={entry} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
}
