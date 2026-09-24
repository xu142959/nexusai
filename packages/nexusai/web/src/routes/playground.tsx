import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'
import { NexusLayout } from '@/nexusai'
import { Playground } from '@/features/playground'
import { resolveAuthentication } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/auth-store'

function PlaygroundPage() {
  const search = useSearch({ from: '/playground' })
  const initialModel = (search as any)?.model as string | undefined

  return (
    <NexusLayout showFooter={false}>
      <div style={{ height: 'calc(100vh - 72px)', minHeight: 600, overflow: 'hidden' }}>
        <Playground initialModel={initialModel} />
      </div>
    </NexusLayout>
  )
}

export const Route = createFileRoute('/playground')({
  beforeLoad: async () => {
    await resolveAuthentication()
    const { auth } = useAuthStore.getState()
    if (!auth.user) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: PlaygroundPage,
})
