import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Home, MessageSquare, BarChart3, CreditCard, BookOpen, Terminal, KeyRound, Settings, X, ArrowRight, Sparkles, Zap, Cpu, FlaskConical } from 'lucide-react'
import { api } from '@/lib/api'
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
  const [models, setModels] = useState<{ name: string; provider?: string }[]>([])
  const [modelsLoading, setModelsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // 加载模型列表用于搜索
  useEffect(() => {
    if (!isOpen) return
    const loadModels = async () => {
      setModelsLoading(true)
      try {
        const res = await api.get('/api/pricing')
        const data = res.data?.data || []
        const modelList = data.map((m: any) => ({
          name: m.id || m.model_name || m.name || '',
          provider: m.provider_name || '',
        })).filter((m: any) => m.name)
        if (modelList.length === 0) {
          // fallback: 从 user/models 获取
          const userRes = await api.get('/api/user/models')
          const userModels: string[] = userRes.data?.data || []
          setModels(userModels.map(name => ({ name })))
        } else {
          setModels(modelList)
        }
      } catch {
        setModels([])
      } finally {
        setModelsLoading(false)
      }
    }
    loadModels()
  }, [isOpen])

  const commands: Command[] = useMemo(() => [
    // 导航
    { id: 'home', label: '首页', icon: Home, category: 'navigation', action: () => navigate({ to: '/' }), keywords: 'home main' },
    { id: 'playground', label: 'Playground', icon: FlaskConical, category: 'navigation', action: () => navigate({ to: '/playground' }), keywords: 'playground test api debug' },
    { id: 'models', label: '模型列表', icon: Sparkles, category: 'navigation', action: () => navigate({ to: '/models' }), keywords: 'models list ai' },
    { id: 'rankings', label: '模型排行', icon: BarChart3, category: 'navigation', action: () => navigate({ to: '/rankings' }), keywords: 'rankings top popular' },
    { id: 'pricing', label: '定价方案', icon: CreditCard, category: 'navigation', action: () => navigate({ to: '/plans' }), keywords: 'pricing plans cost' },
    { id: 'docs', label: 'API 文档', icon: BookOpen, category: 'navigation', action: () => navigate({ to: '/docs' }), keywords: 'docs documentation api' },
    { id: 'quickstart', label: '快速开始', icon: Terminal, category: 'navigation', action: () => navigate({ to: '/quickstart' }), keywords: 'quickstart start guide' },
    // 控制台
    { id: 'console-keys', label: 'API 密钥', icon: KeyRound, category: 'navigation', action: () => navigate({ to: '/console/keys' }), keywords: 'api keys tokens' },
    { id: 'console-usage', label: '用量统计', icon: BarChart3, category: 'navigation', action: () => navigate({ to: '/console/usage' }), keywords: 'usage stats analytics logs' },
    { id: 'console-settings', label: '偏好设置', icon: Settings, category: 'navigation', action: () => navigate({ to: '/console/settings' }), keywords: 'settings preferences' },
    // 操作
    { id: 'create-key', label: '创建 API 密钥', icon: KeyRound, category: 'action', action: () => navigate({ to: '/console/keys' }), keywords: 'create key token api' },
  ], [navigate])

  // 模型搜索结果
  const modelCommands: Command[] = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return models
      .filter(m => m.name.toLowerCase().includes(q) || m.provider?.toLowerCase().includes(q))
      .slice(0, 8)
      .map(m => ({
        id: `model-${m.name}`,
        label: m.name,
        description: m.provider || '在 Playground 中打开',
        icon: Cpu,
        category: 'model' as const,
        action: () => navigate({ to: '/playground', search: { model: m.name } }),
        keywords: m.name,
      }))
  }, [query, models, navigate])

  const filteredCommands = useMemo(() => commands.filter(cmd => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords?.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q)
    )
  }), [commands, query])

  // 合并所有结果（模型优先显示）
  const allCommands = useMemo(() => {
    if (query.trim()) {
      return [...modelCommands, ...filteredCommands]
    }
    return filteredCommands
  }, [modelCommands, filteredCommands, query])

  const groupedCommands = useMemo(() => ({
    model: allCommands.filter(c => c.category === 'model'),
    navigation: allCommands.filter(c => c.category === 'navigation'),
    action: allCommands.filter(c => c.category === 'action'),
  }), [allCommands])

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
          setSelectedIndex(prev => Math.min(prev + 1, allCommands.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter' && allCommands[selectedIndex]) {
          e.preventDefault()
          executeCommand(allCommands[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleOpenPalette)
    }
  }, [isOpen, allCommands, selectedIndex, openPalette, closePalette, executeCommand])

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
                placeholder="搜索页面、模型或命令..."
                className="cp-search-input"
              />
              <div className="cp-search-hint">
                <kbd>ESC</kbd>
              </div>
            </div>

            {/* 命令列表 */}
            <div className="cp-commands-list">
              {allCommands.length === 0 ? (
                <div className="cp-empty">
                  <Search size={32} className="cp-empty-icon" />
                  <p>{modelsLoading ? '加载模型中...' : '没有找到匹配的结果'}</p>
                  <p className="cp-empty-hint">试试其他关键词</p>
                </div>
              ) : (
                <>
                  {groupedCommands.model.length > 0 && (
                    <div className="cp-group">
                      <div className="cp-group-title">
                        <Cpu size={12} /> 模型（点击在 Playground 中打开）
                      </div>
                      {groupedCommands.model.map(renderCommand)}
                    </div>
                  )}
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
