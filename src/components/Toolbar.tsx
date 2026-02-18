'use client';

import { useState, useRef } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { exportSingleHTML, exportZip, importHTMLFile, importZipFile } from '@/utils/importExport';
import { encodeProjectToURL } from '@/utils/shareURL';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Play, Save, Settings, History, FolderOpen, Share2,
  Download, Upload, Layout, Plus, ChevronDown, Zap,
  Code, Eye, Columns, Rows, Terminal, FileCode, LayoutTemplate
} from 'lucide-react';

// ── Layout picker dropdown ────────────────────────────────────────
function LayoutPicker() {
  const [open, setOpen] = useState(false);
  const layout = useEditorStore((s) => s.layout);
  const setLayout = useEditorStore((s) => s.setLayout);

  const options = [
    { id: 'side-by-side' as const, label: 'Side by Side', icon: <Columns className="w-3.5 h-3.5" /> },
    { id: 'top-bottom' as const,   label: 'Top / Bottom',  icon: <Rows className="w-3.5 h-3.5" /> },
    { id: 'editor-only' as const,  label: 'Editor Only',   icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'preview-only' as const, label: 'Preview Only',  icon: <Eye className="w-3.5 h-3.5" /> },
  ];

  const current = options.find((o) => o.id === layout)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-[#8b8fa8] hover:bg-[#1a1d24] hover:text-[#e2e4ed] transition-colors"
      >
        <Layout className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-[#1a1d24] border border-[#2a2d3a] rounded-lg overflow-hidden shadow-xl min-w-36">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setLayout(opt.id); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors',
                  opt.id === layout
                    ? 'text-[#6366f1] bg-[#252a36]'
                    : 'text-[#8b8fa8] hover:bg-[#252a36] hover:text-[#e2e4ed]'
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Import trigger ────────────────────────────────────────────────
function ImportButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const store = useEditorStore();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.zip')) {
        const imported = await importZipFile(file);
        if (imported.html !== undefined || imported.css !== undefined || imported.js !== undefined) {
          if (imported.html) store.updateFile('html', imported.html);
          if (imported.css) store.updateFile('css', imported.css);
          if (imported.js) store.updateFile('javascript', imported.js);
          toast.success('ZIP imported successfully');
        }
      } else {
        const imported = await importHTMLFile(file);
        store.updateFile('html', imported.html);
        store.updateFile('css', imported.css);
        store.updateFile('javascript', imported.js);
        toast.success('HTML imported successfully');
      }
    } catch (err) {
      toast.error('Import failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }

    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.zip"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-[#8b8fa8] hover:bg-[#1a1d24] hover:text-[#e2e4ed] transition-colors"
        title="Import HTML or ZIP"
      >
        <Upload className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Import</span>
      </button>
    </>
  );
}

// ── Export dropdown ───────────────────────────────────────────────
function ExportButton() {
  const [open, setOpen] = useState(false);
  const currentProject = useEditorStore((s) => s.currentProject);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-[#8b8fa8] hover:bg-[#1a1d24] hover:text-[#e2e4ed] transition-colors"
        title="Export project"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Export</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-50 bg-[#1a1d24] border border-[#2a2d3a] rounded-lg overflow-hidden shadow-xl min-w-40">
            <button
              onClick={async () => {
                if (currentProject) exportSingleHTML(currentProject);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8b8fa8] hover:bg-[#252a36] hover:text-[#e2e4ed] transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              Export as HTML
            </button>
            <button
              onClick={async () => {
                if (currentProject) await exportZip(currentProject);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8b8fa8] hover:bg-[#252a36] hover:text-[#e2e4ed] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export as ZIP
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Toolbar ──────────────────────────────────────────────────
export default function Toolbar() {
  const store = useEditorStore();
  const isDirty = useEditorStore((s) => s.isDirty);
  const currentProject = useEditorStore((s) => s.currentProject);
  const autoRunEnabled = useEditorStore((s) => s.autoRunEnabled);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');

  const handleNameClick = () => {
    setNameValue(currentProject?.name ?? '');
    setEditingName(true);
  };

  const handleNameBlur = () => {
    if (nameValue.trim()) store.renameProject(nameValue.trim());
    setEditingName(false);
  };

  const handleShare = () => {
    const { files, useTailwind } = useEditorStore.getState();
    const url = encodeProjectToURL(files, useTailwind);
    navigator.clipboard.writeText(url).then(() => toast.success('Share URL copied!'));
  };

  return (
    <header className="flex items-center gap-1 px-3 py-2 bg-[#13151a] border-b border-[#2a2d3a] shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
          D
        </div>
        <span className="text-sm font-bold text-[#e2e4ed] hidden sm:block">DML</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[#2a2d3a] mx-1" />

      {/* Project name */}
      {editingName ? (
        <input
          autoFocus
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNameBlur(); if (e.key === 'Escape') setEditingName(false); }}
          className="bg-[#1a1d24] border border-[#6366f1] rounded px-2 py-0.5 text-xs text-[#e2e4ed] outline-none w-40"
        />
      ) : (
        <button
          onClick={handleNameClick}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#1a1d24] transition-colors group"
          title="Rename project"
        >
          <span className="text-xs text-[#8b8fa8] group-hover:text-[#e2e4ed] transition-colors max-w-32 truncate">
            {currentProject?.name ?? 'Untitled'}
          </span>
          {isDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" title="Unsaved changes" />
          )}
        </button>
      )}

      {/* Left action group */}
      <div className="flex items-center gap-0.5 ml-1">
        <button
          onClick={() => store.setProjectsOpen(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-[#8b8fa8] hover:bg-[#1a1d24] hover:text-[#e2e4ed] transition-colors"
          title="Projects"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Projects</span>
        </button>

        <button
          onClick={() => store.createNewProject()}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-[#8b8fa8] hover:bg-[#1a1d24] hover:text-[#e2e4ed] transition-colors"
          title="New project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">New</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Center group: Layout + toggles */}
      <div className="flex items-center gap-0.5">
        {/* Auto-run toggle */}
        <button
          onClick={() => store.toggleAutoRun()}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors',
            autoRunEnabled
              ? 'text-[#10b981] bg-[#10b98115] hover:bg-[#10b98125]'
              : 'text-[#555874] hover:bg-[#1a1d24] hover:text-[#8b8fa8]'
          )}
          title={autoRunEnabled ? 'Auto-run: ON' : 'Auto-run: OFF'}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{autoRunEnabled ? 'Auto' : 'Manual'}</span>
        </button>

        <LayoutPicker />
      </div>

      {/* Right group: file actions */}
      <div className="flex items-center gap-0.5 ml-1">
        <ImportButton />
        <ExportButton />

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-[#8b8fa8] hover:bg-[#1a1d24] hover:text-[#e2e4ed] transition-colors"
          title="Share via URL"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Share</span>
        </button>

        <button
          onClick={async () => {
            await store.saveCurrentProject();
            toast.success('Saved', { duration: 1500 });
          }}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors',
            isDirty
              ? 'text-[#f59e0b] hover:bg-[#f59e0b15]'
              : 'text-[#555874] hover:bg-[#1a1d24] hover:text-[#8b8fa8]'
          )}
          title="Save (⌘S)"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Save</span>
        </button>

        {/* Run button */}
        <button
          onClick={() => store.triggerRun()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#6366f1] hover:bg-[#818cf8] text-white transition-colors ml-1"
          title="Run (⌘↵)"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span className="hidden sm:inline">Run</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[#2a2d3a] mx-1" />

      {/* Settings row */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => store.setHistoryOpen(true)}
          className="p-1.5 rounded text-[#555874] hover:bg-[#1a1d24] hover:text-[#8b8fa8] transition-colors"
          title="Version history"
        >
          <History className="w-4 h-4" />
        </button>
        <button
          onClick={() => store.setSettingsOpen(true)}
          className="p-1.5 rounded text-[#555874] hover:bg-[#1a1d24] hover:text-[#8b8fa8] transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
