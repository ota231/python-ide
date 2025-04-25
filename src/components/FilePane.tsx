import { useState } from 'react';
import { FileItem, FileLanguage } from '../types/file';

interface FilePaneProps {
  allFiles: FileItem[];
  openFiles: FileItem[];
  setOpenFiles: (files: FileItem[]) => void;
  setAllFiles: (files: FileItem[]) => void;
  activeFileId: string;
  setActiveFileId: (id: string) => void;
}

export function FilePane({
  allFiles,
  openFiles,
  setOpenFiles,
  setAllFiles,
  activeFileId,
  setActiveFileId
}: FilePaneProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    '3': true // default open folder
  });

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const getFileLanguage = (filename: string): FileLanguage => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'python';
      case 'csv':
        return 'csv';
      default:
        return 'text';
    }
  };
  

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newFile: FileItem = {
          id: Date.now().toString(),
          name: file.name,
          type: 'file',
          language: getFileLanguage(file.name),
          content
        };
        
        setAllFiles([...allFiles, newFile]);
        setOpenFiles([...openFiles, newFile]);
        setActiveFileId(newFile.id);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = (file: FileItem) => {
    if (file.type !== 'file') return;
    
    const blob = new Blob([file.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openFile = (file: FileItem) => {
    if (file.type === 'folder') {
      toggleFolder(file.id);
      return;
    }

    if (!openFiles.some(f => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(file.id);
  };

  const createNewFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `script_${allFiles.length + 1}.py`,
      type: 'file',
      language: 'python',
      content: ''
    };
    
    setAllFiles([...allFiles, newFile]);
    setOpenFiles([...openFiles, newFile]);
    setActiveFileId(newFile.id);
  };

  const closeFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newOpenFiles = openFiles.filter(f => f.id !== fileId);
    if (newOpenFiles.length === 0) return; // Must keep at least one file open
    
    setOpenFiles(newOpenFiles);
    
    if (activeFileId === fileId) {
      setActiveFileId(newOpenFiles[0].id);
    }
  };

  return (
    <div className="file-pane h-100 p-2" style={{ width: '220px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2">
        <h6 className="m-0">FILES</h6>
        <div>
          <label className="btn btn-sm btn-outline me-1" title="Import File">
            <i className="bi bi-file-earmark-arrow-down"></i>
            <input 
              type="file" 
              onChange={handleImport}
              style={{ display: 'none' }}
              accept=".py,.txt"
            />
          </label>
          <button 
            className="btn btn-sm btn-outline"
            title="New File"
            onClick={createNewFile}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      {/* Open Files Section */}
      <div className="mb-3">
        <small className="text-muted">OPEN FILES</small>
        {openFiles.map(file => (
          <div 
            key={file.id}
            className={`file-item d-flex align-items-center justify-content-between px-2 py-1 ${
              activeFileId === file.id ? 'bg-primary text-white' : ''
            }`}
            onClick={() => setActiveFileId(file.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-file-earmark-code me-2"></i>
              <span className="text-truncate">{file.name}</span>
            </div>
            <div>
              <button 
                className="btn btn-sm btn-link p-0 text-white"
                onClick={(e) => handleExport(file)}
                title="Export file"
              >
                <i className="bi bi-download"></i>
              </button>
              {openFiles.length > 1 && (
                <button 
                  className="btn btn-sm btn-link p-0 text-white"
                  onClick={(e) => closeFile(file.id, e)}
                  title="Close file"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All Files Section */}
      <div className="file-list overflow-auto" style={{ height: 'calc(50% - 50px)' }}>
        <small className="text-muted">PROJECT FILES</small>
        {allFiles.map(file => (
          <div key={file.id}>
            <div 
              className={`file-item d-flex align-items-center px-2 py-1 ${
                file.type === 'folder' ? 'folder' : ''
              }`}
              onClick={() => openFile(file)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${
                file.type === 'folder' 
                  ? (openFolders[file.id] ? 'bi-folder2-open' : 'bi-folder') 
                  : 'bi-file-earmark-code'
              } me-2`}></i>
              <span className="text-truncate">{file.name}</span>
            </div>

            {file.type === 'folder' && openFolders[file.id] && file.children && (
              <div className="ms-3">
                {file.children.map(child => (
                  <div 
                    key={child.id}
                    className="file-item d-flex align-items-center px-2 py-1 ms-2"
                    onClick={() => openFile(child)}
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