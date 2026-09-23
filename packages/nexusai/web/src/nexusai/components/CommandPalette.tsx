import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Home, MessageSquare, BarChart3, CreditCard, BookOpen, Terminal, KeyRound, Settings, X, ArrowRight, Sparkles, Zap } from 'lucide-react'
import './command-palette.css'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  category: 'navigation' | 'action' | 'model'
  action: () => void
  keywords?: string
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const commands: Command[] = [
    // 导航
    { id: 'home', label: '首页', icon: Home, category: 'navigation', action: () => navigate({ to: '/' }), keywords: 'home main' },
    { id: 'chat', label: '在线聊天', icon: MessageSquare, category: 'navigation', action: () => navigate({ to: '/chat' }), keywords: 'chat conversation ai' },
    { id: 'models', label: '模型列表', icon: Sparkles, category: 'navigation', action: () => navigate({ to: '/models' }), keywords: 'models list ai' },
    { id: 'rankings', label: '模型排行', icon: BarChart3, category: 'navigation', action: () => navigate({ to: '/rankings' }), keywords: 'rankings top popular' },
    { id: 'pricing', label: '定价方案', icon: CreditCard, category: 'navigation', action: () => navigate({ to: '/plans' }), keywords: 'pricing plans cost' },
    { id: 'docs', label: 'API 文档', icon: BookOpen, category: 'navigation', action: () => navigate({ to: '/docs' }), keywords: 'docs documentation api' },
    // 控制台
    { id: 'console-keys', label: 'API 密钥', icon: KeyRound, category: 'navigation', action: () => navigate({ to: '/console/keys' }), keywords: 'api keys tokens' },
    { id: 'console-usage', label: '用量统计', icon: BarChart3, category: 'navigation', action: () => navigate({ to: '/console/usage' }), keywords: 'usage stats analytics' },
    { id: 'console-settings', label: '偏好设置', icon: Settings, category: 'navigation', action: () => navigate({ to: '/console/settings' }), keywords: 'settings preferences' },
    // 操作
    { id: 'new-chat', label: '新建对话', icon: MessageSquare, category: 'action', action: () => navigate({ to: '/chat' }), keywords: 'new chat conversation' },
    { id: 'create-key', label: '创建 API 密钥', icon: KeyRound, category: 'action', action: () => navigate({ to: '/console/keys' }), keywords: 'create key token api' },
  ]

  const filteredCommands = commands.filter(cmd => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords?.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q)
    )
  })

  const groupedCommands = {
    navigation: filteredCommands.filter(c => c.category === 'navigation'),
    action: filteredCommands.filter(c => c.category === 'action'),
  }

  const openPalette = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const closePalette = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const executeCommand = useCallback((cmd: Command) => {
    cmd.action()
    closePalette()
  }, [closePalette])

  useEffect(() => {
    const handleOpenPalette = () => openPalette()
    window.addEventListener('open-command-palette', handleOpenPalette)

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          closePalette()
        } else {
          openPalette()
        }
      }
      if (e.key === 'Escape' && isOpen) {
        closePalette()
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault()
          executeCommand(filteredCommands[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleOpenPalette)
    }
  }, [isOpen, filteredCommands, selectedIndex, openPalette, closePalette, executeCommand])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  let flatIndex = 0
  const renderCommand = (cmd: Command) => {
    const currentIndex = flatIndex++
    const isSelected = currentIndex === selectedIndex
    const Icon = cmd.icon

    return (
      <button
        key={cmd.id}
        onClick={() => executeCommand(cmd)}
        className={`cp-command-item ${isSelected ? 'cp-command-selected' : ''}`}
        onMouseEnter={() => setSelectedIndex(currentIndex)}
      >
        <div className="cp-command-icon">
          <Icon size={16} />
        </div>
        <div className="cp-command-info">
          <span className="cp-command-label">{cmd.label}</span>
          {cmd.description && <span className="cp-command-desc">{cmd.description}</span>}
        </div>
        {isSelected && <ArrowRight size={14} className="cp-command-arrow" />}
      </button>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="cp-overlay"
            onClick={closePalette}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="cp-container"
          >
            {/* 搜索框 */}
            <div className="cp-search-wrapper">
              <Search size={18} className="cp-search-icon" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索命令或页面..."
                className="cp-search-input"
              />
              <div className="cp-search-hint">
                <kbd>ESC</kbd>
              </div>
            </div>

            {/* 命令列表 */}
            <div className="cp-commands-list">
              {filteredCommands.length === 0 ? (
                <div className="cp-empty">
                  <Search size={32} className="cp-empty-icon" />
                  <p>没有找到匹配的命令</p>
                  <p className="cp-empty-hint">试试其他关键词</p>
                </div>
              ) : (
                <>
                  {groupedCommands.navigation.length > 0 && (
                    <div className="cp-group">
                      <div className="cp-group-title">
                        <Zap size={12} /> 导航
                      </div>
                      {groupedCommands.navigation.map(renderCommand)}
                    </div>
                  )}
                  {groupedCommands.action.length > 0 && (
                    <div className="cp-group">
                      <div className="cp-group-title">
                        <Terminal size={12} /> 操作
                      </div>
                      {groupedCommands.action.map(renderCommand)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 底部提示 */}
            <div className="cp-footer">
              <div className="cp-footer-hints">
                <span><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
                <span><kbd>↵</kbd> 执行</span>
                <span><kbd>ESC</kbd> 关闭</span>
              </div>
              <div className="cp-footer-brand">
                <Sparkles size={12} /> NexusAI
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
