import { ReactNode } from 'react'
import { StoryNestNav } from './StoryNestNav'
import './storynest-global.css'
import './storynest-ui.css'
import { NexusFooter } from './NexusFooter'

export function NexusLayout({ children, showFooter = true }: { children: ReactNode; showFooter?: boolean }) {
  return (
    <div className="storynest-global min-h-screen bg-[#03080a] text-[#fcfcfe]" style={{ fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <StoryNestNav />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
      {showFooter && <NexusFooter />}
    </div>
  )
}
