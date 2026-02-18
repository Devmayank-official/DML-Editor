'use client';

import dynamic from 'next/dynamic';
import {
  PanelGroup, Panel, PanelResizeHandle
} from 'react-resizable-panels';
import { useEditorStore } from '@/editor/editorStore';
import ConsolePanel from '@/preview/ConsolePanel';
import type { PanelLanguage } from '@/core/types';
import { cn } from '@/lib/utils';
import { Code2, Globe, Terminal } from 'lucide-react';

// Lazy-load Monaco so it doesn't block initial render
const MonacoEditorPanel = dynamic(() => import('@/editor/MonacoEditorPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#13151a]">
      <div className="w-6 h-6 border-2 border-indigo-500/60 border-t-transparent rounded-full animate-spin-slow" />
    </div>
  ),
});

const PreviewPanel = dynamic(() => import('@/preview/PreviewPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin-slow" />
    </div>
  ),
});

const PANEL_COLORS: Record<PanelLanguage, string> = {
  html:       '#e06c75',
  css:        '#61afef',
  javascript: '#e5c07b',
  typescript: '#56b6c2',
};

// ── Editor Tabs ───────────────────────────────────────────────────
function EditorTabs() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const useTailwind = useEditorStore((s) => s.useTailwind);

  const panels: { id: PanelLanguage; label: string }[] = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: useTailwind ? 'CSS + Tailwind' : 'CSS' },
    { id: 'javascript', label: 'JS' },
  ];

  return (
    <div className="flex items-center gap-0 bg-[#13151a] border-b border-[#2a2d3a] overflow-x-auto">
      {panels.map((p) => (
        <button
          key={p.id}
          onClick={() => setActivePanel(p.id)}
          className={cn(
            'editor-tab flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap',
            activePanel === p.id
              ? 'text-[#e2e4ed] bg-[#1a1d24] active'
              : 'text-[#555874] hover:text-[#8b8fa8] hover:bg-[#1a1d24]/50'
          )}
          style={{
            borderBottom: activePanel === p.id ? `2px solid ${PANEL_COLORS[p.id]}` : '2px solid transparent',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: PANEL_COLORS[p.id] }}
          />
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ── Preview Header ────────────────────────────────────────────────
function PreviewHeader() {
  const consoleOpen = useEditorStore((s) => s.consoleOpen);
  const setConsoleOpen = useEditorStore((s) => s.setConsoleOpen);
  const consoleEntries = useEditorStore((s) => s.consoleEntries);
  const errorCount = consoleEntries.filter((e) => e.level === 'error').length;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#13151a] border-b border-[#2a2d3a]">
      <Globe className="w-3.5 h-3.5 text-[#555874]" />
      <span className="text-xs font-semibold text-[#555874] uppercase tracking-wider">Preview</span>
      <div className="flex-1" />
      <button
        onClick={() => setConsoleOpen(!consoleOpen)}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors',
          consoleOpen
            ? 'bg-[#252a36] text-[#e2e4ed]'
            : 'text-[#555874] hover:bg-[#1a1d24] hover:text-[#8b8fa8]'
        )}
        title="Toggle Console (⌘`)"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Console</span>
        {errorCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
            {errorCount > 9 ? '9+' : errorCount}
          </span>
        )}
      </button>
    </div>
  );
}

// ── Editor pane (tabs + monaco) ───────────────────────────────────
function EditorPane() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const files = useEditorStore((s) => s.files);
  const updateFile = useEditorStore((s) => s.updateFile);

  const value =
    activePanel === 'html' ? files.html :
    activePanel === 'css' ? files.css :
    files.js;

  return (
    <div className="flex flex-col h-full min-h-0">
      <EditorTabs />
      <div className="flex-1 min-h-0">
        <MonacoEditorPanel
          panelId={activePanel}
          value={value}
          onChange={(v) => updateFile(activePanel, v)}
        />
      </div>
    </div>
  );
}

// ── Preview pane (preview + console) ─────────────────────────────
function PreviewPane() {
  const consoleOpen = useEditorStore((s) => s.consoleOpen);

  return (
    <div className="flex flex-col h-full min-h-0">
      <PreviewHeader />
      <div className="flex-1 min-h-0 overflow-hidden">
        {consoleOpen ? (
          <PanelGroup direction="vertical">
            <Panel defaultSize={65} minSize={20}>
              <PreviewPanel />
            </Panel>
            <PanelResizeHandle className="h-[3px] bg-[#2a2d3a] hover:bg-[#6366f1] transition-colors cursor-row-resize" />
            <Panel defaultSize={35} minSize={15} maxSize={60}>
              <ConsolePanel />
            </Panel>
          </PanelGroup>
        ) : (
          <PreviewPanel />
        )}
      </div>
    </div>
  );
}

// ── Main Layout ───────────────────────────────────────────────────
export default function EditorLayout() {
  const layout = useEditorStore((s) => s.layout);

  if (layout === 'editor-only') {
    return (
      <div className="flex flex-col h-full min-h-0">
        <EditorPane />
      </div>
    );
  }

  if (layout === 'preview-only') {
    return (
      <div className="flex flex-col h-full min-h-0">
        <PreviewPane />
      </div>
    );
  }

  if (layout === 'top-bottom') {
    return (
      <PanelGroup direction="vertical" className="h-full">
        <Panel defaultSize={50} minSize={20}>
          <EditorPane />
        </Panel>
        <PanelResizeHandle className="h-[3px] bg-[#2a2d3a] hover:bg-[#6366f1] transition-colors cursor-row-resize" />
        <Panel defaultSize={50} minSize={20}>
          <PreviewPane />
        </Panel>
      </PanelGroup>
    );
  }

  // Default: side-by-side
  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={50} minSize={20}>
        <EditorPane />
      </Panel>
      <PanelResizeHandle className="w-[3px] bg-[#2a2d3a] hover:bg-[#6366f1] transition-colors cursor-col-resize" />
      <Panel defaultSize={50} minSize={20}>
        <PreviewPane />
      </Panel>
    </PanelGroup>
  );
}
