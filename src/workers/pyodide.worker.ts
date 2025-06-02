
interface PyodideMessage {
  type: 'INIT' | 'RUN' | 'STDOUT' | 'STDERR' | 'RUN_COMPLETE' | 'ERROR';
  code?: string;
  error?: string;
  text?: string;
}

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<void>;
  loadPackage: (packages: string[]) => Promise<void>;
  setStdout: (options: { batched?: (text: string) => void }) => void;
  setStderr: (options: { batched?: (text: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide: (options: {
      indexURL: string;
    }) => Promise<PyodideInstance>;
  }
}

let pyodide: PyodideInstance;

async function loadPyodideAndPackages(): Promise<PyodideInstance> {
  console.log('Loading Pyodide...'); // Debug line

  pyodide = await self.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"
  });
  console.log('Loading packages...'); // Debug line

  await pyodide.loadPackage(["numpy", "biopython", "matplotlib", "pandas"]);
  console.log('Initialization complete'); // Debug line
  return pyodide;
}

console.log('Worker starting...'); 

self.onmessage = async (e: MessageEvent<PyodideMessage>) => {
  console.log('Worker received message:', e.data.type); // Debug line
  try {
    const { type, code } = e.data;

    if (type === "INIT") {
      await loadPyodideAndPackages();
      self.postMessage({ type: "INIT_SUCCESS" });
    }

    if (type === "RUN" && code) {
      pyodide.setStdout({
        batched: (text: string) => {
          self.postMessage({ type: "STDOUT", text });
        }
      });

      pyodide.setStderr({
        batched: (text: string) => {
          self.postMessage({ type: "STDERR", text });
        }
      });

      await pyodide.runPythonAsync(code);
      self.postMessage({ type: "RUN_COMPLETE" });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    self.postMessage({ 
      type: "ERROR",
      error: errorMessage 
    });
    console.error('Error in worker:', errorMessage); // Debug line
  }
};