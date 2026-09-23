import { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const html = useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
    const raw = marked.parse(content) as string
    return DOMPurify.sanitize(raw, {
      ADD_ATTR: ['target', 'rel'],
    })
  }, [content])

  return (
    <div
      className={`nexusai-markdown text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
