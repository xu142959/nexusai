import { createFileRoute } from '@tanstack/react-router'
import { NexusModelDetail, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/model/$provider/$model')({
  component: () => (
    <NexusLayout>
      <NexusModelDetail />
    </NexusLayout>
  ),
})