import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Markdown } from '../components/Markdown'

describe('Markdown', () => {
  it('renders plain text', () => {
    render(<Markdown content="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders bold text', () => {
    render(<Markdown content="**bold text**" />)
    expect(screen.getByText('bold text')).toBeInTheDocument()
  })

  it('renders inline code', () => {
    render(<Markdown content={'Use `const x = 1` here'} />)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders links', () => {
    render(<Markdown content="[link](https://example.com)" />)
    const link = screen.getByText('link')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('https://example.com')
  })

  it('renders lists', () => {
    render(<Markdown content={'- item 1\n- item 2'} />)
    expect(screen.getByText('item 1')).toBeInTheDocument()
    expect(screen.getByText('item 2')).toBeInTheDocument()
  })

  it('renders headings', () => {
    render(<Markdown content="# Heading 1" />)
    expect(screen.getByText('Heading 1')).toBeInTheDocument()
  })

  it('sanitizes HTML to prevent XSS', () => {
    const { container } = render(
      <Markdown content="<script>alert('xss')</script>" />
    )
    expect(container.querySelector('script')).toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<Markdown content="test" className="custom-class" />)
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
