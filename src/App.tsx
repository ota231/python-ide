import { useState } from 'react';
import { Toolbar } from "./components/Toolbar";
import { MonacoEditor } from "./components/Editor";
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
  const { runPython, result, status } = PythonRunner();

  const handleRun = () => runPython(code);
  const handleReset = () => setCode(DEFAULT_CODE);
  const handleClear = () => setCode('');

  return (
    <div className="app d-flex flex-column vh-100">
      <div className="bg-light border-bottom">
        <Toolbar 
          onRun={handleRun} 
          onReset={handleReset} 
          onClear={handleClear} 
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
            <MonacoEditor 
              code={code} 
              onChange={(newCode) => setCode(newCode || '')} 
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
          />
        </div>
      </div>
    </div>
  );
}