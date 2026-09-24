import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Menu, X, Search } from 'lucide-react'
import { StoryNestUserMenu } from './StoryNestUserMenu'
import './storynest.css'

// ============ 逐字母模糊揭示组件 ============
function BlurRevealText({ text, delay = 0, className = '', hoverKey = 0 }: {
  text: string
  delay?: number
  className?: string
  hoverKey?: number
}) {
  const letters = text.split('')
  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={`${i}-${hoverKey}`}
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(14px)', x: -14 }}
          animate={{
            opacity: [0, 0.65, 0.95, 1],
            filter: ['blur(14px)', 'blur(6px)', 'blur(1px)', 'blur(0px)'],
            x: [-14, -7.5, -2.5, 0],
          }}
          transition={{
            duration: 1.05,
            times: [0, 0.45, 0.8, 1],
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.04,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}

// ============ 主组件 ============
export function StoryNestHero() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')
  const [hoverCounter, setHoverCounter] = useState(0)
  const [isTracking, setIsTracking] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const defaultVideoRef = useRef<HTMLVideoElement>(null)
  const trackingVideoRef = useRef<HTMLVideoElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const lastMoveRef = useRef<number>(0)
  const cursorPos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  const navItems = [
  { label: 'Models', href: '/models' },
  { label: 'Chat', href: '/chat' },
  { label: 'Rankings', href: '/rankings' },
  { label: 'Pricing', href: '/plans' },
  { label: 'Docs', href: '/docs' },
]

  // ============ 视线追踪逻辑 ============
  const wrappedAngle = (a: number) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)

  const timeForAngle = useCallback((angle: number, dur = 6) => {
    const progress = wrappedAngle(angle) / (Math.PI * 2)
    return Math.max(0, Math.min(progress * dur, dur - 0.04))
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const root = rootRef.current
    const trackingVideo = trackingVideoRef.current
    if (!root || !trackingVideo) return

    const rect = root.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    cursorPos.current = { x: e.clientX, y: e.clientY }
    lastMoveRef.current = Date.now()

    // 视线追踪：眼睛中点 (626, 318)，两轴反转
    const eyeMidX = 626
    const eyeMidY = 318
    const scaleX = 1280 / rect.width
    const scaleY = 720 / rect.height
    const videoX = x * scaleX
    const videoY = y * scaleY
    const angle = Math.atan2(-(videoY - eyeMidY), -(videoX - eyeMidX))
    const timestamp = timeForAngle(angle)

    if (trackingVideo.readyState >= 2) {
      trackingVideo.currentTime = timestamp
    }

    if (!isTracking) {
      setIsTracking(true)
    }
  }, [isTracking, timeForAngle])

  // ============ 动画循环（光标跟随 + 闲置检测） ============
  useEffect(() => {
    const animate = () => {
      // 自定义光标环 lerp 跟随
      if (cursorRingRef.current && cursorDotRef.current) {
        ringPos.current.x += (cursorPos.current.x - ringPos.current.x) * 0.16
        ringPos.current.y += (cursorPos.current.y - ringPos.current.y) * 0.16
        cursorRingRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`
        cursorDotRef.current.style.transform = `translate(${cursorPos.current.x - 4}px, ${cursorPos.current.y - 4}px)`
      }

      // 1000ms 无操作后切回默认视频
      if (isTracking && Date.now() - lastMoveRef.current > 1000) {
        setIsTracking(false)
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isTracking])

  // ============ 事件监听 ============
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.addEventListener('mousemove', handleMouseMove)
    return () => root.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleTitleHover = () => setHoverCounter(c => c + 1)


  return (
    <>
      

      {/* ============ 根容器 ============ */}
      <div ref={rootRef} className="storynest-hero-root">
        {/* 背景视频层 */}
        <div className="footer-background">
          <video
            ref={defaultVideoRef}
            className="default-video"
            style={{ position: 'absolute', inset: 0, zIndex: 2 }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="https://cdn.jiro.build/Jahid/Test/robot/Default%20ship%20and%20nature.mp4" type="video/mp4" />
          </video>
          <video
            ref={trackingVideoRef}
            className={`tracking-video ${isTracking ? 'active' : ''}`}
            style={{ position: 'absolute', inset: 0, zIndex: 3 }}
            muted
            playsInline
            preload="auto"
          >
            <source src="https://cdn.jiro.build/Jahid/Test/robot/ship%20pupil%20move.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 渐晕叠加层 */}
        <div className="vignette-overlay" />

        {/* 内容容器 */}
        <div className="context-container">
          {/* 导航栏 */}
          <motion.nav
            className="header-nav"
            initial={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 左侧品牌 */}
            <div className="nav-brand">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(255,255,255,0.15)" stroke="#fefffe" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="3" fill="#fefffe" />
                <circle cx="10" cy="10" r="2" fill="#fefffe" />
                <circle cx="22" cy="10" r="2" fill="#fefffe" />
                <circle cx="10" cy="22" r="2" fill="#fefffe" />
                <circle cx="22" cy="22" r="2" fill="#fefffe" />
              </svg>
              <span className="nav-brand-text">nexusai</span>
            </div>

            {/* 中间药丸导航 */}
            <div className="nav-pill-menu">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`nav-pill-item group ${activeNav === item.label ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.label)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 右侧移动端菜单按钮 */}
            <div className="nav-right flex items-center gap-3">
              <button className="hidden md:flex p-1.5 text-white/70 hover:text-white">
                <Search size={18} />
              </button>
              <div className="hidden md:block">
                <StoryNestUserMenu />
              </div>
              <button
                className="mobile-menu-btn md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </motion.nav>

          {/* 移动端抽屉 */}
          {mobileOpen && (
            <div className="mobile-menu-drawer open">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={activeNav === item.label ? 'active' : ''}
                  onClick={() => { setActiveNav(item.label); setMobileOpen(false) }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Hero 内容 */}
          <div className="hero-content-layout" onMouseEnter={handleTitleHover}>
            {/* 左侧大标题 */}
            <div>
              <h1 className="hero-title">
                <div><BlurRevealText text="Little" delay={0.3} hoverKey={hoverCounter} /></div>
                <div><BlurRevealText text="Stories" delay={0.5} hoverKey={hoverCounter} /></div>
                <div><BlurRevealText text="Big Joy" delay={0.7} hoverKey={hoverCounter} /></div>
              </h1>
            </div>

            {/* 右侧区块 */}
            <div className="hero-right-block">
              {/* 顶部卡片 */}
              <motion.div
                className="magical-stories-card"
                initial={{ opacity: 0, x: 60, filter: 'blur(16px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
              >
                <h3 className="card-heading">
                  <BlurRevealText text="We bring magical stories to vibrant life" delay={1.8} hoverKey={hoverCounter} />
                </h3>
                <a href="#" className="card-explore-btn group">
                  <span className="relative inline-block overflow-hidden">
                    <span className="inline-block transition-transform duration-350 group-hover:translate-x-[180%] opacity-100 group-hover:opacity-0">
                      Explore Stories
                    </span>
                    <span className="absolute left-0 top-0 -translate-x-[180%] transition-transform duration-350 group-hover:translate-x-0">
                      Explore Stories
                    </span>
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>

              {/* 底部文字区块 */}
              <div className="imagination-text-block">
                <h2 className="imagination-heading">
                  <BlurRevealText text="Where every story" delay={2.0} hoverKey={hoverCounter} />
                  <br />
                  <BlurRevealText text="sparks imagination" delay={2.2} hoverKey={hoverCounter} />
                </h2>
                <p className="imagination-paragraph">
                  We create playful and engaging <strong>animated stories</strong> <strong>and lovable characters</strong> that inspire children to imagine, learn, and dream big.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 自定义光标 */}
        <div className="custom-cursor-layer">
          <div ref={cursorDotRef} className="cursor-dot" />
          <div ref={cursorRingRef} className="cursor-ring" />
        </div>
      </div>
    </>
  )
}
