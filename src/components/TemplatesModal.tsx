'use client';

import { useState } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { TEMPLATES } from '@/templates/templates';
import { X, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

export default function TemplatesModal({ onClose }: { onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const store = useEditorStore();

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const apply = (templateId: string) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    store.updateFile('html', tpl.files.html);
    store.updateFile('css', tpl.files.css);
    store.updateFile('javascript', tpl.files.js);
    store.triggerRun();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-[#13151a] border border-[#2a2d3a] rounded-xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3a]">
          <h2 className="text-base font-semibold text-[#e2e4ed]">Templates</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#1a1d24] text-[#555874] hover:text-[#8b8fa8] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-1 px-5 pt-4 pb-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                activeCategory === cat
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-[#1a1d24] text-[#8b8fa8] hover:bg-[#252a36]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 pb-5 pt-2 max-h-[60vh] overflow-y-auto">
          {filtered.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => apply(tpl.id)}
              className="flex flex-col gap-2 p-4 bg-[#1a1d24] hover:bg-[#252a36] border border-[#2a2d3a] hover:border-[#6366f1] rounded-xl text-left transition-all group"
            >
              {/* Preview thumbnail (abstract) */}
              <div className="w-full h-20 rounded-lg bg-[#0d0e11] border border-[#2a2d3a] overflow-hidden flex items-center justify-center">
                <Layout className="w-8 h-8 text-[#2a2d3a] group-hover:text-[#6366f130] transition-colors" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#e2e4ed] group-hover:text-white transition-colors">
                  {tpl.name}
                </p>
                <p className="text-xs text-[#555874] mt-0.5">{tpl.description}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {tpl.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 bg-[#252a36] text-[#555874] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
