import { useEffect, useState } from 'react';

type PyodideStatus = 'loading' | 'ready' | 'error';
type RunResult = { output: string; error: string };

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
  globals: {
    set: (key: string, value: unknown) => void;
  };
}

export function PythonRunner() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [status, setStatus] = useState<PyodideStatus>('loading');
  const [result, setResult] = useState<RunResult>({ output: '', error: '' });
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputResolver, setInputResolver] = useState<((val: string) => void) | null>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/'
        });

        await pyodideInstance.loadPackage(['numpy', 'biopython', 'matplotlib', 'pandas']);

        // Define a JS function that Python's input() will call
        pyodideInstance.globals.set('js_input', async (prompt: string) => {
          return await new Promise<string>((resolve) => {
            setInputPrompt(prompt); // Trigger UI to ask for input
            setInputResolver(() => resolve); // Save resolver to call later
          });
        });

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

    // Replace `input()` in Python with `js_input()`
    const inputWrapper = `
import builtins
builtins.input = js_input
`;

    try {
      await pyodide.runPythonAsync(inputWrapper + '\n' + code);

      const finalOutput = stdoutBuffer;
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

  // This function should be called from your UI when the user submits input
  const submitInput = (value: string) => {
    if (inputResolver) {
      inputResolver(value);
      setInputPrompt(null); // Clear the prompt once submitted
      setInputResolver(null); // Reset resolver
    }
  };

  return {
    runPython,
    result,
    status,
    inputPrompt,     // string or null — used to show the prompt to the user
    submitInput      // function to be called when user enters input
  };
}
