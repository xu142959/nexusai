import { copyToClipboard } from '@/lib/copy-to-clipboard'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  KeyRound, Plus, Copy, Check, Trash2, Eye, EyeOff,
  Calendar, Zap, AlertCircle,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Tooltip } from '../../components/Tooltip'
import { toast } from 'sonner'

interface Token {
  id: number
  name: string
  key: string
  created_time: number
  accessed_time?: number
  expired_time?: number
  remain_quota?: number
  unlimited_quota?: boolean
  status: number
}

export function ConsoleKeys() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [fullKeys, setFullKeys] = useState<Record<number, string>>({})
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  const loadTokens = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/token/')
      setTokens(res.data?.data?.items || res.data?.data || [])
    } catch (e: any) {
      toast.error('加载密钥失败：' + (e.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTokens()
  }, [])

  const createToken = async () => {
    if (!newName.trim()) {
      toast.error('请输入密钥名称')
      return
    }
    try {
      const res = await api.post('/api/token/', {
        name: newName,
        remain_quota: 500000, // $1 额度
        expired_time: -1, // 永不过期
      })
      if (res.data?.success) {
        toast.success('密钥创建成功')
        setNewName('')
        setShowCreate(false)
        loadTokens()
      }
    } catch (e: any) {
      toast.error('创建失败：' + (e.response?.data?.message || e.message))
    }
  }

  const deleteToken = async (id: number) => {
    if (!confirm('确定要删除这个密钥吗？删除后无法恢复。')) return
    try {
      await api.delete(`/api/token/${id}`)
      toast.success('密钥已删除')
      loadTokens()
    } catch (e: any) {
      toast.error('删除失败：' + (e.message || '未知错误'))
    }
  }

  const getFullKey = async (token: Token): Promise<string> => {
    if (fullKeys[token.id]) return fullKeys[token.id]
    try {
      const res = await api.post('/api/token/' + token.id + '/key', {}, { skipErrorHandler: true })
      const key = res.data?.data?.key || ''
      if (key) setFullKeys(prev => ({ ...prev, [token.id]: key }))
      return key
    } catch (e: any) {
      toast.error('获取密钥失败：' + (e.message || '未知错误'))
      return ''
    }
  }

  const toggleShowKey = async (token: Token) => {
    if (showKey === token.id) { setShowKey(null); return }
    const key = await getFullKey(token)
    if (key) setShowKey(token.id)
  }

  const copyKey = async (token: Token) => {
    const key = await getFullKey(token)
    if (!key) return
    await copyToClipboard(key)
    setCopiedId(token.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (ts: number) => {
    if (!ts || ts < 0) return '永久'
    return new Date(ts * 1000).toLocaleDateString('zh-CN')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">API 密钥</h2>
          <p className="text-sm text-gray-500 mt-1">管理你的 API 密钥，用于调用 AI 模型</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4ff33] transition-colors"
        >
          <Plus size={16} /> 创建密钥
        </button>
      </div>

      {/* 创建表单 */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-5 mb-6"
        >
          <h3 className="font-medium text-white mb-4">创建新密钥</h3>
          <div className="flex gap-3">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="密钥名称（如：生产环境、测试环境）"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]/50"
              onKeyDown={e => e.key === 'Enter' && createToken()}
            />
            <button
              onClick={createToken}
              className="bg-[#c8ff00] text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d4ff33] transition-colors"
            >
              创建
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="border border-white/10 text-gray-400 px-4 py-2.5 rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              取消
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            默认额度 $1.00，永不过期。创建后请立即复制保存，密钥只显示一次。
          </p>
        </motion.div>
      )}

      {/* 安全提示 */}
      <div className="bg-yellow-500/[0.08] backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-200">
          <strong>安全提示：</strong>API 密钥等同于密码，请勿在客户端代码中暴露。建议为不同环境创建独立密钥，并设置额度上限。
        </div>
      </div>

      {/* 密钥列表 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/4 mb-3" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-16">
          <KeyRound size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 mb-2">还没有 API 密钥</p>
          <p className="text-sm text-gray-600 mb-6">创建你的第一个 API 密钥，开始调用 AI 模型</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#d4ff33] hover:shadow-[0_4px_20px_rgba(200,255,0,0.3)] transition-all duration-300"
          >
            <Plus size={16} /> 创建密钥
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map((token, idx) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-[#c8ff00]/30 hover:bg-white/[0.05] hover:shadow-[0_8px_32px_rgba(200,255,0,0.08)] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-white">{token.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      token.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {token.status === 1 ? '启用' : '禁用'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    {showKey === token.id ? (
                      <span className="text-[#c8ff00] break-all">{fullKeys[token.id] || token.key}</span>
                    ) : (
                      <span className="text-gray-500">
                        {token.key.slice(0, 7)}••••••••••••{token.key.slice(-4)}
                      </span>
                    )}
                    <button
                      onClick={() => toggleShowKey(token)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      {showKey === token.id ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => copyKey(token)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      {copiedId === token.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 创建于 {formatDate(token.created_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={12} />
                      {token.unlimited_quota ? '无限额度' : `剩余 $${((token.remain_quota || 0) / 500000).toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <Tooltip content="删除密钥" position="top">
                  <button
                    onClick={() => deleteToken(token.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
