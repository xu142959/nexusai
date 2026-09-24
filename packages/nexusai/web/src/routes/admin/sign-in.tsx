import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { AdminSignIn } from '@/nexusai'
import { resolveAuthentication } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/auth-store'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/admin/sign-in')({
  component: AdminSignIn,
  validateSearch: searchSchema,
  beforeLoad: async () => {
    await resolveAuthentication()
    const { auth } = useAuthStore.getState()
    if (auth.user) {
      if (auth.user.role >= 100) {
        throw redirect({ to: '/admin/dashboard', replace: true })
      }
      // 已登录但不是管理员，留在登录页显示错误
      return
    }
  },
})
