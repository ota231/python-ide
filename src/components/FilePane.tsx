import { useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: 'python' | 'text';
  children?: FileItem[];    
}

export function FilePane({ onFileSelect }: { onFileSelect: (file: FileItem) => void }) {
  // sample files
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'main.py', type: 'file', language: 'python' },
    { id: '2', name: 'utils.py', type: 'file', language: 'python' },
    { 
      id: '3', 
      name: 'examples', 
      type: 'folder',
      children: [
        { id: '4', name: 'hello.py', type: 'file', language: 'python' }
      ]
    }
  ]);

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    '3': true // default open folder
  });

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return (
    <div className="file-pane h-100 p-2" style={{ width: '220px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2">
        <h6 className="m-0">FILES</h6>
        <button 
          className="btn btn-sm btn-outline"
          title="New File"
          onClick={() => {
            const newFile: FileItem = {
              id: Date.now().toString(),
              name: `script_${files.length + 1}.py`,
              type: 'file',
              language: 'python'
            };
            setFiles([...files, newFile]);
          }}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      <div className="file-list overflow-auto" style={{ height: 'calc(100% - 50px)' }}>
        {files.map(file => (
          <div key={file.id}>
            <div 
              className={`file-item d-flex align-items-center px-2 py-1 ${file.type === 'folder' ? 'folder' : ''}`}
              onClick={() => {
                if (file.type === 'folder') {
                  toggleFolder(file.id);
                } else {
                  onFileSelect(file);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${file.type === 'folder' ? 
                (openFolders[file.id] ? 'bi-folder2-open' : 'bi-folder') : 
                'bi-file-earmark-code'} me-2`}></i>
              <span className="text-truncate">{file.name}</span>
            </div>

            {file.type === 'folder' && openFolders[file.id] && file.children && (
              <div className="ms-3">
                {file.children.map(child => (
                  <div 
                    key={child.id}
                    className="file-item d-flex align-items-center px-2 py-1 ms-2"
                    onClick={() => onFileSelect(child)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-file-earmark-code me-2"></i>
                    <span>{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}