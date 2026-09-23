import { createFileRoute } from '@tanstack/react-router'
import { ConsoleBilling } from '@/nexusai'

export const Route = createFileRoute('/console/billing')({
  component: ConsoleBilling,
})
