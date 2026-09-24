import { useState, useRef, useEffect } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Settings,
} from 'lucide-react'
import { clearAuthentication } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import './storynest-user-menu.css'

interface MenuItem {
  label: string
  href?: string
  icon: React.ReactNode
  danger?: boolean
  onClick?: () => void
}

export function StoryNestUserMenu() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  // Selector subscription. Without a selector, this subscribes to the entire
  // auth-store and re-renders on every setBundle / setUser / setBootstrapState
  // call anywhere in the app — which combined with the backdrop-filter blur
  // animation below was a major source of UI jank on the console.
  const user = useAuthStore((s) => s.auth.user)
  const isAuthed = !!user

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearAuthentication()
    setIsOpen(false)
    router.navigate({ to: '/sign-in' })
  }

  const menuItems: MenuItem[] = [
    { label: 'API 密钥', href: '/console/keys', icon: <LayoutDashboard size={18} /> },
    { label: '用量统计', href: '/console/usage', icon: <BarChart3 size={18} /> },
    { label: '通知中心', href: '/notifications', icon: <Bell size={18} /> },
    { label: '偏好设置', href: '/console/settings', icon: <Settings size={18} /> },
  ]

  if (!isAuthed) {
    return (
      <div className="storynest-user-menu-auth">
        <Link to="/sign-in" className="storynest-user-menu-signin">登录</Link>
        <Link to="/sign-up" className="storynest-user-menu-signup">注册</Link>
      </div>
    )
  }

  return (
    <div className="storynest-user-menu" ref={menuRef}>
      <button
        className="storynest-user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="storynest-user-menu-avatar">
          <User size={16} />
        </div>
        <span className="storynest-user-menu-name">{user?.display_name || user?.username || '我的'}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="storynest-user-menu-dropdown"
            initial={{ opacity: 0, y: -12, filter: 'blur(12px)', scale: 0.96 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, y: -8, filter: 'blur(8px)', scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 用户信息头部 */}
            <div className="storynest-user-menu-header">
              <div className="storynest-user-menu-avatar-lg">
                <User size={24} />
              </div>
              <div className="storynest-user-menu-info">
                <div className="storynest-user-menu-username">{user?.display_name || user?.username || '用户'}</div>
              <div className="storynest-user-menu-email">{user?.email || ''}</div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="storynest-user-menu-divider" />

            {/* 菜单项 */}
            <div className="storynest-user-menu-items">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="storynest-user-menu-item"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="storynest-user-menu-item-icon">{item.icon}</span>
                      <span className="storynest-user-menu-item-label">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className="storynest-user-menu-item"
                      onClick={item.onClick}
                    >
                      <span className="storynest-user-menu-item-icon">{item.icon}</span>
                      <span className="storynest-user-menu-item-label">{item.label}</span>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* 分隔线 */}
            <div className="storynest-user-menu-divider" />

            {/* 退出按钮 */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="storynest-user-menu-item storynest-user-menu-item-danger"
                onClick={handleLogout}
              >
                <span className="storynest-user-menu-item-icon"><LogOut size={18} /></span>
                <span className="storynest-user-menu-item-label">退出登录</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

