import { CodeOutput } from './CodeOutput';
import { TerminalTabs } from './TerminalTabs';
import { TerminalSidebar } from './TerminalSidebar';
import { InteractiveTerminal } from './InteractiveTerminal';

interface TerminalSectionProps {
  output: string;
  error: string;
  isRunning: boolean;
  theme: 'light' | 'dark';
  activeMode: 'output' | 'terminal';
  onToggleMode: () => void;
}

export function TerminalSection({ output, error, isRunning, theme, activeMode, onToggleMode }: TerminalSectionProps) {
  return (
    <div className="terminal-section d-flex h-100">
      <TerminalSidebar 
        theme={theme} 
        activeMode={activeMode}
        onToggleMode={onToggleMode}
      />
      
      <div className="d-flex flex-column flex-grow-1 h-100">
        {activeMode === 'output' && (
          <TerminalTabs 
            outputLines={output.split('\n').filter(Boolean)} 
            theme={theme} 
          />
        )}
        
        {activeMode === 'output' ? (
          <CodeOutput 
            output={output} 
            error={error} 
            isLoading={isRunning}  
            theme={theme}
          />
        ) : (
          <InteractiveTerminal theme={theme} />
        )}
      </div>
    </div>
  );
}