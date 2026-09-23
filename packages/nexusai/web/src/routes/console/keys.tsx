import { createFileRoute } from '@tanstack/react-router'
import { ConsoleKeys } from '@/nexusai'

export const Route = createFileRoute('/console/keys')({
  component: ConsoleKeys,
})
