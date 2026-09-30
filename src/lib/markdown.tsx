import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: Record<string, React.ElementType> = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-3 mt-6 text-2xl font-bold text-slate-900 dark:text-slate-50" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-2 mt-5 text-xl font-semibold text-slate-900 dark:text-slate-50" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-2 mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-2 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-2 list-disc space-y-1 pl-5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-2 list-decimal space-y-1 pl-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className, children, ...rest } = props as React.HTMLAttributes<HTMLElement> & {
      children: React.ReactNode;
    };
    const isBlock = /language-/.test(className ?? '');
    if (isBlock) {
      return (
        <code
          className="block overflow-x-auto whitespace-pre rounded-lg bg-slate-900 p-3 font-mono text-[13px] leading-relaxed text-slate-100 dark:bg-slate-950"
          {...rest}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[13px] text-slate-800 dark:bg-slate-800 dark:text-slate-100"
        {...rest}
      >
        {children}
      </code>
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-3 overflow-x-auto" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-slate-300 bg-slate-100 px-2 py-1.5 font-semibold dark:border-slate-700 dark:bg-slate-800" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-slate-300 px-2 py-1.5 align-top dark:border-slate-700" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-2 border-l-4 border-navy-400 pl-3 italic text-slate-600 dark:text-slate-300" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-navy-700 underline decoration-navy-400 underline-offset-2 dark:text-navy-300" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{children}</ReactMarkdown>;
}
