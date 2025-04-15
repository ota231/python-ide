import { CodeOutput } from './CodeOutput';
import { TerminalTabs } from './TerminalTabs';

interface TerminalSectionProps {
  output: string;
  error: string;
  isRunning: boolean;
}

export function TerminalSection({ output, error, isRunning }: TerminalSectionProps) {
  return (
    <div className="terminal-section d-flex flex-column h-100">
      <TerminalTabs outputLines={output.split('\n').filter(Boolean)} />
      <CodeOutput output={output} error={error} isLoading={isRunning} />
    </div>
  );
}