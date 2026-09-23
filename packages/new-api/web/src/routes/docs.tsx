import { createFileRoute } from '@tanstack/react-router'
import { NexusDocs, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/docs')({
  component: () => (
    <NexusLayout>
      <NexusDocs />
    </NexusLayout>
  ),
})