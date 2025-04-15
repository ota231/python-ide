import { useState } from 'react';

type TerminalTabsProps = {
  outputLines: string[];
  plotUrl?: string;
};

export function TerminalTabs({ plotUrl }: TerminalTabsProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'plot'>('code');

  return (
    <div className="terminal-tabs">
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