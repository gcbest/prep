import { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  code: string;
  className?: string;
}

export function Mermaid({ code, className = '' }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    let mermaid: typeof import('mermaid').default | undefined;

    (async () => {
      try {
        const mod = await import('mermaid');
        mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'default',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to render diagram');
          if (containerRef.current) containerRef.current.innerHTML = '';
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className={`rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 ${className}`} role="alert">
        <p className="font-semibold">Diagram error</p>
        <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{error}</pre>
      </div>
    );
  }

  return <div ref={containerRef} className={`overflow-x-auto [&_svg]:max-w-full ${className}`} aria-label="Mermaid diagram" />;
}
