import { createFileRoute } from '@tanstack/react-router'
import { StoryNestHero } from '@/nexusai/components/StoryNestHero'

export const Route = createFileRoute('/storynest')({
  component: StoryNestHero,
})
