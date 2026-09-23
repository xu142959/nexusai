import { createFileRoute } from '@tanstack/react-router'
import { ConsoleProfile } from '@/nexusai'

export const Route = createFileRoute('/console/profile')({
  component: ConsoleProfile,
})
