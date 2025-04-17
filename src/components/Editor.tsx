import Editor from "@monaco-editor/react";
import './editor.css';
import { useEffect } from 'react';

interface EditorProps {
  code: string;
  onChange?: (code: string | undefined) => void;
  theme: 'light' | 'dark';
}

export function MonacoEditor({ code, onChange, theme}: EditorProps) {

  useEffect(() => {
    import('monaco-editor').then(monaco => {
      monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    });
  }, [theme]);

  return (
    <div className="editor-container border">
      <Editor
        height="100%"  
        width="100%"
        language="python"
        value={code}
        onChange={onChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          automaticLayout: true, // auto resizing
          minimap: { enabled: false }, 
          fontSize: 14
        }}
      />
    </div>
  );
}
