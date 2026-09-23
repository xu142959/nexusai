import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Plug,
  Boxes,
  Users,
  KeyRound,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { clearAuthentication } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import './admin-layout.css'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

const navItems = [
  { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/channels', label: '渠道管理', icon: Plug },
  { path: '/admin/models', label: '模型管理', icon: Boxes },
  { path: '/admin/users', label: '用户管理', icon: Users },
  { path: '/admin/keys', label: 'API 密钥', icon: KeyRound },
  { path: '/admin/logs', label: '使用日志', icon: FileText },
  { path: '/admin/settings', label: '系统设置', icon: Settings },
]

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()
  const { auth } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    clearAuthentication()
    router.navigate({ to: '/sign-in' })
  }

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">NexusAI</div>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRight className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span className="admin-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <User size={16} />
            <span className="admin-user-name">{auth.user?.username || 'Admin'}</span>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>退出</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">{title}</h1>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

