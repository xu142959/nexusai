import { createFileRoute } from '@tanstack/react-router'
import { ConsoleDashboard } from '@/nexusai/pages/console/ConsoleDashboard'

export const Route = createFileRoute('/console/')({
  component: ConsoleDashboard,
})
