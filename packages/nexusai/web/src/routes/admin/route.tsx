import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout'
import { resolveAuthentication } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    await resolveAuthentication()
    const { auth } = useAuthStore.getState()
    // 登录页自身由子路由 beforeLoad 处理：未登录/非管理员时渲染登录表单，
    // 而不是重定向回自身造成无限循环（页面无响应/黑屏）。
    if (location.pathname === '/admin/sign-in') return
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
