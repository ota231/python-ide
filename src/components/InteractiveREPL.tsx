import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import * as pyodide from 'pyodide'; 

// type for python execution results
type PyodideRunResult = string | number | boolean | null | undefined | object;

interface PyodideInterface {
  runPython: (code: string) => PyodideRunResult;
  setStdout: (options: { write: (text: string) => void }) => void;
}

// main component
const InteractiveREPL: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null); // terminal container div
  const terminalInstance = useRef<Terminal | null>(null); // xterm terminal
  const fitAddon = useRef<FitAddon>(new FitAddon()); // keeps terminal auto-sized
  const pyodideRef = useRef<PyodideInterface | null>(null); // Pyodide instance

  const [isLoading, setIsLoading] = useState(true); // whether pyodide has loaded

  // Refs to track REPL command state
  const currentCommandRef = useRef<string>(''); 
  const commandHistoryRef = useRef<string[]>([]);
  const historyPositionRef = useRef<number>(-1); 

  // display prompt in terminal
  const prompt = () => terminalInstance.current?.write('\r\n>>> ');

  //load Pyodide asynchronously
  const loadPyodide = async (): Promise<void> => {
    try {
      const pyodideInstance = await pyodide.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"
      });
      pyodideRef.current = pyodideInstance as unknown as PyodideInterface;

      setIsLoading(false);

      terminalInstance.current?.writeln('Python environment loaded!\r\nPython 3.10.2 (Pyodide)\r\nType Python code below:');

      prompt();
    } catch (error) {
      terminalInstance.current?.writeln(`Error loading Python: ${error}`);
    }
  };

  // initialize xterm terminal
  useEffect(() => {
    // return if already initialized or no container
    if (!terminalRef.current || terminalInstance.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      theme: {
        foreground: '#1e1e1e',
        background: '#fefefe'
      }
    });

    terminal.loadAddon(fitAddon.current);
    terminal.open(terminalRef.current);
    fitAddon.current.fit(); 
    terminalInstance.current = terminal;


    loadPyodide();

    //handle user input
    terminal.onKey(({ key, domEvent }) => {
      const char = key;
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      switch (domEvent.key) {
        case 'Enter':
          executeCommand();
          break;
        case 'Backspace':
          if (currentCommandRef.current.length > 0) {
            currentCommandRef.current = currentCommandRef.current.slice(0, -1);
            terminal.write('\b \b'); // Erase character visually
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          navigateHistory(domEvent.key === 'ArrowUp' ? 'up' : 'down');
          break;
        default:
          if (printable) {
            currentCommandRef.current += char;
            terminal.write(char); // Echo to terminal
          }
          break;
      }
    });

    // Refits terminal on window resize
    const handleResize = () => {
      fitAddon.current.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate command history
  const navigateHistory = (direction: 'up' | 'down'): void => {
    const history = commandHistoryRef.current;
    const terminal = terminalInstance.current;
    if (!terminal || history.length === 0) return;

    // Update history position index
    if (direction === 'up') {
      if (historyPositionRef.current < history.length - 1) {
        historyPositionRef.current++;
      }
    } else {
      if (historyPositionRef.current > 0) {
        historyPositionRef.current--;
      } else {
        historyPositionRef.current = -1;
      }
    }

    // Clear current command line from terminal
    const current = currentCommandRef.current;
    for (let i = 0; i < current.length; i++) {
      terminal.write('\b \b');
    }

    // Show selected history entry or clear
    if (historyPositionRef.current >= 0) {
      const cmd = history[history.length - 1 - historyPositionRef.current];
      terminal.write(cmd);
      currentCommandRef.current = cmd;
    } else {
      currentCommandRef.current = '';
    }
  };

  // Execute Python code
  const executeCommand = async () => {
    const terminal = terminalInstance.current;
    const code = currentCommandRef.current.trim();

    if (!pyodideRef.current || code === '') {
      prompt();
      return;
    }

    terminal?.write('\r\n'); // Start new line

    // Save command in history
    commandHistoryRef.current.push(code);
    historyPositionRef.current = -1;

    try {
      // Redirect stdout to terminal
      pyodideRef.current.setStdout({
        write: (text: string) => terminal?.write(text)
      });

      // Run Python code
      const result = pyodideRef.current.runPython(code);

      // Show result if it's not empty or None
      if (result !== undefined && result !== null && result.toString() !== 'None') {
        terminal?.writeln(result.toString());
      }
    } catch (error) {
      terminal?.writeln(`Error: ${(error as Error).message}`);
    }

    currentCommandRef.current = ''; // Reset line
    prompt(); // Show new prompt
  };

  return (
    <div className="terminal-container w-full">
      {/* Show loading message while environment is being prepared */}
      {isLoading && <p className="text-yellow-400 text-center">Loading Python environment...</p>}

      <div 
        ref={terminalRef} 
        className="w-full h-96 border border-gray-700 bg-black text-white"
      />
    </div>
  );
};

export default InteractiveREPL;
