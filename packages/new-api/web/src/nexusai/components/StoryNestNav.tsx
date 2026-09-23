import { useState } from 'react'
import { Link, useRouter, useLocation } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Menu, X, Search } from 'lucide-react'
import { BRAND } from '../config/brand'
import { StoryNestUserMenu } from './StoryNestUserMenu'
import './storynest-nav.css'

const navItems = [
  { label: '首页', href: '/' },
  { label: '模型', href: '/models' },
  { label: '聊天', href: '/chat' },
  { label: '排行', href: '/rankings' },
  { label: '定价', href: '/plans' },
  { label: '文档', href: '/docs' },
  { label: '快速开始', href: '/quickstart' },
]


export function StoryNestNav() {
  const router = useRouter()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeNav = navItems.find(item => item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href))?.label || 'Home'


  return (
    <motion.header
      className="storynest-nav-header"
      initial={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="storynest-nav-container">
        {/* 品牌 */}
        <Link to="/" className="storynest-nav-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(200,255,0,0.15)" stroke="#c8ff00" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#c8ff00" />
            <circle cx="10" cy="10" r="2" fill="#c8ff00" />
            <circle cx="22" cy="10" r="2" fill="#c8ff00" />
            <circle cx="10" cy="22" r="2" fill="#c8ff00" />
            <circle cx="22" cy="22" r="2" fill="#c8ff00" />
          </svg>
          <span className="storynest-nav-brand-text">{BRAND.shortName}</span>
        </Link>

        {/* 中间药丸导航 */}
        <nav className="storynest-nav-pill">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={`storynest-nav-pill-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧 */}
        <div className="storynest-nav-right">
          <button
            className="storynest-nav-search"
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            title="搜索 (Cmd+K)"
          >
            <Search size={18} />
            <kbd className="storynest-nav-search-kbd">⌘K</kbd>
          </button>
          <StoryNestUserMenu />
          <button
            className="storynest-nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      {mobileOpen && (
        <div className="storynest-nav-mobile-drawer">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={`storynest-nav-mobile-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => { setActiveNav(item.label); setMobileOpen(false) }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </motion.header>
  )
}
