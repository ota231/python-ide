import Editor from "@monaco-editor/react";
import './editor.css';

interface EditorProps {
  code: string;
  onChange?: (code: string | undefined) => void;
}

export function MonacoEditor({ code, onChange}: EditorProps) {
  return (
    <div className="editor-container border">
      <Editor
        height="100%"  
        width="100%"
        language="python"
        value={code}
        onChange={onChange}
        options={{
          automaticLayout: true, // auto resizing
          minimap: { enabled: false }, 
          fontSize: 14
        }}
      />
    </div>
  );
}
