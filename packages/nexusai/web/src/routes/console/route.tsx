import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '@/nexusai'

export const Route = createFileRoute('/console')({
  component: ConsoleLayout,
})