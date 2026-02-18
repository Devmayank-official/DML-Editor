'use client';

import { useEffect, useRef, useCallback } from 'react';
import Editor, { useMonaco, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { PanelLanguage } from '@/core/types';
import { useEditorStore } from '@/editor/editorStore';
import { formatWithPrettier } from '@/utils/prettier';

// ─── Monaco language map ──────────────────────────────────────────
const LANG_MAP: Record<PanelLanguage, string> = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  typescript: 'typescript',
};

// ─── Props ────────────────────────────────────────────────────────
interface MonacoEditorProps {
  panelId: PanelLanguage;
  value: string;
  onChange: (value: string) => void;
}

export default function MonacoEditorPanel({ panelId, value, onChange }: MonacoEditorProps) {
  const monaco = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const settings = useEditorStore((s) => s.settings);
  const valueRef = useRef(value);
  const emmetDisposableRef = useRef<{ dispose: () => void } | null>(null);

  // Keep valueRef in sync to avoid stale closure in event handlers
  valueRef.current = value;

  // ── Configure Monaco theme and global options once monaco is ready ──
  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme('dml-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '555874', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c792ea' },
        { token: 'string', foreground: 'c3e88d' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'type', foreground: 'ffcb6b' },
        { token: 'function', foreground: '82aaff' },
        { token: 'variable', foreground: 'eeffff' },
        { token: 'operator', foreground: '89ddff' },
        { token: 'delimiter', foreground: '89ddff' },
        { token: 'tag', foreground: 'f07178' },
        { token: 'attribute.name', foreground: 'ffcb6b' },
        { token: 'attribute.value', foreground: 'c3e88d' },
        { token: 'metatag', foreground: 'c792ea' },
        { token: 'property', foreground: '80cbc4' },
      ],
      colors: {
        'editor.background': '#13151a',
        'editor.foreground': '#e2e4ed',
        'editorLineNumber.foreground': '#3a3f52',
        'editorLineNumber.activeForeground': '#6366f1',
        'editor.lineHighlightBackground': '#1a1d24',
        'editor.selectionBackground': '#6366f130',
        'editor.inactiveSelectionBackground': '#6366f118',
        'editorCursor.foreground': '#6366f1',
        'editorWhitespace.foreground': '#2a2d3a',
        'editorIndentGuide.background1': '#2a2d3a',
        'editorIndentGuide.activeBackground1': '#3a3f52',
        'editor.findMatchBackground': '#6366f140',
        'editor.findMatchHighlightBackground': '#6366f120',
        'editorWidget.background': '#1a1d24',
        'editorWidget.border': '#2a2d3a',
        'editorSuggestWidget.background': '#1a1d24',
        'editorSuggestWidget.border': '#2a2d3a',
        'editorSuggestWidget.selectedBackground': '#252a36',
        'editorSuggestWidget.highlightForeground': '#6366f1',
        'list.hoverBackground': '#252a36',
        'list.activeSelectionBackground': '#252a36',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#2a2d3a80',
        'scrollbarSlider.hoverBackground': '#3a3f5280',
        'scrollbarSlider.activeBackground': '#6366f180',
        'minimap.background': '#13151a',
        'breadcrumb.background': '#13151a',
        'breadcrumb.foreground': '#8b8fa8',
        'tab.activeBackground': '#1a1d24',
        'tab.inactiveBackground': '#13151a',
        'tab.border': '#2a2d3a',
        'editorGroupHeader.tabsBackground': '#13151a',
      },
    });

    monaco.editor.setTheme('dml-dark');

    // Configure JS/TS compiler options via the monaco editor languages API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tsLang = (monaco.languages as any).typescript;
    if (tsLang) {
      tsLang.javascriptDefaults?.setCompilerOptions({
        target: tsLang.ScriptTarget?.ES2020,
        allowNonTsExtensions: true,
        noEmit: true,
      });
      tsLang.typescriptDefaults?.setCompilerOptions({
        target: tsLang.ScriptTarget?.ES2020,
        allowNonTsExtensions: true,
        noEmit: true,
        strict: true,
      });
    }

    // Enable Emmet-like HTML autocomplete hints
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const htmlLang = (monaco.languages as any).html;
    if (htmlLang?.htmlDefaults) {
      htmlLang.htmlDefaults.setOptions({
        format: { tabSize: 2, insertSpaces: true },
        suggest: { html5: true },
      });
    }
  }, [monaco]);

  // ── Handler: editor mounted ────────────────────────────────────
  const handleMount: OnMount = useCallback(
    (editorInstance, monacoInstance) => {
      editorRef.current = editorInstance;

      // Apply theme immediately
      monacoInstance.editor.setTheme('dml-dark');

      // ── Helper: format with Prettier then propagate to store ──────
      const runPrettierFormat = async () => {
        const model = editorInstance.getModel();
        if (!model) return;
        try {
          const current = model.getValue();
          const formatted = await formatWithPrettier(current, panelId);
          if (formatted !== current) {
            // Preserve cursor
            const position = editorInstance.getPosition();
            model.setValue(formatted);
            if (position) editorInstance.setPosition(position);
          }
        } catch {
          // Prettier parse error — silently ignore (leave code as-is)
        }
      };

      // Keyboard shortcut: Ctrl+S → Prettier format (if enabled) then save
      editorInstance.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
        async () => {
          const store = useEditorStore.getState();
          if (store.settings.formatOnSave) {
            await runPrettierFormat();
          }
          await store.saveCurrentProject();
          const { toast } = await import('sonner');
          toast.success('Saved', { duration: 1500 });
        }
      );

      // Keyboard shortcut: Ctrl+Shift+F → format with Prettier
      editorInstance.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyMod.Shift | monacoInstance.KeyCode.KeyF,
        async () => {
          await runPrettierFormat();
        }
      );

      // Keyboard shortcut: Ctrl+Enter → run
      editorInstance.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
        () => {
          useEditorStore.getState().triggerRun();
        }
      );

      // Keyboard shortcut: Ctrl+/ → toggle comment
      editorInstance.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Slash,
        () => {
          editorInstance.getAction('editor.action.commentLine')?.run();
        }
      );

      // Focus editor
      editorInstance.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panelId]
  );

  // ── Sync external value changes without losing cursor position ──
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    const currentValue = model.getValue();
    if (currentValue !== value) {
      const position = editor.getPosition();
      const selection = editor.getSelection();

      model.setValue(value);

      // Restore cursor position
      if (position) editor.setPosition(position);
      if (selection) editor.setSelection(selection);
    }
  }, [value]);

  // ── Update editor options when settings change ─────────────────
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.updateOptions({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily + ', Fira Code, JetBrains Mono, monospace',
      wordWrap: settings.wordWrap ? 'on' : 'off',
      minimap: { enabled: settings.minimap },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      tabSize: settings.tabSize,
      formatOnType: true,
      formatOnPaste: true,
    });
  }, [settings]);

  const language = LANG_MAP[panelId];

  return (
    <Editor
      language={language}
      value={value}
      theme="dml-dark"
      onChange={(val) => onChange(val ?? '')}
      onMount={handleMount}
      loading={
        <div className="flex items-center justify-center h-full w-full bg-[#13151a]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin-slow" />
            <span className="text-sm text-[#8b8fa8]">Loading editor…</span>
          </div>
        </div>
      }
      options={{
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily + ', Fira Code, JetBrains Mono, monospace',
        fontLigatures: true,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        minimap: { enabled: settings.minimap },
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        tabSize: settings.tabSize,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'line',
        padding: { top: 16, bottom: 16 },
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        suggest: {
          showKeywords: true,
          showSnippets: true,
          preview: true,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        parameterHints: { enabled: true },
        formatOnType: true,
        formatOnPaste: true,
        autoIndent: 'full',
        folding: true,
        renderWhitespace: 'selection',
        accessibilitySupport: 'auto',
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
          useShadows: false,
        },
      }}
    />
  );
}
