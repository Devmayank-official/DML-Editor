// Core type definitions for DML Editor

export type PanelLanguage = 'html' | 'css' | 'javascript' | 'typescript';

export type LayoutPreset = 'side-by-side' | 'top-bottom' | 'editor-only' | 'preview-only';

export type ConsoleLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

export interface ConsoleEntry {
  id: string;
  level: ConsoleLevel;
  args: unknown[];
  timestamp: number;
  stack?: string;
}

export interface EditorFiles {
  html: string;
  css: string;
  js: string;
  ts: string;
}

export interface Project {
  id: string;
  name: string;
  files: EditorFiles;
  createdAt: number;
  updatedAt: number;
  useTailwind: boolean;
  useTypeScript: boolean;
}

export interface VersionEntry {
  id: string;
  projectId: string;
  files: EditorFiles;
  timestamp: number;
  label?: string;
}

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  tabSize: number;
  formatOnSave: boolean;
  autoSave: boolean;
}

export interface ActivePanel {
  id: PanelLanguage;
  label: string;
  icon: string;
}

export const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
  tabSize: 2,
  formatOnSave: true,
  autoSave: true,
};

export const PANELS: ActivePanel[] = [
  { id: 'html', label: 'HTML', icon: 'H' },
  { id: 'css', label: 'CSS', icon: 'C' },
  { id: 'javascript', label: 'JS', icon: 'J' },
];

export const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Project</title>
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>Start editing to see your changes live.</p>
    <button onclick="handleClick()">Click Me</button>
  </div>
</body>
</html>`;

export const DEFAULT_CSS = `/* Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

p {
  color: #94a3b8;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}`;

export const DEFAULT_JS = `// JavaScript
function handleClick() {
  const h1 = document.querySelector('h1');
  const colors = [
    'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #3b82f6, #6366f1)',
  ];
  const idx = Math.floor(Math.random() * colors.length);
  h1.style.backgroundImage = colors[idx];
  console.log('Color changed to:', colors[idx]);
}

console.log('DML Editor ready!');`;
