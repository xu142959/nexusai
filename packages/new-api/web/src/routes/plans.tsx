import { createFileRoute } from '@tanstack/react-router'
import { NexusPricing, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/plans')({
  component: () => (
    <NexusLayout>
      <NexusPricing />
    </NexusLayout>
  ),
})