import { useState } from 'react';
import { Toolbar } from "./components/Toolbar";
import { AceCodeEditor } from "./components/Editor";
import { TerminalSection } from "./components/TerminalSection";
import { FilePane } from "./components/FilePane";
import { PythonRunner } from './hooks/PythonRunner';
import './index.css';

const DEFAULT_CODE = `# sample code  

import numpy as np
from Bio.Seq import Seq

print("Hello, World!\\n")

print(np.random.rand(3,2), "\\n")

my_seq = Seq("AGTACACTGGT")
print(my_seq)`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { runPython, result, status } = PythonRunner();
  const [activeMode, setActiveMode] = useState<'output' | 'terminal'>('output');

  const toggleMode = () => {
    setActiveMode(prev => prev === 'output' ? 'terminal' : 'output');
  };

  const handleRun = () => runPython(code);
  const handleReset = () => setCode(DEFAULT_CODE);
  const handleClear = () => setCode('');
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        console.log("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code:", err);
      });
  };
  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  return (
    <div className="app d-flex flex-column vh-100">
      <div className="bg-light border">
        <Toolbar 
          onRun={handleRun} 
          onReset={handleReset} 
          onClear={handleClear} 
          onCopy={handleCopy}
          onToggleTheme={handleThemeChange}
          theme={theme}
        />
      </div>

      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        <div className="d-flex flex-grow-1 overflow-hidden" style={{ marginTop: '10px' }}>
          <div 
            className="h-100 overflow-auto border"
            style={{ 
              width: '250px',
              minWidth: '250px',
            }}
          >
            <FilePane onFileSelect={() => {}} />
          </div>

          <div className="flex-grow-1 h-100 overflow-hidden">
            <AceCodeEditor 
              code={code} 
              onChange={(newCode) => setCode(newCode || '')} 
              theme={theme}
            />
          </div>
        </div>

        <div 
          className="border"
          style={{
            height: '50%',
            minHeight: '120px',
            marginTop: '5px',
            borderColor: '#444 !important'
          }}
        >
          <TerminalSection 
            output={result.output} 
            error={result.error} 
            isRunning={status === 'loading'} 
            theme={theme}
            activeMode={activeMode}
            onToggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
}