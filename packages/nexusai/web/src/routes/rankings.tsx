import { createFileRoute } from '@tanstack/react-router'
import { NexusRankings, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/rankings')({
  component: () => (
    <NexusLayout>
      <NexusRankings />
    </NexusLayout>
  ),
})