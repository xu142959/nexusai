import { createFileRoute } from '@tanstack/react-router'
import { NexusChat } from '@/nexusai'

export const Route = createFileRoute('/chat')({
  component: NexusChat,
})
