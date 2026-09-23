import { createFileRoute } from '@tanstack/react-router'
import { NexusNotifications, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/notifications')({
  component: () => (
    <NexusLayout>
      <NexusNotifications />
    </NexusLayout>
  ),
})