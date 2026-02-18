'use client';

import { useEditorStore } from '@/editor/editorStore';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
};

function Slider({ label, min, max, step, value, onChange }: SliderProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        <span className="text-xs text-[#8b8fa8]">{label}</span>
        <span className="text-xs text-[#e2e4ed] font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </label>
  );
}

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <div>
        <p className="text-sm text-[#e2e4ed]">{label}</p>
        {description && <p className="text-xs text-[#555874] mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors shrink-0',
          checked ? 'bg-indigo-500' : 'bg-[#2a2d3a]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    </label>
  );
}

export default function SettingsModal() {
  const isOpen = useEditorStore((s) => s.settingsOpen);
  const setSettingsOpen = useEditorStore((s) => s.setSettingsOpen);
  const settings = useEditorStore((s) => s.settings);
  const updateSettings = useEditorStore((s) => s.updateSettings);
  const useTailwind = useEditorStore((s) => s.useTailwind);
  const toggleTailwind = useEditorStore((s) => s.toggleTailwind);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setSettingsOpen(false); }}
    >
      <div className="w-full max-w-lg bg-[#13151a] border border-[#2a2d3a] rounded-xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3a]">
          <h2 className="text-base font-semibold text-[#e2e4ed]">Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded hover:bg-[#1a1d24] text-[#555874] hover:text-[#8b8fa8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Editor */}
          <section>
            <h3 className="text-xs font-semibold text-[#555874] uppercase tracking-wider mb-3">Editor</h3>
            <div className="space-y-4">
              <Slider
                label="Font Size"
                min={10}
                max={24}
                step={1}
                value={settings.fontSize}
                onChange={(v) => updateSettings({ fontSize: v })}
              />
              <Slider
                label="Tab Size"
                min={2}
                max={8}
                step={2}
                value={settings.tabSize}
                onChange={(v) => updateSettings({ tabSize: v })}
              />

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#8b8fa8]">Font Family</span>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                  className="bg-[#0d0e11] border border-[#2a2d3a] rounded px-3 py-2 text-sm text-[#e2e4ed] outline-none focus:border-indigo-500"
                >
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Cascadia Code">Cascadia Code</option>
                  <option value="Consolas">Consolas</option>
                  <option value="monospace">System Mono</option>
                </select>
              </label>
            </div>
          </section>

          {/* Toggles */}
          <section>
            <h3 className="text-xs font-semibold text-[#555874] uppercase tracking-wider mb-3">Editor Options</h3>
            <div className="space-y-3">
              <Toggle
                label="Word Wrap"
                checked={settings.wordWrap}
                onChange={(v) => updateSettings({ wordWrap: v })}
              />
              <Toggle
                label="Minimap"
                description="Show code overview in top-right"
                checked={settings.minimap}
                onChange={(v) => updateSettings({ minimap: v })}
              />
              <Toggle
                label="Line Numbers"
                checked={settings.lineNumbers}
                onChange={(v) => updateSettings({ lineNumbers: v })}
              />
              <Toggle
                label="Format on Save"
                description="Run Prettier before saving"
                checked={settings.formatOnSave}
                onChange={(v) => updateSettings({ formatOnSave: v })}
              />
              <Toggle
                label="Auto Save"
                description="Automatically save every 30 seconds"
                checked={settings.autoSave}
                onChange={(v) => updateSettings({ autoSave: v })}
              />
            </div>
          </section>

          {/* Preview */}
          <section>
            <h3 className="text-xs font-semibold text-[#555874] uppercase tracking-wider mb-3">Preview</h3>
            <div className="space-y-3">
              <Toggle
                label="Tailwind CSS"
                description="Inject Tailwind CDN into preview"
                checked={useTailwind}
                onChange={() => toggleTailwind()}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#2a2d3a] flex justify-end">
          <button
            onClick={() => setSettingsOpen(false)}
            className="px-4 py-2 bg-[#1a1d24] hover:bg-[#252a36] text-sm text-[#e2e4ed] rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
