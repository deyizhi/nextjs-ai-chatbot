import Link from 'next/link';
import React, { memo, useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { marked } from 'marked';

const components: Partial<Components> = {
    // @ts-expect-error
    code: CodeBlock,
    pre: ({ children }) => <>{children}</>,
    ol: ({ node, children, ...props }) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }) => {
      return (
        // @ts-expect-error
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    h1: ({ node, children, ...props }) => {
      return (
        <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      return (
        <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }) => {
      return (
        <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }) => {
      return (
        <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
          {children}
        </h6>
      );
    },
  };

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}

//////////////
const remarkPlugins = [remarkGfm];

const MemoizedMarkdownBlock = memo(
    ({ content }: { content: string }) => {
      return <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>{content}</ReactMarkdown>;
    },
    (prevProps, nextProps) => {
      if (prevProps.content !== nextProps.content) return false;
      return true;
    },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemMarkdown = memo(
  ({ children }: { children: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(children), [children]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`markdown-block_${index}`} />
    ));
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

MemMarkdown.displayName = 'Markdown';
