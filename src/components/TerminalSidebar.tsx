import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TerminalSidebarProps {
  theme: 'light' | 'dark';
  activeMode: 'output' | 'terminal';
  onToggleMode: () => void;
}

export function TerminalSidebar({ theme, activeMode, onToggleMode }: TerminalSidebarProps) {
  return (
    <div className={`d-flex flex-column p-2 border-end ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            {activeMode === 'output' ? 'Interactive Mode' : 'Switch to Output'}
          </Tooltip>
        }
      >
        <button 
          className={`btn ${
            theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'
          } ${activeMode === 'terminal' ? 'active' : ''}`}
          onClick={onToggleMode}
          style={{ width: '40px', height: '40px' }}
        >
          <i className={`bi ${
            activeMode === 'output' ? 'bi-terminal' : 'bi-code-square'
          }`}></i>
        </button>
      </OverlayTrigger>
    </div>
  );
}