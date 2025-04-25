import AceEditor from "react-ace";
import { useState } from 'react';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "bootstrap-icons/font/bootstrap-icons.css";
import './editor.css';

interface EditorProps {
  code: string;
  onChange?: (code: string) => void;
  theme: 'light' | 'dark';
}

export function AceCodeEditor({ code, onChange, theme }: EditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const changeFontSize = (delta: number) => setFontSize(prev => Math.max(10, Math.min(24, prev + delta)));

  return (
    <div className={`editor-wrapper ${isFullscreen ? 'fullscreen' : ''} ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <div className="font-control">
            <button 
              onClick={() => changeFontSize(-1)} 
              className="btn-icon"
              title="Decrease font size"
            >
              <i className="bi bi-dash-lg"></i>
              <span className="tooltip">Decrease font size</span>
            </button>
            <span className="font-size">{fontSize}px</span>
            <button 
              onClick={() => changeFontSize(1)} 
              className="btn-icon"
              title="Increase font size"
            >
              <i className="bi bi-plus-lg"></i>
              <span className="tooltip">Increase font size</span>
            </button>
          </div>
        </div>
        <button 
          onClick={toggleFullscreen} 
          className="btn-icon"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <i className="bi bi-arrows-angle-expand"></i>
          <span className="tooltip">
            {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          </span>
        </button>
      </div>
      <AceEditor
        mode="python"
        theme={theme === 'dark' ? 'monokai' : 'github'}
        value={code}
        onChange={onChange}
        fontSize={fontSize}
        height={isFullscreen ? 'calc(100vh - 40px)' : '100%'}
        width="100%"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}