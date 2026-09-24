import { createFileRoute } from '@tanstack/react-router'
import { ConsoleWallet } from '@/nexusai/pages/console/ConsoleWallet'

export const Route = createFileRoute('/console/wallet')({
  component: ConsoleWallet,
})
