import { createFileRoute } from '@tanstack/react-router'
import { NexusHome, NexusLayout } from '@/nexusai'

export const Route = createFileRoute('/')({
  component: () => (
    <NexusLayout>
      <NexusHome />
    </NexusLayout>
  ),
})