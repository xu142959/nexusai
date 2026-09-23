import { ReactNode } from 'react'
import { StoryNestNav } from './StoryNestNav'
import './storynest-global.css'
import './storynest-ui.css'
import { NexusFooter } from './NexusFooter'
import { CommandPalette } from './CommandPalette'
import './command-palette.css'

export function NexusLayout({ children }: { children: ReactNode }) {
  return (
    <div className="storynest-global min-h-screen bg-[#03080a] text-[#fcfcfe]" style={{ fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <StoryNestNav />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
      <NexusFooter />
      <CommandPalette />
    </div>
  )
}
