import './terminal-tabs.css';

type TerminalTabsProps = {
  theme: 'light' | 'dark';
  activeTab: 'output' | 'plot' | 'terminal';
  onTabChange: (tab: 'output' | 'plot' | 'terminal') => void;
  plotUrl?: string;  // URL or base64 encoded image
};

export function TerminalTabs({ 
  theme, 
  activeTab, 
  onTabChange,
  plotUrl 
}: TerminalTabsProps) {
  return (
    <div className={`terminal-tabs ${theme}`}>
      <div className="tab-buttons">
        <button
          className={activeTab === 'output' ? 'active' : ''}
          onClick={() => onTabChange('output')}
        >
          Output
        </button>
        
        <button
          className={activeTab === 'plot' ? 'active' : ''}
          onClick={() => onTabChange('plot')}
          disabled={!plotUrl}
        >
          Image Output
        </button>
        
        <button
          className={activeTab === 'terminal' ? 'active' : ''}
          onClick={() => onTabChange('terminal')}
        >
          Terminal
        </button>
      </div>
    </div>
  );
}