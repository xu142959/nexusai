import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminDashboard } from '@/nexusai'
import { resolveAuthentication } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    await resolveAuthentication()
    const { auth } = useAuthStore.getState()
    if (!auth.user) {
      throw redirect({ to: '/sign-in' })
    }
    // TODO: 检查是否是管理员
  },
  component: AdminDashboard,
})
