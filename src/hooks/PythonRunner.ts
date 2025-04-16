import { useEffect, useState } from 'react';

type PyodideStatus = 'loading' | 'ready' | 'error';
type RunResult = { output: string; error: string };

// Complete Pyodide type declaration
declare global {
  interface Window {
    loadPyodide: (options: {
      indexURL: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: <T = unknown>(code: string) => Promise<T>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  setStdout: (options: { batched?: (text: string) => void }) => void;
  setStderr: (options: { batched?: (text: string) => void }) => void;
}

export function PythonRunner() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [status, setStatus] = useState<PyodideStatus>('loading');
  const [result, setResult] = useState<RunResult>({ output: '', error: '' });

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"
        });
        await pyodideInstance.loadPackage(["numpy", "biopython", "matplotlib", "pandas"]);
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

    let stdoutBuffer = '';
    let stderrBuffer = '';

    // capture print output from user, especially new lines
    pyodide.setStdout({
      batched: (text: string) => {
        stdoutBuffer += text.endsWith('\n') ? text : text + '\n';
      }
    });
    pyodide.setStderr({
      batched: (text: string) => {
        stderrBuffer += text.endsWith('\n') ? `ERROR: ${text}` : `ERROR: ${text}\n`;
      }
    });

    setResult({ output: 'Running...', error: '' });

    try {

      await pyodide.runPythonAsync(code);

      const finalOutput = stdoutBuffer;
      console.log('Final Output:', finalOutput);

      // reset to default handlers
      pyodide.setStdout({ batched: (text) => console.log(text) });
      pyodide.setStderr({ batched: (text) => console.error(text) });

      setResult({ output: finalOutput, error: stderrBuffer.trim() });
    } catch (error) {
      setResult({
        output: '',
        error: error instanceof Error ? error.message : 'Python execution failed'
      });
    }
  };

  return { runPython, result, status };
}