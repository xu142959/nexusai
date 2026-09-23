import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminKeys } from '@/nexusai'
import { resolveAuthentication } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/admin/keys/')({
  beforeLoad: async () => {
    await resolveAuthentication()
    const { auth } = useAuthStore.getState()
    if (!auth.user) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AdminKeys,
})
