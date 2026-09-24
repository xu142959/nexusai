import { Outlet, Link, useLocation } from '@tanstack/react-router'
import { BRAND } from '../config/brand'
import { StoryNestNav } from './StoryNestNav'
import './storynest-global.css'
import './storynest-ui.css'
import { KeyRound, BarChart3, User, Wallet, Settings, SlidersHorizontal, ChevronRight, LayoutDashboard, BookOpen, Receipt } from 'lucide-react'

const navItems = [
  { to: '/console', label: '概览', icon: LayoutDashboard },
  { to: '/console/keys', label: 'API 密钥', icon: KeyRound },
  { to: '/console/usage', label: '用量统计', icon: BarChart3 },
  { to: '/console/wallet', label: '钱包', icon: Wallet },
  { to: '/console/billing', label: '充值账单', icon: Receipt },
  { to: '/console/quickstart', label: '接入指南', icon: BookOpen },
  { to: '/console/profile', label: '个人资料', icon: User },
  { to: '/console/settings', label: '偏好设置', icon: SlidersHorizontal },
]

export function ConsoleLayout() {
  const location = useLocation()

  return (
    <div className="storynest-global min-h-screen bg-[#03080a]" style={{ fontFamily: `Inter Tight, -apple-system, sans-serif` }}>
      <StoryNestNav />
      <div className="max-w-[1880px] mx-auto px-6 py-8 pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边栏 */}
          <aside className="md:w-56 flex-shrink-0">
            {/* 品牌 Logo */}
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#c8ff00] flex items-center justify-center">
                <span className="text-black font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-white">{BRAND.name}</span>
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <Settings size={16} className="text-[#c8ff00]" />
              <h1 className="text-sm font-semibold text-gray-400">控制台</h1>
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname.startsWith(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#c8ff00]/10 text-[#c8ff00] font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                    <ChevronRight size={14} className="ml-auto opacity-50" />
                  </Link>
                )
              })}
            </nav>


          </aside>

          {/* 主内容 */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
