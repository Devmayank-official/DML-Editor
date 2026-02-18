// IndexedDB storage engine using idb
import { openDB, type IDBPDatabase } from 'idb';
import type { Project, VersionEntry, EditorSettings } from '@/core/types';
import { DEFAULT_SETTINGS } from '@/core/types';

const DB_NAME = 'dml-editor';
const DB_VERSION = 1;

interface DMLEditorDB {
  projects: Project;
  versions: VersionEntry;
  settings: EditorSettings & { id: string };
}

let db: IDBPDatabase<DMLEditorDB> | null = null;

async function getDB(): Promise<IDBPDatabase<DMLEditorDB>> {
  if (db) return db;

  db = await openDB<DMLEditorDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('projects')) {
        const projectStore = database.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('updatedAt', 'updatedAt');
      }
      if (!database.objectStoreNames.contains('versions')) {
        const versionStore = database.createObjectStore('versions', { keyPath: 'id' });
        versionStore.createIndex('projectId', 'projectId');
        versionStore.createIndex('timestamp', 'timestamp');
      }
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });

  return db;
}

// ─── Projects ───────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
  const database = await getDB();
  const all = await database.getAll('projects');
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getProject(id: string): Promise<Project | undefined> {
  const database = await getDB();
  return database.get('projects', id);
}

export async function saveProject(project: Project): Promise<void> {
  const database = await getDB();
  await database.put('projects', project);
}

export async function deleteProject(id: string): Promise<void> {
  const database = await getDB();
  const tx = database.transaction(['projects', 'versions'], 'readwrite');
  await tx.objectStore('projects').delete(id);

  // Delete all versions for this project
  const versionStore = tx.objectStore('versions');
  const idx = versionStore.index('projectId');
  let cursor = await idx.openCursor(IDBKeyRange.only(id));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  await tx.done;
}

// ─── Versions ───────────────────────────────────────────────────────────────

export async function getVersions(projectId: string): Promise<VersionEntry[]> {
  const database = await getDB();
  const idx = database.transaction('versions').objectStore('versions').index('projectId');
  const all = await idx.getAll(IDBKeyRange.only(projectId));
  return all.sort((a, b) => b.timestamp - a.timestamp);
}

export async function saveVersion(version: VersionEntry): Promise<void> {
  const database = await getDB();
  await database.put('versions', version);

  // Keep only the last 50 versions per project
  const versions = await getVersions(version.projectId);
  if (versions.length > 50) {
    const toDelete = versions.slice(50);
    const tx = database.transaction('versions', 'readwrite');
    await Promise.all(toDelete.map((v) => tx.objectStore('versions').delete(v.id)));
    await tx.done;
  }
}

export async function deleteVersion(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('versions', id);
}

// ─── Settings ───────────────────────────────────────────────────────────────

export async function loadSettings(): Promise<EditorSettings> {
  const database = await getDB();
  const stored = await database.get('settings', 'global');
  if (!stored) return DEFAULT_SETTINGS;
  const { id: _id, ...settings } = stored;
  return settings as EditorSettings;
}

export async function saveSettings(settings: EditorSettings): Promise<void> {
  const database = await getDB();
  await database.put('settings', { ...settings, id: 'global' });
}
