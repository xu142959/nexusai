import { createFileRoute } from '@tanstack/react-router'
import { ConsoleSettings } from '@/nexusai/pages/console/ConsoleSettings'

export const Route = createFileRoute('/console/settings')({
  component: ConsoleSettings,
})
