import './toolbar.css';

interface ToolbarProps {
  onRun: () => void;
  onReset: () => void;
  onClear: () => void;
  onCopy: () => void;
  onToggleTheme: () => void;
  theme?: 'light' | 'dark';
}

export function Toolbar({ onRun, onReset, onClear, onCopy, onToggleTheme, theme }: ToolbarProps) {
  return (
    <div className={`toolbar d-flex flex-wrap align-items-center gap-2 p-2 toolbar-${theme}`}>

      {/* Execution Group */}
      <div className="execution btn-group btn-group-sm">
        <button className="btn btn-success" onClick={onRun}>
          <i className="bi bi-play-fill me-1"></i> Run
        </button>
        <button className="btn btn-outline-danger" onClick={() => { }}>
          <i className="bi bi-stop-fill me-1"></i> Stop
        </button>
        <button className="btn btn-outline-secondary" onClick={onReset}>
          <i className="bi bi-arrow-repeat me-1"></i> Reset to default
        </button>
      </div>

      {/* Editor Group */}
      <div className="editor btn-group btn-group-sm">
        <button className="btn btn-outline-primary" title="Copy" onClick={onCopy}>
          <i className="bi bi-clipboard"></i> Copy Code
        </button>
        <button className="btn btn-outline-danger" title="Clear" onClick={onClear}>
          <i className="bi bi-eraser-fill"></i> Clear Code
        </button>
      </div>

      {/* View Group */}
      <div className="view btn-group btn-group-sm">
        <button
          className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'}`}
          title="Toggle Theme"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? (
            <>
              <i className="bi bi-sun-fill"></i> Light Mode
            </>
          ) : (
            <>
              <i className="bi bi-moon-stars-fill"></i> Dark Mode
            </>
          )}
        </button>

        <button className="btn btn-outline-primary" title="Change Layout">
          <i className="bi bi-arrows-angle-expand"></i> Fullscreen
        </button>
      </div>

      {/* Save/Share Group */}
      <div className="save-share btn-group btn-group-sm">
        <button className="btn btn-outline-success">
          <i className="bi bi-file-earmark-arrow-up me-1"></i> Export File
        </button>
        <button className="btn btn-outline-info">
          <i className="bi bi-file-earmark-arrow-down me-1"></i> Import File
        </button>
      </div>

    </div>
  );
}

