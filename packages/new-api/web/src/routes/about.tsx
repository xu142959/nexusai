import { createFileRoute } from '@tanstack/react-router'
import { NexusAbout, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/about')({
  component: () => (
    <NexusLayout>
      <NexusAbout />
    </NexusLayout>
  ),
})