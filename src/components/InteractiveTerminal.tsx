import { useEffect } from 'react';

interface InteractiveTerminalProps {
  theme: 'light' | 'dark';
}

export function InteractiveTerminal({ theme }: InteractiveTerminalProps) {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.id = 'interactive_mode';
    script.type = 'mpy';
    script.setAttribute('terminal', '');
    script.innerHTML = `
      import code
      variables = locals()
      code.interact(local=variables)
    `;

    // Append to container
    const container = document.getElementById('interactive-mode');
    container?.appendChild(script);

    // Cleanup
    return () => {
      container?.removeChild(script);
    };
  }, []);

  return (
    <div className={`interactive-terminal h-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div id="interactive-mode" />
    </div>
  );
}