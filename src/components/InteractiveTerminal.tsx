interface InteractiveTerminalProps {
  theme: 'light' | 'dark';
}

export function InteractiveTerminal({ theme }: InteractiveTerminalProps) {
  // You'll implement actual terminal functionality here
  return (
    <div className={`interactive-terminal h-100 ${
      theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'
    }`}>
      <div className="p-3">
        <div className="terminal-content">
        </div>
      </div>
    </div>
  );
}