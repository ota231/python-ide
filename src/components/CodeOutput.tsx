import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

interface CodeOutputProps {
    output: string;
    error: string;
    isLoading: boolean;
    theme: 'light' | 'dark';
}

export function CodeOutput({ output, error, isLoading, theme }: CodeOutputProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const didInitRef = useRef(false);

    //initialize terminal once
    useEffect(() => {
        if (!terminalRef.current) return;

        if (!xtermRef.current) {
            xtermRef.current = new Terminal({
                cursorBlink: true,
                convertEol: true,
                fontSize: 14,
                theme: theme === 'dark'
                    ? {
                        background: '#1e1e1e',
                        foreground: '#f5f5f5',
                    }
                    : {
                        background: '#ffffff',
                        foreground: '#1e1e1e',
                    },
            });
            xtermRef.current.open(terminalRef.current);
            didInitRef.current = true;
        }
    }, []);

    // update terminal on theme change
    useEffect(() => {
        if (!xtermRef.current) return;

        xtermRef.current.options.theme = {
            background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            foreground: theme === 'dark' ? '#f5f5f5' : '#1e1e1e',
          };
          xtermRef.current.refresh(0, xtermRef.current.rows - 1);
          
    }, [theme]);

    //handle updates to the outpur/error/loading
    useEffect(() => {
        if (!xtermRef.current) return;

        const term = xtermRef.current;
        term.clear();

        if (isLoading) {
            term.writeln('Loading Python runtime...');
        } else if (error) {
            term.writeln(`\x1b[31m❌ ${error}\x1b[0m`); // red text
        } else {
            output.split('\n').forEach(line => term.writeln(line));
        }
    }, [output, error, isLoading]);

    return (
        <div ref={terminalRef} />
    );
}