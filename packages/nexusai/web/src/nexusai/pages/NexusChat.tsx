import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Bot, User, Plus, MessageSquare, KeyRound, AlertCircle,
  Trash2, Copy, Check, Settings, X, StopCircle, RotateCcw, Pencil,
  ChevronDown, Menu, Sparkles, LogOut,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Link, useSearch, useRouter } from '@tanstack/react-router'
import { api, clearAuthentication } from '@/lib/api'
import { useChatStore, type ChatMessage } from '../store/chatStore'
import { getApiKey, clearApiKeyCache } from '../lib/apikey'
import { Markdown } from '../components/Markdown'
import { BRAND } from '../config/brand'

export function NexusChat() {
  const search = useSearch({ strict: false }) as { model?: string }
  const {
    conversations, activeId,
    createConversation, deleteConversation, setActive,
    addMessage, updateMessage, updateConversation, deleteMessage,
  } = useChatStore()

  const activeConv = conversations.find(c => c.id === activeId)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelList, setModelList] = useState<string[]>([])
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [hasKey, setHasKey] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleLogout = () => {
    clearAuthentication()
    clearApiKeyCache()
    router.navigate({ to: '/sign-in' })
  }

  // 初始化：加载模型列表和 API key
  useEffect(() => {
    const init = async () => {
      // 模型列表 - 写死演示数据
      const demoModels = ['gpt-4o', 'claude-3.5-sonnet', 'gemini-2.0-flash', 'deepseek-v3', 'qwen-max']
      const unique = [...new Set(demoModels)].sort()
      setModelList(unique)
      if (activeConv && !activeConv.model && unique.length > 0) {
        updateConversation(activeConv.id, { model: unique[0] })
      }

      // API key
      const key = await getApiKey()
      if (key) {
        setApiKey(key)
        setHasKey(true)
      } else {
        setHasKey(false)
      }
    }
    init()
  }, [])

  // 自动滚动到底部
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  // 确保有一个活跃对话
  useEffect(() => {
    if (!activeId && conversations.length === 0) {
      const id = createConversation(modelList[0])
      setActive(id)
    } else if (!activeId && conversations.length > 0) {
      setActive(conversations[0].id)
    }
  }, [activeId, conversations.length, modelList])

  const model = activeConv?.model || ''

  const send = useCallback(async () => {
    if (!input.trim() || loading || !apiKey || !activeConv) return
    const text = input.trim()
    setInput('')
    setError(null)

    // 添加用户消息
    const userMsg: Omit<ChatMessage, 'id' | 'createdAt'> = { role: 'user', content: text }
    addMessage(activeConv.id, userMsg)

    // 添加空的助手消息
    const assistantId = Math.random().toString(36).slice(2)
    addMessage(activeConv.id, { role: 'assistant', content: '' })

    setLoading(true)
    abortRef.current = new AbortController()

    try {
      const response = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: activeConv.model,
          messages: [
            ...(activeConv.systemPrompt
              ? [{ role: 'system', content: activeConv.systemPrompt }]
              : []),
            ...activeConv.messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
          stream: true,
          temperature: activeConv.temperature,
          max_tokens: activeConv.maxTokens,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let reply = ''
      let lastMsgId: string | null = null

      // 获取刚添加的助手消息 ID
      const conv = useChatStore.getState().conversations.find(c => c.id === activeConv.id)
      if (conv && conv.messages.length > 0) {
        lastMsgId = conv.messages[conv.messages.length - 1].id
      }

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              reader = null
              break
            }
            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices?.[0]?.delta?.content || ''
              if (delta) {
                reply += delta
                if (lastMsgId) {
                  updateMessage(activeConv.id, lastMsgId, reply)
                }
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        // 用户停止生成
      } else {
        const errMsg = e.message?.includes('401') || e.message?.includes('Invalid token')
          ? 'API Key 无效，请在管理端创建有效的 API Key。'
          : e.message?.includes('404') || e.message?.includes('model')
          ? `模型 "${activeConv.model}" 不可用，请在管理端配置对应渠道。`
          : e.message?.includes('429')
          ? '请求过于频繁，请稍后再试。'
          : `请求失败：${e.message || '未知错误'}。`
        setError(errMsg)
        // 更新最后一条消息为错误
        const conv = useChatStore.getState().conversations.find(c => c.id === activeConv.id)
        if (conv && conv.messages.length > 0) {
          const lastId = conv.messages[conv.messages.length - 1].id
          updateMessage(activeConv.id, lastId, `❌ ${errMsg}`)
        }
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [input, loading, apiKey, activeConv, addMessage, updateMessage])

  const stopGeneration = () => {
    abortRef.current?.abort()
    setLoading(false)
  }

  const regenerate = async () => {
    if (!activeConv || activeConv.messages.length < 2) return
    // 找到最后一条用户消息
    const lastUserIdx = [...activeConv.messages].reverse().findIndex(m => m.role === 'user')
    if (lastUserIdx === -1) return
    const actualIdx = activeConv.messages.length - 1 - lastUserIdx
    const userMsg = activeConv.messages[actualIdx]

    // 截断到用户消息之前
    const conv = useChatStore.getState().conversations.find(c => c.id === activeConv.id)
    if (!conv) return
    // 重新发送
    setInput(userMsg.content)
    // 删除用户消息之后的所有消息
    useChatStore.setState(state => ({
      conversations: state.conversations.map(c =>
        c.id === activeConv.id
          ? { ...c, messages: c.messages.slice(0, actualIdx) }
          : c
      ),
    }))
    // 延迟发送
    setTimeout(() => send(), 100)
  }

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleNewChat = () => {
    const id = createConversation(modelList[0] || model)
    setActive(id)
    setError(null)
  }

  return (
    <div className="flex h-screen bg-[#03080a]">
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`storynest-global fixed md:relative z-30 w-72 h-full border-r border-white/10 bg-[#0a0f12]/80 backdrop-blur-xl flex flex-col transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
        }`}
      >
        {/* 品牌 Logo */}
        <Link to="/" className="p-4 pb-2 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-[#c8ff00] flex items-center justify-center">
            <span className="text-black font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-white">{BRAND.name}</span>
        </Link>
        <div className="px-4 pb-4 flex-shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-[#c8ff00] text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d4ff33] transition-colors"
          >
            <Plus size={16} /> 新建对话
          </button>
        </div>

        {/* 模型选择 */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="relative">
            <select
              value={model}
              onChange={e => activeConv && updateConversation(activeConv.id, { model: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none appearance-none cursor-pointer hover:border-white/20"
            >
              {modelList.length > 0 ? (
                modelList.map(m => <option key={m} value={m}>{m}</option>)
              ) : (
                <option value="">加载模型中...</option>
              )}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-8">暂无对话</p>
          )}
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                conv.id === activeId
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
              onClick={() => { setActive(conv.id); setSidebarOpen(false); setError(null) }}
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="flex-1 truncate">{conv.title || '新对话'}</span>
              <button
                onClick={e => { e.stopPropagation(); deleteConversation(conv.id) }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* 底部状态 */}
        <div className="p-4 border-t border-white/5 flex-shrink-0 space-y-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={14} /> 参数设置
          </button>
          <div className="text-xs space-y-1">
            {hasKey ? (
              <p className="flex items-center gap-1 text-green-400">
                <KeyRound size={12} /> API Key 已就绪
              </p>
            ) : (
              <p className="flex items-center gap-1 text-yellow-400">
                <AlertCircle size={12} /> 无 API Key
                <Link to="/console/keys" className="underline ml-1">去创建</Link>
              </p>
            )}
          </div>
        </div>
      </motion.aside>

      {/* 主区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-gray-400 hover:text-white md:hidden"
            >
              <Menu size={18} />
            </button>
            <span className="text-sm font-medium text-gray-300 truncate">
              {activeConv?.title || '新对话'}
            </span>
            {model && (
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                {model}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {loading && (
              <button
                onClick={stopGeneration}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded"
              >
                <StopCircle size={14} /> 停止
              </button>
            )}
            {!loading && activeConv && activeConv.messages.length > 0 && (
              <button
                onClick={regenerate}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded"
              >
                <RotateCcw size={14} /> 重新生成
              </button>
            )}
            {/* 用户菜单 */}
            <div className="relative ml-2">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c8ff00] to-[#8fcc00] flex items-center justify-center text-[#03080a] text-xs font-bold">
                  U
                </div>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-44 bg-[#0a0f12] border border-white/10 rounded-xl py-2 shadow-xl z-20">
                    <Link
                      to="/console/keys"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      控制台
                    </Link>
                    <Link
                      to="/console/usage"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      用量统计
                    </Link>
                    <div className="border-t border-white/5 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                    >
                      <LogOut size={14} /> 退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 设置面板 */}
        <AnimatePresence>
          {showSettings && activeConv && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/5 overflow-hidden"
            >
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">系统提示词</label>
                  <textarea
                    value={activeConv.systemPrompt}
                    onChange={e => updateConversation(activeConv.id, { systemPrompt: e.target.value })}
                    placeholder="你是一个有用的助手..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none resize-none h-20"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    温度: {activeConv.temperature.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={activeConv.temperature}
                    onChange={e => updateConversation(activeConv.id, { temperature: parseFloat(e.target.value) })}
                    className="w-full accent-[#c8ff00]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Max Tokens: {activeConv.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="256"
                    max="32768"
                    step="256"
                    value={activeConv.maxTokens}
                    onChange={e => updateConversation(activeConv.id, { maxTokens: parseInt(e.target.value) })}
                    className="w-full accent-[#c8ff00]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 text-sm text-red-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </span>
            <button onClick={() => setError(null)}><X size={14} /></button>
          </div>
        )}

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1880px] mx-auto p-6 space-y-6">
            {(!activeConv || activeConv.messages.length === 0) && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
                <div className="w-16 h-16 rounded-2xl bg-[#c8ff00]/10 flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-[#c8ff00]" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">开始对话</h2>
                <p className="text-sm text-gray-400 mb-6">选择一个模型，输入你的问题</p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  {['解释量子计算', '写一首关于秋天的诗', '帮我优化这段代码', '推荐几本好书'].map(s => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-left text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-gray-300 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeConv?.messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-[#c8ff00] text-black' : 'bg-white/10 text-gray-300'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] group relative`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#c8ff00] text-black'
                      : 'bg-white/5 text-gray-100'
                  }`}>
                    {msg.role === 'assistant' ? (
                      msg.content ? (
                        <Markdown content={msg.content} />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                      )
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    )}
                  </div>
                  {/* 消息操作 */}
                  {msg.content && (
                    <div className={`absolute top-2 ${msg.role === 'user' ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1`}>
                      <button
                        onClick={() => copyMessage(msg.content, msg.id)}
                        className="p-1 text-gray-500 hover:text-white"
                        title="复制"
                      >
                        {copiedId === msg.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {/* 输入框 */}
        <div className="border-t border-white/5 p-4 flex-shrink-0">
          <div className="max-w-[1880px] mx-auto">
            {!hasKey && (
              <div className="mb-3 text-xs text-yellow-400 flex items-center gap-1">
                <AlertCircle size={12} />
                还没有 API Key，
                <Link to="/console/keys" className="underline font-semibold">去创建 →</Link>
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder={hasKey ? '输入消息... (Enter 发送, Shift+Enter 换行)' : '请先创建 API Key'}
                disabled={!hasKey}
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#c8ff00]/50 disabled:opacity-50 resize-none text-sm max-h-32"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim() || !hasKey}
                className="bg-[#c8ff00] text-black px-4 py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-[#d4ff33] transition-colors self-end"
              >
                {loading ? <StopCircle size={18} onClick={e => { e.stopPropagation(); stopGeneration() }} /> : <Send size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              NexusAI Chat · 统一 AI 模型接口
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


