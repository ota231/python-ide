import { CodeOutput } from './CodeOutput';
import { TerminalTabs } from './TerminalTabs';

interface TerminalSectionProps {
  output: string;
  error: string;
  isRunning: boolean;
  theme: 'light' | 'dark';
}

export function TerminalSection({ output, error, isRunning, theme }: TerminalSectionProps) {
  return (
    <div className="terminal-section d-flex flex-column h-100">
      <TerminalTabs outputLines={output.split('\n').filter(Boolean)} theme={theme} />
      <CodeOutput output={output} error={error} isLoading={isRunning}  theme={theme}/>
    </div>
  );
}