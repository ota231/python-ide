import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TerminalSidebarProps {
  theme: 'light' | 'dark';
}

export function TerminalSidebar({ theme }: TerminalSidebarProps) {
  return (
    <div className={`d-flex flex-column p-2 border-end ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-start-terminal">Start Terminal</Tooltip>}
      >
        <button 
          className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-secondary'} rounded-circle`}
          style={{ width: '40px', height: '40px' }}
        >
          <i className="bi bi-terminal"></i>
        </button>
      </OverlayTrigger>
    </div>
  );
}