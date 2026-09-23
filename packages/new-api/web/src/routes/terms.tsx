import { createFileRoute } from '@tanstack/react-router'
import { NexusTerms, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/terms')({
  component: () => (
    <NexusLayout>
      <NexusTerms />
    </NexusLayout>
  ),
})