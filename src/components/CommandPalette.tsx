'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { exportSingleHTML, exportZip } from '@/utils/importExport';
import { encodeProjectToURL } from '@/utils/shareURL';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Search, Code, Eye, Layout, Save, Zap, History, Share2, Download,
  FileCode, Moon, Settings, Trash, Plus, RotateCcw, LayoutTemplate
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  keywords?: string;
}

export default function CommandPalette() {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const store = useEditorStore();
  const isOpen = useEditorStore((s) => s.commandPaletteOpen);
  const setOpen = useEditorStore((s) => s.setCommandPaletteOpen);

  // ── Build command list ────────────────────────────────────────
  const commands: Command[] = [
      {
        id: 'templates',
        label: 'Open Templates',
        description: 'Browse starter templates',
        icon: <LayoutTemplate className="w-4 h-4" />,
        keywords: 'template starter landing portfolio dashboard',
        action: () => { store.setTemplatesOpen(true); setOpen(false); },
      },
      {
        id: 'new-project',
      label: 'New Project',
      description: 'Create a blank project',
      icon: <Plus className="w-4 h-4" />,
      shortcut: '',
      keywords: 'create blank',
      action: () => { store.createNewProject(); setOpen(false); },
    },
    {
      id: 'save',
      label: 'Save Project',
      description: 'Save current files to IndexedDB',
      icon: <Save className="w-4 h-4" />,
      shortcut: '⌘S',
      keywords: 'save store persist',
      action: () => {
        store.saveCurrentProject().then(() => toast.success('Saved'));
        setOpen(false);
      },
    },
    {
      id: 'run',
      label: 'Run Preview',
      description: 'Re-render the preview iframe',
      icon: <Zap className="w-4 h-4" />,
      shortcut: '⌘↵',
      keywords: 'run render refresh preview',
      action: () => { store.triggerRun(); setOpen(false); },
    },
    {
      id: 'layout-side-by-side',
      label: 'Layout: Side by Side',
      icon: <Layout className="w-4 h-4" />,
      keywords: 'layout split horizontal',
      action: () => { store.setLayout('side-by-side'); setOpen(false); },
    },
    {
      id: 'layout-top-bottom',
      label: 'Layout: Top / Bottom',
      icon: <Layout className="w-4 h-4" />,
      keywords: 'layout vertical stacked',
      action: () => { store.setLayout('top-bottom'); setOpen(false); },
    },
    {
      id: 'layout-editor-only',
      label: 'Layout: Editor Only',
      icon: <Code className="w-4 h-4" />,
      keywords: 'focus code editor only',
      action: () => { store.setLayout('editor-only'); setOpen(false); },
    },
    {
      id: 'layout-preview-only',
      label: 'Layout: Preview Only',
      icon: <Eye className="w-4 h-4" />,
      keywords: 'focus preview only',
      action: () => { store.setLayout('preview-only'); setOpen(false); },
    },
    {
      id: 'toggle-console',
      label: 'Toggle Console',
      icon: <FileCode className="w-4 h-4" />,
      shortcut: '⌘`',
      keywords: 'console log debug toggle',
      action: () => { store.setConsoleOpen(!store.consoleOpen); setOpen(false); },
    },
    {
      id: 'toggle-tailwind',
      label: store.useTailwind ? 'Disable Tailwind CSS' : 'Enable Tailwind CSS',
      icon: <Code className="w-4 h-4" />,
      keywords: 'tailwind css toggle utility',
      action: () => { store.toggleTailwind(); setOpen(false); },
    },
    {
      id: 'snapshot',
      label: 'Create Snapshot',
      description: 'Save a version snapshot',
      icon: <History className="w-4 h-4" />,
      keywords: 'version history snapshot save',
      action: () => {
        store.createSnapshot().then(() => toast.success('Snapshot created'));
        setOpen(false);
      },
    },
    {
      id: 'history',
      label: 'Version History',
      icon: <RotateCcw className="w-4 h-4" />,
      keywords: 'version history rollback restore',
      action: () => { store.setHistoryOpen(true); setOpen(false); },
    },
    {
      id: 'settings',
      label: 'Open Settings',
      icon: <Settings className="w-4 h-4" />,
      shortcut: '',
      keywords: 'settings preferences configuration',
      action: () => { store.setSettingsOpen(true); setOpen(false); },
    },
    {
      id: 'zen-mode',
      label: 'Toggle Zen Mode',
      icon: <Moon className="w-4 h-4" />,
      shortcut: '⌘⇧Z',
      keywords: 'zen focus distraction-free mode',
      action: () => { store.setZenMode(!store.zenMode); setOpen(false); },
    },
    {
      id: 'export-html',
      label: 'Export as HTML',
      description: 'Download combined single-file HTML',
      icon: <Download className="w-4 h-4" />,
      keywords: 'export download html file',
      action: () => {
        const { currentProject } = useEditorStore.getState();
        if (currentProject) exportSingleHTML(currentProject);
        setOpen(false);
      },
    },
    {
      id: 'export-zip',
      label: 'Export as ZIP',
      description: 'Download project as .zip archive',
      icon: <Download className="w-4 h-4" />,
      keywords: 'export download zip archive',
      action: async () => {
        const { currentProject } = useEditorStore.getState();
        if (currentProject) await exportZip(currentProject);
        setOpen(false);
      },
    },
    {
      id: 'share',
      label: 'Share via URL',
      description: 'Copy encoded URL to clipboard',
      icon: <Share2 className="w-4 h-4" />,
      keywords: 'share url link copy clipboard',
      action: () => {
        const { files, useTailwind } = useEditorStore.getState();
        const url = encodeProjectToURL(files, useTailwind);
        navigator.clipboard.writeText(url).then(() => toast.success('URL copied to clipboard!'));
        setOpen(false);
      },
    },
    {
      id: 'delete-project',
      label: 'Delete Current Project',
      description: 'Permanently removes this project',
      icon: <Trash className="w-4 h-4 text-red-400" />,
      keywords: 'delete remove project',
      action: () => {
        if (confirm('Delete this project? This cannot be undone.')) {
          store.deleteCurrentProject();
        }
        setOpen(false);
      },
    },
  ];

  // ── Filter commands ───────────────────────────────────────────
  const filtered = query
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        (cmd.description ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (cmd.keywords ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  // Reset selection when query changes
  useEffect(() => { setSelectedIdx(0); }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  // ── Keyboard navigation ───────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) filtered[selectedIdx].action();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  if (!isOpen) return null;

  return (
    <div
      className="cmd-overlay animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="w-full max-w-xl mx-4 animate-slide-down">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1d24] rounded-t-xl border border-[#2a2d3a]">
          <Search className="w-4 h-4 text-[#555874] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-[#e2e4ed] placeholder-[#555874] outline-none text-sm"
          />
          <kbd className="text-[10px] text-[#555874] bg-[#252a36] px-1.5 py-0.5 rounded border border-[#2a2d3a]">ESC</kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="bg-[#1a1d24] border border-t-0 border-[#2a2d3a] rounded-b-xl max-h-80 overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#555874]">
              No commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIdx(idx)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm',
                  idx === selectedIdx
                    ? 'bg-[#252a36] text-[#e2e4ed]'
                    : 'text-[#8b8fa8] hover:bg-[#20242e]'
                )}
              >
                <span className={cn('shrink-0', idx === selectedIdx ? 'text-[#6366f1]' : 'text-[#555874]')}>
                  {cmd.icon}
                </span>
                <span className="flex-1 font-medium">{cmd.label}</span>
                {cmd.description && (
                  <span className="text-[11px] text-[#555874] truncate max-w-36">{cmd.description}</span>
                )}
                {cmd.shortcut && (
                  <kbd className="text-[10px] text-[#555874] bg-[#252a36] px-1.5 py-0.5 rounded border border-[#2a2d3a] shrink-0">
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
