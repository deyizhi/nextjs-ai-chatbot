import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { MemMarkdown } from './memoized-markdown'
 

export const Markdown = MemMarkdown;
