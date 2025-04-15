type TerminalSidebarProps = {
  onReset: () => void;
  onClear: () => void;
  onToggleREPL: () => void;
  showREPL: boolean;
};

export function TerminalSidebar({
  onReset,
  onClear,
  onToggleREPL,
  showREPL
}: TerminalSidebarProps) {
  return (
    <div className="terminal-sidebar">
      <button onClick={onToggleREPL}>
        {showREPL ? 'Hide REPL' : 'Show REPL'}
      </button>
      <button onClick={onClear}>Clear Output</button>
      <button onClick={onReset}>Reset Session</button>
    </div>
  );
}