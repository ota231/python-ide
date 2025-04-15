import { useEffect, useState } from 'react';

type PyodideStatus = 'loading' | 'ready' | 'error';
type RunResult = { output: string; error: string };

// Minimal type declaration for Pyodide
declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<{
      runPythonAsync: (code: string) => Promise<unknown>;
      loadPackage: (packages: string | string[]) => Promise<void>;
    }>;
  }
}

export function PythonRunner() {
  const [pyodide, setPyodide] = useState<Awaited<ReturnType<typeof window.loadPyodide>> | null>(null);
  const [status, setStatus] = useState<PyodideStatus>('loading');
  const [result, setResult] = useState<RunResult>({ output: '', error: '' });

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"
        });
        await pyodideInstance.loadPackage(["numpy"]);
        setPyodide(pyodideInstance);
        setStatus('ready');
      } catch (error) {
        console.error('Pyodide load error:', error);
        setStatus('error');
        setResult({ 
          output: '', 
          error: error instanceof Error ? error.message : 'Failed to load Pyodide'
        });
      }
    };

    loadPyodide();
  }, []);

  const runPython = async (code: string) => {
    if (!pyodide || status !== 'ready') return;
    
    setResult({ output: 'Running...', error: '' });
    
    try {
      const output = await pyodide.runPythonAsync(code);
      setResult({ output: String(output), error: '' });
    } catch (error) {
      setResult({ 
        output: '', 
        error: error instanceof Error ? error.message : 'Python execution failed'
      });
    }
  };

  return { runPython, result, status };
}