import { createFileRoute } from '@tanstack/react-router'
import { NexusQuickstart } from '@/nexusai'

export const Route = createFileRoute('/quickstart')({
  component: () => (
    <NexusQuickstart />
  ),
})
