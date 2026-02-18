// Preview engine — builds the sandboxed document from editor files
import type { EditorFiles } from '@/core/types';

const TAILWIND_CDN = 'https://cdn.tailwindcss.com';

/**
 * Builds the full HTML document to be rendered in the sandboxed iframe.
 * Injects CSS, JS, Tailwind CDN (optional), and console interceptor.
 */
export function buildPreviewDocument(
  files: EditorFiles,
  useTailwind: boolean,
  consoleChannelId: string
): string {
  const tailwindScript = useTailwind
    ? `<script src="${TAILWIND_CDN}"></script>`
    : '';

  // Console interceptor — posts messages to parent window so the console panel can capture them
  const consoleInterceptor = `
<script>
(function() {
  var __channel = ${JSON.stringify(consoleChannelId)};
  var __origin = ${JSON.stringify(typeof window !== 'undefined' ? window.location.origin : '*')};

  function __send(level, args) {
    var serialized = Array.prototype.map.call(args, function(a) {
      try {
        if (a === null) return 'null';
        if (a === undefined) return 'undefined';
        if (typeof a === 'function') return a.toString();
        if (typeof a === 'object') return JSON.stringify(a, null, 2);
        return String(a);
      } catch(e) { return '[Unserializable]'; }
    });
    try {
      window.parent.postMessage({
        __dmlConsole: true,
        channel: __channel,
        level: level,
        args: serialized,
        timestamp: Date.now()
      }, '*');
    } catch(e) {}
  }

  var _log   = console.log.bind(console);
  var _warn  = console.warn.bind(console);
  var _error = console.error.bind(console);
  var _info  = console.info.bind(console);
  var _debug = console.debug.bind(console);

  console.log   = function() { __send('log',   arguments); _log.apply(console, arguments); };
  console.warn  = function() { __send('warn',  arguments); _warn.apply(console, arguments); };
  console.error = function() { __send('error', arguments); _error.apply(console, arguments); };
  console.info  = function() { __send('info',  arguments); _info.apply(console, arguments); };
  console.debug = function() { __send('debug', arguments); _debug.apply(console, arguments); };

  window.addEventListener('error', function(e) {
    __send('error', [
      (e.message || 'Unknown error') +
      (e.filename ? ' (' + e.filename + ':' + e.lineno + ':' + e.colno + ')' : '')
    ]);
  });

  window.addEventListener('unhandledrejection', function(e) {
    __send('error', ['Unhandled Promise rejection: ' + (e.reason ? String(e.reason) : 'Unknown')]);
  });
})();
</script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
    content="
      default-src 'none';
      script-src 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net;
      style-src 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com;
      font-src https://fonts.gstatic.com data:;
      img-src * data: blob:;
      media-src * data: blob:;
      connect-src *;
    " />
  ${tailwindScript}
  ${consoleInterceptor}
  <style>
${files.css}
  </style>
</head>
<body>
${files.html}
<script>
${files.js}
</script>
</body>
</html>`;
}
