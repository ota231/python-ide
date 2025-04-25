import { useState } from 'react';
import { Toolbar } from "./components/Toolbar";
import { AceCodeEditor } from "./components/Editor";
import { TerminalSection } from "./components/TerminalSection";
import { FilePane } from "./components/FilePane";
import { PythonRunner } from './hooks/PythonRunner';
import { FileItem } from './types/file';
import './index.css';

const DEFAULT_CODE = `# sample code  

import numpy as np
from Bio.Seq import Seq

print("Hello, World!\\n")

print(np.random.rand(3,2), "\\n")

my_seq = Seq("AGTACACTGGT")
print(my_seq)`;

export default function App() {
  // File system state
  const [allFiles, setAllFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'main.py',
      type: 'file',
      language: 'python',
      content: DEFAULT_CODE
    },
    {
      id: '2',
      name: 'utils.py',
      type: 'file',
      language: 'python',
      content: '# Utility functions\n'
    },
    {
      id: '3',
      name: 'examples',
      type: 'folder',
      children: [
        {
          id: '4',
          name: 'hello.py',
          type: 'file',
          language: 'python',
          content: 'print("Hello World!")'
        }
      ]
    }
  ]);

  // Open files and active file state
  const [openFiles, setOpenFiles] = useState<FileItem[]>([
    allFiles.find(f => f.id === '1')!
  ]);
  const [activeFileId, setActiveFileId] = useState('1');

  // Other existing state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { runPython, result, status } = PythonRunner();
  const [activeMode, setActiveMode] = useState<'output' | 'terminal'>('output');

  // Get active file
  const activeFile = openFiles.find(f => f.id === activeFileId) || openFiles[0];

  // Update file content when editor changes
  const handleCodeChange = (newCode: string) => {
    setAllFiles(allFiles.map(f =>
      f.id === activeFileId ? { ...f, content: newCode } : f
    ));
    setOpenFiles(openFiles.map(f =>
      f.id === activeFileId ? { ...f, content: newCode } : f
    ));
  };

  // Existing handlers
  const toggleMode = () => {
    setActiveMode(prev => prev === 'output' ? 'terminal' : 'output');
  };

  const handleRun = () => {
    if (activeFile?.content) {
      runPython(activeFile.content);
    }
  };

  const handleReset = () => {
    const defaultFile = allFiles.find(f => f.id === '1');
    if (defaultFile) {
      handleCodeChange(DEFAULT_CODE);
    }
  };

  const handleClear = () => {
    handleCodeChange('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile?.content || '')
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
        {/* Tabs */}
        <div className={`d-flex border-bottom ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
          {openFiles.map(file => (
            <div
              key={file.id}
              className={`tab-item px-3 py-2 ${activeFileId === file.id
                  ? (theme === 'dark' ? 'bg-dark text-white border-top border-primary' : 'bg-white text-dark')
                  : (theme === 'dark' ? 'text-white-50' : 'text-muted')
                }`}
              onClick={() => setActiveFileId(file.id)}
              style={{
                cursor: 'pointer',
                borderRight: `1px solid ${theme === 'dark' ? '#495057' : '#dee2e6'}`
              }}
            >
              {file.name}
              {openFiles.length > 1 && (
                <button
                  className={`ms-2 btn-close ${theme === 'dark' ? 'btn-close-white' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newOpenFiles = openFiles.filter(f => f.id !== file.id);
                    setOpenFiles(newOpenFiles);
                    if (activeFileId === file.id) {
                      setActiveFileId(newOpenFiles[0].id);
                    }
                  }}
                  style={{ fontSize: '10px' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="d-flex flex-grow-1 overflow-hidden">
          <div
            className="h-100 overflow-auto border"
            style={{
              width: '250px',
              minWidth: '250px',
            }}
          >
            <FilePane
              openFiles={openFiles}
              setOpenFiles={setOpenFiles}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              theme={theme}  // Don't forget to pass the theme prop
            />
          </div>

          <div className="flex-grow-1 h-100 overflow-hidden">
            <AceCodeEditor
              code={activeFile?.content || ''}
              onChange={handleCodeChange}
              theme={theme}
              language={activeFile?.language}
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