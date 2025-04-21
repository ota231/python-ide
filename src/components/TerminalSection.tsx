import { CodeOutput } from './CodeOutput';
import { TerminalTabs } from './TerminalTabs';
import { TerminalSidebar } from './TerminalSidebar';

interface TerminalSectionProps {
  output: string;
  error: string;
  isRunning: boolean;
  theme: 'light' | 'dark';
}

export function TerminalSection({ output, error, isRunning, theme }: TerminalSectionProps) {
  return (
    <div className="terminal-section d-flex h-100">
      <TerminalSidebar theme={theme} />
      <div className="d-flex flex-column flex-grow-1 h-100">
        <TerminalTabs outputLines={output.split('\n').filter(Boolean)} theme={theme} />
        <CodeOutput output={output} error={error} isLoading={isRunning} theme={theme}/>
      </div>
    </div>
  );
}