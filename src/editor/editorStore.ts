// Central editor store — single source of truth for the entire IDE
'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type {
  Project,
  EditorFiles,
  EditorSettings,
  ConsoleEntry,
  LayoutPreset,
  PanelLanguage,
  VersionEntry,
} from '@/core/types';
import { DEFAULT_SETTINGS, DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS } from '@/core/types';
import { saveProject, getAllProjects, loadSettings, saveSettings } from '@/storage/db';
import { createVersion, getProjectVersions } from '@/history/versionManager';

// ─── State shape ─────────────────────────────────────────────────
interface EditorState {
  // Project data
  currentProject: Project | null;
  projects: Project[];
  isDirty: boolean;

  // Editor content (the live working copy)
  files: EditorFiles;

  // UI state
  activePanel: PanelLanguage;
  layout: LayoutPreset;
  consoleOpen: boolean;
  consoleLocked: boolean;
  commandPaletteOpen: boolean;
  settingsOpen: boolean;
  historyOpen: boolean;
  projectsOpen: boolean;
  zenMode: boolean;

  // Feature toggles
  useTailwind: boolean;
  useTypeScript: boolean;
  autoRunEnabled: boolean;
  runTrigger: number; // increment to trigger manual run

  // Console
  consoleEntries: ConsoleEntry[];

  // Settings
  settings: EditorSettings;

  // History
  versions: VersionEntry[];
  versionsLoaded: boolean;

  // Auto-save timer ref
  autoSaveTimer: ReturnType<typeof setTimeout> | null;

  // Actions
  setActivePanel: (panel: PanelLanguage) => void;
  setLayout: (layout: LayoutPreset) => void;
  updateFile: (lang: PanelLanguage, content: string) => void;
  setConsoleOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setHistoryOpen: (open: boolean) => void;
  setProjectsOpen: (open: boolean) => void;
  setZenMode: (zen: boolean) => void;
  toggleTailwind: () => void;
  toggleTypeScript: () => void;
  toggleAutoRun: () => void;
  triggerRun: () => void;
  addConsoleEntry: (entry: ConsoleEntry) => void;
  clearConsole: () => void;
  updateSettings: (partial: Partial<EditorSettings>) => void;
  initStore: () => Promise<void>;
  createNewProject: (name?: string) => Promise<void>;
  loadProject: (project: Project) => Promise<void>;
  saveCurrentProject: () => Promise<void>;
  scheduleAutoSave: () => void;
  createSnapshot: (label?: string) => Promise<void>;
  loadVersions: () => Promise<void>;
  restoreVersion: (version: VersionEntry) => void;
  renameProject: (name: string) => void;
  deleteCurrentProject: () => Promise<void>;
  loadAllProjects: () => Promise<void>;
}

// ─── Helper: build a new blank project ───────────────────────────
function buildBlankProject(name = 'Untitled Project'): Project {
  return {
    id: nanoid(),
    name,
    files: { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    useTailwind: false,
    useTypeScript: false,
  };
}

// ─── Store ───────────────────────────────────────────────────────
export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    currentProject: null,
    projects: [],
    isDirty: false,
    files: { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS },
    activePanel: 'html',
    layout: 'side-by-side',
    consoleOpen: false,
    consoleLocked: false,
    commandPaletteOpen: false,
    settingsOpen: false,
    historyOpen: false,
    projectsOpen: false,
    zenMode: false,
    useTailwind: false,
    useTypeScript: false,
    autoRunEnabled: true,
    runTrigger: 0,
    consoleEntries: [],
    settings: DEFAULT_SETTINGS,
    versions: [],
    versionsLoaded: false,
    autoSaveTimer: null,

    setActivePanel: (panel) => set((s) => { s.activePanel = panel; }),
    setLayout: (layout) => set((s) => { s.layout = layout; }),

    updateFile: (lang, content) => {
      set((s) => {
        if (lang === 'html') s.files.html = content;
        else if (lang === 'css') s.files.css = content;
        else s.files.js = content;
        s.isDirty = true;
      });
      get().scheduleAutoSave();
    },

    setConsoleOpen: (open) => set((s) => { s.consoleOpen = open; }),
    setCommandPaletteOpen: (open) => set((s) => { s.commandPaletteOpen = open; }),
    setSettingsOpen: (open) => set((s) => { s.settingsOpen = open; }),
    setHistoryOpen: (open) => set((s) => { s.historyOpen = open; }),
    setProjectsOpen: (open) => set((s) => { s.projectsOpen = open; }),
    setZenMode: (zen) => set((s) => { s.zenMode = zen; }),

    toggleTailwind: () => {
      set((s) => { s.useTailwind = !s.useTailwind; });
      get().triggerRun();
    },

    toggleTypeScript: () => set((s) => { s.useTypeScript = !s.useTypeScript; }),

    toggleAutoRun: () => set((s) => { s.autoRunEnabled = !s.autoRunEnabled; }),

    triggerRun: () => set((s) => { s.runTrigger = s.runTrigger + 1; }),

    addConsoleEntry: (entry) =>
      set((s) => {
        // Cap at 500 entries to avoid memory leak
        if (s.consoleEntries.length >= 500) {
          s.consoleEntries.splice(0, 100);
        }
        s.consoleEntries.push(entry);
      }),

    clearConsole: () => set((s) => { s.consoleEntries = []; }),

    updateSettings: async (partial) => {
      set((s) => { Object.assign(s.settings, partial); });
      const settings = get().settings;
      await saveSettings(settings);
    },

    initStore: async () => {
      const [settings, projects] = await Promise.all([
        loadSettings(),
        getAllProjects(),
      ]);

      set((s) => {
        s.settings = settings;
        s.projects = projects;
      });

      if (projects.length > 0) {
        await get().loadProject(projects[0]);
      } else {
        await get().createNewProject();
      }
    },

    createNewProject: async (name) => {
      const project = buildBlankProject(name);
      await saveProject(project);
      set((s) => {
        s.projects.unshift(project);
        s.currentProject = project;
        s.files = { ...project.files };
        s.isDirty = false;
        s.useTailwind = project.useTailwind;
        s.useTypeScript = project.useTypeScript;
        s.versions = [];
        s.versionsLoaded = false;
      });
    },

    loadProject: async (project) => {
      set((s) => {
        s.currentProject = project;
        s.files = { ...project.files };
        s.isDirty = false;
        s.useTailwind = project.useTailwind;
        s.useTypeScript = project.useTypeScript;
        s.versions = [];
        s.versionsLoaded = false;
        s.consoleEntries = [];
      });
    },

    saveCurrentProject: async () => {
      const { currentProject, files, useTailwind, useTypeScript } = get();
      if (!currentProject) return;

      const updated: Project = {
        ...currentProject,
        files: { ...files },
        useTailwind,
        useTypeScript,
        updatedAt: Date.now(),
      };

      await saveProject(updated);

      set((s) => {
        s.currentProject = updated;
        s.isDirty = false;
        const idx = s.projects.findIndex((p) => p.id === updated.id);
        if (idx !== -1) s.projects[idx] = updated;
        else s.projects.unshift(updated);
      });
    },

    scheduleAutoSave: () => {
      const { settings, autoSaveTimer } = get();
      if (!settings.autoSave) return;

      if (autoSaveTimer) clearTimeout(autoSaveTimer);

      const timer = setTimeout(async () => {
        await get().saveCurrentProject();
        set((s) => { s.autoSaveTimer = null; });
      }, 30_000); // 30 second debounce

      set((s) => { s.autoSaveTimer = timer as unknown as ReturnType<typeof setTimeout>; });
    },

    createSnapshot: async (label) => {
      const { currentProject, files } = get();
      if (!currentProject) return;

      await get().saveCurrentProject();
      const version = await createVersion(currentProject.id, files, label);
      set((s) => { s.versions.unshift(version); });
    },

    loadVersions: async () => {
      const { currentProject } = get();
      if (!currentProject) return;

      const versions = await getProjectVersions(currentProject.id);
      set((s) => {
        s.versions = versions;
        s.versionsLoaded = true;
      });
    },

    restoreVersion: (version) => {
      set((s) => {
        s.files = { ...version.files };
        s.isDirty = true;
      });
      get().triggerRun();
    },

    renameProject: (name) => {
      set((s) => {
        if (s.currentProject) {
          s.currentProject.name = name;
          s.isDirty = true;
          const idx = s.projects.findIndex((p) => p.id === s.currentProject!.id);
          if (idx !== -1) s.projects[idx].name = name;
        }
      });
      get().saveCurrentProject();
    },

    deleteCurrentProject: async () => {
      const { currentProject, projects } = get();
      if (!currentProject) return;

      const { deleteProject } = await import('@/storage/db');
      await deleteProject(currentProject.id);

      const remaining = projects.filter((p) => p.id !== currentProject.id);
      set((s) => { s.projects = remaining; });

      if (remaining.length > 0) {
        await get().loadProject(remaining[0]);
      } else {
        await get().createNewProject();
      }
    },

    loadAllProjects: async () => {
      const projects = await getAllProjects();
      set((s) => { s.projects = projects; });
    },
  }))
);
