import { createFileRoute } from '@tanstack/react-router'
import { NexusPrivacy, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/privacy')({
  component: () => (
    <NexusLayout>
      <NexusPrivacy />
    </NexusLayout>
  ),
})