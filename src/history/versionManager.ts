// Version history manager — wraps storage calls with project context
import { nanoid } from 'nanoid';
import { saveVersion, getVersions, deleteVersion } from '@/storage/db';
import type { VersionEntry, EditorFiles } from '@/core/types';

export async function createVersion(
  projectId: string,
  files: EditorFiles,
  label?: string
): Promise<VersionEntry> {
  const entry: VersionEntry = {
    id: nanoid(),
    projectId,
    files: { ...files },
    timestamp: Date.now(),
    label,
  };
  await saveVersion(entry);
  return entry;
}

export async function getProjectVersions(projectId: string): Promise<VersionEntry[]> {
  return getVersions(projectId);
}

export async function removeVersion(versionId: string): Promise<void> {
  return deleteVersion(versionId);
}

export function formatVersionLabel(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
