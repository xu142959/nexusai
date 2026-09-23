import { createFileRoute } from '@tanstack/react-router'
import { NexusModels, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/models')({
  component: () => (
    <NexusLayout>
      <NexusModels />
    </NexusLayout>
  ),
})
