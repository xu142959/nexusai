import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout'
import { resolveAuthentication } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    await resolveAuthentication()
    const { auth } = useAuthStore.getState()
    if (!auth.user) {
      throw redirect({ to: '/admin/sign-in' })
    }
    if (auth.user.role < 100) {
      // 普通用户不能进管理端
      throw redirect({ to: '/admin/sign-in' })
    }
  },
  component: AuthenticatedLayout,
})
