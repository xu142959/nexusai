import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { BarChart3, TrendingUp, Clock, Zap, DollarSign, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface LogItem {
  id: number
  created_time: number
  model_name: string
  prompt_tokens: number
  completion_tokens: number
  quota: number
  type: number
  content?: string
  token_name?: string
  user_id?: number
  channel_id?: number
  ip?: string
  duration?: number
  other?: string
}

export function ConsoleUsage() {
  const [logs, setLogs] = useState<LogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quota, setQuota] = useState({ used: 0, total: 0 })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [modelFilter, setModelFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadLogs = async (p: number = page) => {
    setLoading(true)
    try {
      const params: any = { p, page_size: pageSize }
      if (modelFilter) params.model_name = modelFilter
      const logRes = await api.get('/api/log/self', { params })
      const data = logRes.data?.data
      if (data?.items) {
        setLogs(data.items)
        setTotal(data.total || data.items.length)
      } else if (Array.isArray(data)) {
        setLogs(data)
        setTotal(data.length)
      } else {
        setLogs([])
        setTotal(0)
      }
    } catch (e: any) {
      toast.error('加载调用日志失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        await loadLogs(1)
        const userRes = await api.get('/api/user/self')
        const user = userRes.data?.data || {}
        setQuota({
          used: user.used_quota || 0,
          total: user.quota || 0,
        })
      } catch (e: any) {
        toast.error('加载用量数据失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadLogs(page)
    setRefreshing(false)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    loadLogs(newPage)
  }

  const totalPages = Math.ceil(total / pageSize)

  // 统计
  const stats = {
    totalRequests: logs.length,
    totalTokens: logs.reduce((sum, l) => sum + (l.prompt_tokens || 0) + (l.completion_tokens || 0), 0),
    totalCost: logs.reduce((sum, l) => sum + (l.quota || 0), 0),
    uniqueModels: new Set(logs.map(l => l.model_name)).size,
  }

  // 按模型分组统计
  const modelStats = logs.reduce((acc, log) => {
    if (!acc[log.model_name]) {
      acc[log.model_name] = { count: 0, tokens: 0, cost: 0 }
    }
    acc[log.model_name].count++
    acc[log.model_name].tokens += (log.prompt_tokens || 0) + (log.completion_tokens || 0)
    acc[log.model_name].cost += log.quota || 0
    return acc
  }, {} as Record<string, { count: number; tokens: number; cost: number }>)

  const topModels = Object.entries(modelStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">用量统计</h2>
        <p className="text-sm text-gray-500 mt-1">查看你的 API 调用记录和消耗明细</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '总请求数', value: stats.totalRequests.toString(), icon: Zap, color: 'text-blue-400' },
          { label: '总 Token', value: formatNumber(stats.totalTokens), icon: TrendingUp, color: 'text-green-400' },
          { label: '总消耗', value: `$${(stats.totalCost / 500000).toFixed(4)}`, icon: DollarSign, color: 'text-yellow-400' },
          { label: '使用模型', value: stats.uniqueModels.toString(), icon: BarChart3, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-[#c8ff00]/20 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={16} className={s.color} />
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* 余额卡片 */}
      <div className="bg-gradient-to-r from-[#c8ff00]/10 to-transparent border border-[#c8ff00]/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">账户余额</p>
            <p className="text-3xl font-bold text-[#c8ff00]">
              ${((quota.total - quota.used) / 500000).toFixed(4)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              总额度 ${(quota.total / 500000).toFixed(2)} · 已用 ${(quota.used / 500000).toFixed(4)}
            </p>
          </div>
          <div className="text-right">
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c8ff00] rounded-full"
                style={{ width: `${quota.total > 0 ? (quota.used / quota.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {quota.total > 0 ? ((quota.used / quota.total) * 100).toFixed(1) : 0}% 已使用
            </p>
          </div>
        </div>
      </div>

      {/* 热门模型 */}
      {topModels.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-white mb-4">热门模型</h3>
          <div className="space-y-2">
            {topModels.map(([model, data]) => (
              <div key={model} className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{model}</span>
                  <span className="text-xs text-gray-500">{data.count} 次调用</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{formatNumber(data.tokens)} Tokens</span>
                  <span>${(data.cost / 500000).toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 调用记录 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">调用日志明细</h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c8ff00] transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            刷新
          </button>
        </div>

        {/* 筛选栏 */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模型名称..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-[#c8ff00]/50 focus:outline-none"
            />
          </div>
          <select
            value={modelFilter}
            onChange={(e) => { setModelFilter(e.target.value); setPage(1); setTimeout(() => loadLogs(1), 0) }}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#c8ff00]/50 focus:outline-none"
          >
            <option value="">全部模型</option>
            {[...new Set(logs.map(l => l.model_name))].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-lg p-4 animate-pulse">
                <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-2 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={40} className="mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">暂无调用记录</p>
            <p className="text-sm text-gray-600 mt-1">开始使用 API 后，这里会显示调用记录</p>
          </div>
        ) : (
          <>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left text-gray-500">
                      <th className="px-4 py-3 font-medium">时间</th>
                      <th className="px-4 py-3 font-medium">模型</th>
                      <th className="px-4 py-3 font-medium text-right">Prompt</th>
                      <th className="px-4 py-3 font-medium text-right">Completion</th>
                      <th className="px-4 py-3 font-medium text-right">Token 总计</th>
                      <th className="px-4 py-3 font-medium text-right">费用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs
                      .filter(l => !searchQuery || l.model_name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(log => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(log.created_time)}</td>
                        <td className="px-4 py-3 text-white font-mono text-xs">{log.model_name}</td>
                        <td className="px-4 py-3 text-right text-gray-400">{log.prompt_tokens?.toLocaleString() || 0}</td>
                        <td className="px-4 py-3 text-right text-gray-400">{log.completion_tokens?.toLocaleString() || 0}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{((log.prompt_tokens || 0) + (log.completion_tokens || 0)).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-[#c8ff00] font-medium">
                          ${(log.quota / 500000).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500">
                  共 {total} 条记录，第 {page}/{totalPages} 页
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} /> 上一页
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页 <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
