'use client';

import { useState } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { Play, Save, Settings, Plus, X, Layout, Code, Eye, Columns, Rows } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function MobileFAB() {
  const [open, setOpen] = useState(false);
  const store = useEditorStore();

  const actions = [
    {
      label: 'Run',
      icon: <Play className="w-4 h-4 fill-white" />,
      className: 'bg-[#6366f1]',
      action: () => { store.triggerRun(); setOpen(false); },
    },
    {
      label: 'Save',
      icon: <Save className="w-4 h-4" />,
      className: 'bg-[#1a1d24] text-[#e2e4ed]',
      action: async () => {
        await store.saveCurrentProject();
        toast.success('Saved');
        setOpen(false);
      },
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      className: 'bg-[#1a1d24] text-[#e2e4ed]',
      action: () => { store.setSettingsOpen(true); setOpen(false); },
    },
    {
      label: 'Side by Side',
      icon: <Columns className="w-4 h-4" />,
      className: 'bg-[#1a1d24] text-[#e2e4ed]',
      action: () => { store.setLayout('side-by-side'); setOpen(false); },
    },
    {
      label: 'Editor Only',
      icon: <Code className="w-4 h-4" />,
      className: 'bg-[#1a1d24] text-[#e2e4ed]',
      action: () => { store.setLayout('editor-only'); setOpen(false); },
    },
    {
      label: 'Preview Only',
      icon: <Eye className="w-4 h-4" />,
      className: 'bg-[#1a1d24] text-[#e2e4ed]',
      action: () => { store.setLayout('preview-only'); setOpen(false); },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 md:hidden">
      {/* Action items */}
      {open && (
        <div className="flex flex-col items-end gap-2 animate-slide-up">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-sm font-medium transition-all active:scale-95',
                action.className
              )}
            >
              <span className="text-white">{action.label}</span>
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95',
          open
            ? 'bg-[#1a1d24] border border-[#2a2d3a]'
            : 'bg-[#6366f1] hover:bg-[#818cf8]'
        )}
      >
        {open
          ? <X className="w-6 h-6 text-[#e2e4ed]" />
          : <Plus className="w-6 h-6 text-white" />
        }
      </button>
    </div>
  );
}
