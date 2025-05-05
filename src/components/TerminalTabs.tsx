import './terminal-tabs.css';

type TerminalTabsProps = {
  theme: 'light' | 'dark';
  activeTab: 'output' | 'file-output' | 'terminal';
  onTabChange: (tab: 'output' | 'file-output' | 'terminal') => void;
  hasFileOutput: boolean;
};

export function TerminalTabs({ 
  theme, 
  activeTab, 
  onTabChange,
  hasFileOutput 
}: TerminalTabsProps) {
  return (
    <div className={`terminal-tabs ${theme}`}>
      <div className="tab-buttons">
        <button
          className={activeTab === 'output' ? 'active' : ''}
          onClick={() => onTabChange('output')}
        >
          OUTPUT
        </button>
        
        <button
          className={activeTab === 'file-output' ? 'active' : ''}
          onClick={() => onTabChange('file-output')}
          disabled={!hasFileOutput}
        >
          FILE OUTPUT
        </button>
        
        <button
          className={activeTab === 'terminal' ? 'active' : ''}
          onClick={() => onTabChange('terminal')}
        >
          TERMINAL
        </button>
      </div>
    </div>
  );
}