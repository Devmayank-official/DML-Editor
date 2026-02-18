// Import / Export utilities
import JSZip from 'jszip';
import type { EditorFiles, Project } from '@/core/types';

// ─── Export ──────────────────────────────────────────────────────

/**
 * Download a single file to the user's device
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export the combined single-file HTML (all-in-one)
 */
export function exportSingleHTML(project: Project): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name}</title>
  ${project.useTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
  <style>
${project.files.css}
  </style>
</head>
<body>
${project.files.html}
<script>
${project.files.js}
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  downloadBlob(blob, `${sanitizeFilename(project.name)}.html`);
}

/**
 * Export as a .zip with separate files
 */
export async function exportZip(project: Project): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(sanitizeFilename(project.name))!;

  // index.html links to external css/js
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name}</title>
  ${project.useTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
  <link rel="stylesheet" href="style.css" />
</head>
<body>
${project.files.html}
<script src="script.js"></script>
</body>
</html>`;

  folder.file('index.html', indexHtml);
  folder.file('style.css', project.files.css);
  folder.file('script.js', project.files.js);
  folder.file(
    'README.md',
    `# ${project.name}\n\nCreated with DML Editor\n\nOpen \`index.html\` in a browser to preview.\n`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${sanitizeFilename(project.name)}.zip`);
}

// ─── Import ──────────────────────────────────────────────────────

/**
 * Import a single .html file and extract CSS and JS blocks from it.
 */
export async function importHTMLFile(file: File): Promise<EditorFiles> {
  const text = await file.text();
  return parseHTMLFile(text);
}

/**
 * Import a .zip file and look for index.html, style.css, script.js
 */
export async function importZipFile(file: File): Promise<Partial<EditorFiles>> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const files: Partial<EditorFiles> = {};

  // Search inside potential subfolder too
  for (const [path, entry] of Object.entries(zip.files)) {
    const name = path.split('/').pop()?.toLowerCase() ?? '';
    if (name === 'index.html' && !files.html) {
      const raw = await entry.async('string');
      files.html = extractBodyContent(raw);
    }
    if ((name === 'style.css' || name === 'styles.css') && !files.css) {
      files.css = await entry.async('string');
    }
    if ((name === 'script.js' || name === 'main.js' || name === 'app.js') && !files.js) {
      files.js = await entry.async('string');
    }
  }

  return files;
}

// ─── Helpers ─────────────────────────────────────────────────────

function parseHTMLFile(html: string): EditorFiles {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

  const css = styleMatch ? styleMatch[1].trim() : '';
  const js = scriptMatch ? scriptMatch[1].trim() : '';

  // Remove style and script blocks to get the clean body HTML
  const withoutStyle = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  const withoutScript = withoutStyle.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  const bodyMatch = withoutScript.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

  // If there's a full doctype, use the full file; otherwise just the body content
  const hasDoctype = /<!doctype/i.test(html);
  const htmlContent = hasDoctype ? html : bodyContent;

  return { html: htmlContent, css, js };
}

function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1].trim() : html;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase() || 'project';
}
