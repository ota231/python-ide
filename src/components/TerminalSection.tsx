import { CodeOutput } from './CodeOutput';
import { TerminalTabs } from './TerminalTabs';
import { InteractiveTerminal } from './InteractiveTerminal';
import {useState} from 'react';
import { PlotOutputViewer } from './PlotOutputViewer';

interface TerminalSectionProps {
  output: string;
  error: string;
  isRunning: boolean;
  theme: 'light' | 'dark';
  plotUrl?: string; // URL or base64 encoded image
}

export function TerminalSection({ output, error, isRunning, theme, plotUrl }: TerminalSectionProps) {
  const [activeTab, setActiveTab] = useState<'output' | 'plot' | 'terminal'>('output');

  return (
    <div className="terminal-section d-flex h-100">
      <div className="d-flex flex-column flex-grow-1 h-100">
        <TerminalTabs 
          theme={theme}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          plotUrl={plotUrl}
        />
        
        {activeTab === 'output' && (
          <CodeOutput 
            output={output} 
            error={error} 
            isLoading={isRunning}  
            theme={theme}
          />
        )}
        
        {activeTab === 'plot' && plotUrl && (
          <PlotOutputViewer plotUrl={plotUrl} theme={theme} />
        )}
        
        {activeTab === 'terminal' && (
          <InteractiveTerminal theme={theme} />
        )}
      </div>
    </div>
  );
}
