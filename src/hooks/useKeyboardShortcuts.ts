'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/editor/editorStore';
import { toast } from 'sonner';

/**
 * Global keyboard shortcut handler.
 * Registered once at the app root level.
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // Ctrl+S — Save
      if (ctrl && !shift && e.key === 's') {
        e.preventDefault();
        const store = useEditorStore.getState();
        store.saveCurrentProject().then(() => {
          toast.success('Saved', { duration: 1500 });
        });
        return;
      }

      // Ctrl+Enter — Run
      if (ctrl && e.key === 'Enter') {
        e.preventDefault();
        useEditorStore.getState().triggerRun();
        return;
      }

      // Ctrl+P — Command palette
      if (ctrl && !shift && e.key === 'p') {
        e.preventDefault();
        const store = useEditorStore.getState();
        store.setCommandPaletteOpen(!store.commandPaletteOpen);
        return;
      }

      // Ctrl+Shift+P — Command palette (VSCode style)
      if (ctrl && shift && e.key === 'P') {
        e.preventDefault();
        const store = useEditorStore.getState();
        store.setCommandPaletteOpen(!store.commandPaletteOpen);
        return;
      }

      // Ctrl+` — Toggle console
      if (ctrl && e.key === '`') {
        e.preventDefault();
        const store = useEditorStore.getState();
        store.setConsoleOpen(!store.consoleOpen);
        return;
      }

      // Ctrl+Shift+Z — Toggle zen mode
      if (ctrl && shift && e.key === 'Z') {
        e.preventDefault();
        const store = useEditorStore.getState();
        store.setZenMode(!store.zenMode);
        return;
      }

      // Escape — close overlays
      if (e.key === 'Escape') {
        const store = useEditorStore.getState();
        if (store.commandPaletteOpen) { store.setCommandPaletteOpen(false); return; }
        if (store.zenMode) { store.setZenMode(false); return; }
        if (store.historyOpen) { store.setHistoryOpen(false); return; }
        if (store.settingsOpen) { store.setSettingsOpen(false); return; }
        if (store.projectsOpen) { store.setProjectsOpen(false); return; }
      }

      // Ctrl+1/2/3 — Switch editor panel
      if (ctrl && !shift) {
        if (e.key === '1') { e.preventDefault(); useEditorStore.getState().setActivePanel('html'); }
        if (e.key === '2') { e.preventDefault(); useEditorStore.getState().setActivePanel('css'); }
        if (e.key === '3') { e.preventDefault(); useEditorStore.getState().setActivePanel('javascript'); }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
