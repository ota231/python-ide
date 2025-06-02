import { useEffect, useState, useRef } from 'react';

type PyodideStatus = 'loading' | 'ready' | 'error';
type RunResult = { output: string; error: string };

export function PythonRunner() {
  const [status, setStatus] = useState<PyodideStatus>('loading');
  const [result, setResult] = useState<RunResult>({ output: '', error: '' });
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputResolver, setInputResolver] = useState<((val: string) => void) | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize worker
    console.log('Initializing Pyodide worker...'); // Debug lin
    workerRef.current = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), {
      type: 'module',
    });

    workerRef.current.onmessage = (e) => {
      switch (e.data.type) {
        case "INIT_SUCCESS":
          setStatus('ready');
          setResult({ output: 'Python runtime ready!', error: '' });
          break;
        case "INIT_ERROR":
          setStatus('error');
          setResult({ output: '', error: `Initialization failed: ${e.data.error}` });
          break;
        case "STDOUT":
          setResult(prev => ({ ...prev, output: prev.output + e.data.text }));
          break;
        case "STDERR":
          setResult(prev => ({ ...prev, error: prev.error + e.data.text }));
          break;
        case "RUN_COMPLETE":
          // Cleanup or notify completion
          break;
        case "RUN_ERROR":
          setResult(prev => ({ ...prev, error: prev.error + e.data.error }));
          break;
      }
    };

    // error handler
    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
      setStatus('error');
      setResult({ output: '', error: `Worker error: ${error.message}` });
    };

    return () => {
      console.log('Terminating Pyodide worker...'); // Debug line
      workerRef.current?.terminate(); // Cleanup on unmount
    };
  }, []);

  const runPython = (code: string) => {
    if (!workerRef.current || status !== 'ready') return;
    setStatus('loading');
    setResult({ output: 'Running...', error: '' });
    workerRef.current.postMessage({ type: "RUN", code });
  };

  const stopExecution = () => {
    if (workerRef.current) {
      workerRef.current.terminate(); // Kill the worker
      workerRef.current = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), {
        type: 'module',
      }); // Recreate
      setStatus('ready');
      workerRef.current.postMessage({ type: "INIT" }); // Reinitialize
      setResult(prev => ({ ...prev, error: prev.error + "\nExecution stopped by user." }));
    }
  };

  const submitInput = (value: string) => {
    if (inputResolver) {
      inputResolver(value);
      setInputPrompt(null);
      setInputResolver(null);
    }
  };

  return {
    runPython,
    stopExecution, // <-- Expose this to your UI
    result,
    status,
    inputPrompt,
    submitInput,
  };
}