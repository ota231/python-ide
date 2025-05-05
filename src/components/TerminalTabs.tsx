import { useState } from 'react';
import './terminal-tabs.css';

type TerminalTabsProps = {
  outputLines: string[];
  plotUrl?: string;
  theme: 'light' | 'dark';
};

export function TerminalTabs({ plotUrl, theme }: TerminalTabsProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'plot'>('code');

  return (
    <div className={`terminal-tabs ${theme}`}>
      <div className="tab-buttons">
        <button
          className={activeTab === 'code' ? 'active' : ''}
          onClick={() => setActiveTab('code')}
        >
          Code Output
        </button>
        <button
          className={activeTab === 'plot' ? 'active' : ''}
          onClick={() => setActiveTab('plot')}
          disabled={!plotUrl}
        >
          Image Output
        </button>
        
      </div>

    </div>
  );
}