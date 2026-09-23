import { createFileRoute } from '@tanstack/react-router'
import { NexusHelp, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/help')({
  component: () => (
    <NexusLayout>
      <NexusHelp />
    </NexusLayout>
  ),
})