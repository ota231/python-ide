import { CodeOutput } from './CodeOutput';
import { TerminalTabs } from './TerminalTabs';
import { InteractiveTerminal } from './InteractiveTerminal';
import {useState} from 'react';
import { FileOutputViewer } from './FileOutputViewer';

interface TerminalSectionProps {
  output: string;
  error: string;
  isRunning: boolean;
  theme: 'light' | 'dark';
  activeMode: 'output' | 'terminal';
  onToggleMode: () => void;
}

export function TerminalSection({ output, error, isRunning, theme }: TerminalSectionProps) {
  const [activeTab, setActiveTab] = useState<'output' | 'file-output' | 'terminal'>('output');
  const hasFileOutput = /* determine if file output exists */ false;
  return (
    <div className="terminal-section d-flex h-100">
      <div className="d-flex flex-column flex-grow-1 h-100">
        <TerminalTabs 
          theme={theme}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasFileOutput={hasFileOutput}
        />
        
        {activeTab === 'output' && (
          <CodeOutput 
            output={output} 
            error={error} 
            isLoading={isRunning}  
            theme={theme}
          />
        )}
        
        {activeTab === 'file-output' && (
          <FileOutputViewer 
            /* pass necessary file output props */
            theme={theme}
          />
        )}
        
        {activeTab === 'terminal' && (
          <InteractiveTerminal theme={theme} />
        )}
      </div>
    </div>
  );
}
