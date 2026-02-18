/**
 * Prettier browser formatter utility.
 * Uses prettier/standalone + language-specific parsers.
 * All imports are dynamic so this never blocks the initial render.
 */

import type { PanelLanguage } from '@/core/types';

// ── Format a code string with Prettier ───────────────────────────
export async function formatWithPrettier(
  code: string,
  language: PanelLanguage
): Promise<string> {
  // Lazy-load standalone prettier and required parsers
  const [prettier, babelPlugin, estreePlugin, htmlPlugin, cssPlugin, tsPlugin] =
    await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/babel'),
      import('prettier/plugins/estree'),
      import('prettier/plugins/html'),
      import('prettier/plugins/postcss'),
      import('prettier/plugins/typescript'),
    ]);

  const parserMap: Record<PanelLanguage, string> = {
    html:       'html',
    css:        'css',
    javascript: 'babel',
    typescript: 'typescript',
  };

  const pluginMap: Record<PanelLanguage, unknown[]> = {
    html:       [htmlPlugin.default ?? htmlPlugin],
    css:        [cssPlugin.default ?? cssPlugin],
    javascript: [babelPlugin.default ?? babelPlugin, estreePlugin.default ?? estreePlugin],
    typescript: [tsPlugin.default ?? tsPlugin, estreePlugin.default ?? estreePlugin],
  };

  const parser = parserMap[language];
  const plugins = pluginMap[language];

  const format = prettier.default?.format ?? (prettier as unknown as { format: typeof prettier.format }).format;

  const result = await format(code, {
    parser,
    plugins: plugins as Parameters<typeof format>[1]['plugins'],
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    htmlWhitespaceSensitivity: 'css',
    embeddedLanguageFormatting: 'auto',
  });

  return result;
}
