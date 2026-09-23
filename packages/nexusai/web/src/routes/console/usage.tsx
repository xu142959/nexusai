import { createFileRoute } from '@tanstack/react-router'
import { ConsoleUsage } from '@/nexusai'

export const Route = createFileRoute('/console/usage')({
  component: ConsoleUsage,
})
