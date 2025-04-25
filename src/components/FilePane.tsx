import { ChangeEvent } from 'react';
import { FileItem, FileLanguage } from '../types/file';

interface FilePaneProps {
  openFiles: FileItem[];
  setOpenFiles: (files: FileItem[]) => void;
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  theme: 'light' | 'dark';
}

export function FilePane({
  openFiles,
  setOpenFiles,
  activeFileId,
  setActiveFileId,
  theme
}: FilePaneProps) {
  const getFileLanguage = (filename: string): FileLanguage => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py': return 'python';
      case 'csv': return 'csv';
      default: return 'text';
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const processFile = (file: File): Promise<FileItem> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            name: file.name,
            type: 'file',
            language: getFileLanguage(file.name),
            content: event.target?.result as string
          });
        };
        reader.readAsText(file);
      });
    };

    const newFiles = await Promise.all(Array.from(files).map(processFile));
    setOpenFiles([...openFiles, ...newFiles]);
    if (newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
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

  const closeFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f.id !== fileId);
    if (newOpenFiles.length === 0) return;
    setOpenFiles(newOpenFiles);
    if (activeFileId === fileId) {
      setActiveFileId(newOpenFiles[0].id);
    }
  };

  const bgColor = theme === 'dark' ? 'bg-dark' : 'bg-light';
  const textColor = theme === 'dark' ? 'text-white' : 'text-dark';
  const borderColor = theme === 'dark' ? 'border-secondary' : 'border-light';
  const buttonVariant = theme === 'dark' ? 'outline-light' : 'outline-dark';

  return (
    <div className={`file-pane h-100 p-2 ${bgColor} ${textColor}`} style={{ width: '220px' }}>
      <div className={`d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom ${borderColor}`}>
        <h6 className="m-0">OPEN FILES</h6>
        <div>
          <label className={`btn btn-sm btn-${buttonVariant} me-1`} title="Import File">
            <i className="bi bi-file-earmark-arrow-down"></i>
            <input 
              type="file"
              onChange={handleImport}
              style={{ display: 'none' }}
              accept=".py,.txt,.csv"
              multiple
              /* @ts-expect-error - webkitdirectory is non-standard but supported */
              webkitdirectory=""
            />
          </label>
          <button 
            className={`btn btn-sm btn-${buttonVariant}`}
            title="New File"
            onClick={() => {
              const newFile: FileItem = {
                id: Date.now().toString(),
                name: `script_${openFiles.length + 1}.py`,
                type: 'file',
                language: 'python',
                content: ''
              };
              setOpenFiles([...openFiles, newFile]);
              setActiveFileId(newFile.id);
            }}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div className="file-list overflow-auto" style={{ height: 'calc(100% - 50px)' }}>
        {openFiles.map(file => (
          <div 
            key={file.id}
            className={`file-item d-flex align-items-center justify-content-between px-2 py-1 ${
              activeFileId === file.id ? (theme === 'dark' ? 'bg-primary' : 'bg-info') : ''
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
                className={`btn btn-sm btn-link p-0 ${textColor}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport(file);
                }}
                title="Export file"
              >
                <i className="bi bi-download"></i>
              </button>
              {openFiles.length > 1 && (
                <button 
                  className={`btn btn-sm btn-link p-0 ${textColor}`}
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
    </div>
  );
}