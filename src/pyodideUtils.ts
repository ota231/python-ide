import type { PyodideInterface } from 'pyodide';
import { loadPyodide } from 'pyodide';

let pyodide: PyodideInterface | null = null;

/**
 * Load the Pyodide runtime and packages (only once).
 */
export async function loadPyodideAndPackages(): Promise<PyodideInterface> {
  if (pyodide) return pyodide;

  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
  });

  console.log('[Pyodide] Runtime loaded. Installing micropip...');
  await pyodide.loadPackage('micropip');

  // Now that micropip is loaded, import it
  const micropip = pyodide.pyimport('micropip');

  console.log('[Pyodide] Installing packages...');
  await micropip.install(['numpy', 'pandas', 'matplotlib', 'biopython']);

  console.log('[Pyodide] All packages ready!');
  return pyodide;
}

export async function runPython(code: string): Promise<string> {
  const py = await loadPyodideAndPackages();
  try {
    const result = await py.runPythonAsync(code);
    return result?.toString() ?? '';
  } catch (e: unknown) {
    return `Error: ${(e as Error).message}`;
  }
}
