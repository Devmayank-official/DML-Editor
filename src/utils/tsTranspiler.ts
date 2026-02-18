/**
 * TypeScript → JavaScript transpiler using Monaco Editor's built-in TS worker.
 * This runs entirely in the browser — no server required.
 * Falls back to stripping type annotations with a regex if the worker is unavailable.
 */

/**
 * Transpile TypeScript source to JavaScript using Monaco's TypeScript worker.
 * Must be called from a client component that has Monaco already initialised.
 */
export async function transpileTypeScript(
  tsCode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monacoInstance: any
): Promise<string> {
  try {
    const ts = monacoInstance?.languages?.typescript;
    if (!ts) return tsCodeFallback(tsCode);

    // Use the Monaco TS worker to transpile
    const worker = await ts.getTypeScriptWorker();
    // Create a temporary model to get the transpiled output
    const uri = monacoInstance.Uri.parse('inmemory://ts-transpile.ts');

    // Check if model already exists
    let model = monacoInstance.editor.getModel(uri);
    if (!model) {
      model = monacoInstance.editor.createModel(tsCode, 'typescript', uri);
    } else {
      model.setValue(tsCode);
    }

    const client = await worker(uri);
    const output = await client.getEmitOutput(uri.toString());

    // Clean up the temp model
    model.dispose();

    const jsFile = output?.outputFiles?.find(
      (f: { name: string }) => f.name.endsWith('.js')
    );
    return jsFile?.text ?? tsCodeFallback(tsCode);
  } catch {
    return tsCodeFallback(tsCode);
  }
}

/**
 * Minimal fallback: strip common TypeScript-only syntax so the code can at
 * least run in a browser without throwing parse errors.
 * This handles the most common cases: type annotations, interfaces,
 * type aliases, generics, access modifiers, etc.
 */
function tsCodeFallback(tsCode: string): string {
  return tsCode
    // Remove interface declarations
    .replace(/\binterface\s+\w+[\s\S]*?\{[^}]*\}/g, '')
    // Remove type alias declarations
    .replace(/\btype\s+\w+\s*=\s*[\s\S]*?;/g, '')
    // Remove generic type parameters <T>, <T extends U>, etc.
    .replace(/<[A-Z][A-Za-z0-9_,\s\[\]|&?]*>/g, '')
    // Remove variable type annotations: : Type
    .replace(/:\s*(string|number|boolean|void|null|undefined|never|any|unknown|object|symbol)\b(\s*\[\])?/g, '')
    // Remove access modifiers
    .replace(/\b(public|private|protected|readonly)\s+/g, '')
    // Remove 'as Type' casts
    .replace(/\bas\s+\w+/g, '')
    // Remove '!' non-null assertions
    .replace(/!(?=[\.\[\(])/g, '');
}
