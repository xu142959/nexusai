import { createFileRoute } from '@tanstack/react-router'
import { ConsoleQuickstart } from '@/nexusai/pages/console/ConsoleQuickstart'

export const Route = createFileRoute('/console/quickstart')({
  component: ConsoleQuickstart,
})
