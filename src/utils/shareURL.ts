// Share via URL — Base64 encode/decode project files
import type { EditorFiles } from '@/core/types';

interface SharePayload {
  v: number; // schema version
  h: string; // html
  c: string; // css
  j: string; // js
  t?: boolean; // useTailwind
}

/**
 * Encode editor files into a URL-safe string.
 */
export function encodeProjectToURL(files: EditorFiles, useTailwind: boolean): string {
  const payload: SharePayload = {
    v: 1,
    h: files.html,
    c: files.css,
    j: files.js,
    t: useTailwind || undefined,
  };

  const json = JSON.stringify(payload);
  const encoded = btoa(unescape(encodeURIComponent(json)));

  const url = new URL(window.location.href);
  url.hash = `share=${encoded}`;
  return url.toString();
}

/**
 * Decode a URL share hash back into EditorFiles.
 * Returns null if no valid share hash found.
 */
export function decodeURLToProject(
  hash: string
): { files: EditorFiles; useTailwind: boolean } | null {
  try {
    const match = hash.match(/share=([A-Za-z0-9+/=]+)/);
    if (!match) return null;

    const json = decodeURIComponent(escape(atob(match[1])));
    const payload: SharePayload = JSON.parse(json);

    if (!payload.v || !payload.h) return null;

    return {
      files: { html: payload.h, css: payload.c ?? '', js: payload.j ?? '' },
      useTailwind: payload.t ?? false,
    };
  } catch {
    return null;
  }
}
