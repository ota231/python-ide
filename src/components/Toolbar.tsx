import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './toolbar.css';

interface ToolbarProps {
  onRun: () => void;
  onReset: () => void;
  onClear: () => void;
  onCopy: () => void;
  onToggleTheme: () => void;
  theme?: 'light' | 'dark';
}

export function Toolbar({ onRun, onReset, onClear, onCopy, onToggleTheme, theme = 'light' }: ToolbarProps) {
  const buttonClass = `btn btn-sm ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'} mx-1`;
  const buttonStyle = { width: '36px', height: '36px' };

  return (
    <div className={`toolbar d-flex flex-wrap align-items-center gap-2 p-2 toolbar-${theme}`}>
      {/* Execution Group */}
      <div className="execution btn-group btn-group-sm">
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Run</Tooltip>}>
          <button className={`${buttonClass} btn-outline-success`} onClick={onRun} style={buttonStyle}>
            <i className="bi bi-play-fill"></i>
          </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Stop</Tooltip>}>
          <button className={buttonClass} onClick={() => {}} style={buttonStyle}>
            <i className="bi bi-stop-fill"></i>
          </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Reset To Default Code</Tooltip>}>
          <button className={buttonClass} onClick={onReset} style={buttonStyle}>
            <i className="bi bi-arrow-repeat"></i>
          </button>
        </OverlayTrigger>
      </div>

      {/* Editor Group */}
      <div className="editor btn-group btn-group-sm">
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Copy Code</Tooltip>}>
          <button className={buttonClass} onClick={onCopy} style={buttonStyle}>
            <i className="bi bi-clipboard"></i>
          </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Clear Code</Tooltip>}>
          <button className={buttonClass} onClick={onClear} style={buttonStyle}>
            <i className="bi bi-eraser-fill"></i>
          </button>
        </OverlayTrigger>
      </div>
      
      {/* Visual Group */}
      <div className="save-share btn-group btn-group-sm">
      <OverlayTrigger placement="bottom" overlay={<Tooltip>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</Tooltip>}>
          <button className={buttonClass} onClick={onToggleTheme} style={buttonStyle}>
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
}