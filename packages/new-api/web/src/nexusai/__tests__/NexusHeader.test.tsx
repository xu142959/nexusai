import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NexusHeader } from '../components/NexusHeader'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useRouter: () => ({ navigate: vi.fn() }),
}))

vi.mock('@/lib/api', () => ({
  getCommonHeaders: () => null,
  clearAuthentication: vi.fn(),
}))

describe('NexusHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders brand name', () => {
    render(<NexusHeader />)
    expect(screen.getByText('nexusai')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<NexusHeader />)
    expect(screen.getByText('Models')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Rankings')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })

  it('shows sign in and sign up buttons when not authenticated', () => {
    render(<NexusHeader />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('has correct brand color', () => {
    const { container } = render(<NexusHeader />)
    const logo = container.querySelector('.bg-\\[\\#c8ff00\\]')
    expect(logo).toBeInTheDocument()
  })
})
