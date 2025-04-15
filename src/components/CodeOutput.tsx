interface CodeOutputProps {
    output: string;
    error: string;
    isLoading: boolean;
}

export function CodeOutput({ output, error, isLoading }: CodeOutputProps) {
    const content = isLoading
        ? <pre className="text-muted">Loading Python runtime...</pre>
        : error
            ? <pre className="text-danger">{error}</pre>
            : <pre className="text-success">{output}</pre>;

    return (
        <div className="output-container p-3">
            {content}
        </div>
    );
}