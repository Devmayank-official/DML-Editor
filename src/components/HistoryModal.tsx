'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { formatVersionLabel } from '@/history/versionManager';
import { X, RotateCcw, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryModal() {
  const isOpen = useEditorStore((s) => s.historyOpen);
  const setHistoryOpen = useEditorStore((s) => s.setHistoryOpen);
  const versions = useEditorStore((s) => s.versions);
  const versionsLoaded = useEditorStore((s) => s.versionsLoaded);
  const loadVersions = useEditorStore((s) => s.loadVersions);
  const restoreVersion = useEditorStore((s) => s.restoreVersion);
  const createSnapshot = useEditorStore((s) => s.createSnapshot);

  useEffect(() => {
    if (isOpen && !versionsLoaded) {
      loadVersions();
    }
  }, [isOpen, versionsLoaded, loadVersions]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setHistoryOpen(false); }}
    >
      <div className="w-full max-w-md bg-[#13151a] border border-[#2a2d3a] rounded-xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3a]">
          <h2 className="text-base font-semibold text-[#e2e4ed]">Version History</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await createSnapshot('Manual snapshot');
                toast.success('Snapshot created');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-[#818cf8] text-white text-xs rounded-lg transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              New Snapshot
            </button>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-[#1a1d24] text-[#555874] hover:text-[#8b8fa8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto">
          {!versionsLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin-slow" />
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Clock className="w-8 h-8 text-[#2a2d3a]" />
              <p className="text-sm text-[#555874]">No snapshots yet</p>
              <p className="text-xs text-[#3a3f52]">Create a snapshot to track your progress</p>
            </div>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center gap-3 px-5 py-3 border-b border-[#1a1d24] hover:bg-[#1a1d24] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#e2e4ed] font-medium truncate">
                    {version.label ?? 'Auto-saved'}
                  </p>
                  <p className="text-xs text-[#555874] font-mono">
                    {formatVersionLabel(version.timestamp)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Restore this version? Current changes will be overwritten.')) {
                      restoreVersion(version);
                      setHistoryOpen(false);
                      toast.success('Version restored');
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2 py-1 rounded text-xs text-[#6366f1] hover:bg-[#6366f115] transition-all"
                  title="Restore this version"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
