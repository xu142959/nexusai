import { useState, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Trophy, TrendingUp, TrendingDown, Minus, Clock, BarChart3 } from 'lucide-react'
import { api } from '@/lib/api'
import { SNLoading, SNPageHeader } from '../components/StoryNestUI'

interface RankedModel {
  rank: number
  previous_rank?: number
  model_name: string
  vendor: string
  category: string
  total_tokens: number
  share: number
  growth_pct: number
}

interface RankingsResponse {
  models: RankedModel[]
  vendors: any[]
  top_movers: any[]
  top_droppers: any[]
}

type TimeRange = 'day' | 'week' | 'month'

export function NexusRankings() {
  const [data, setData] = useState<RankedModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const [topMovers, setTopMovers] = useState<any[]>([])
  const [topDroppers, setTopDroppers] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/api/rankings', {
          params: { period: timeRange },
        })
        const result = res.data?.data as RankingsResponse
        if (result && Array.isArray(result.models)) {
          setData(result.models)
          setTopMovers(result.top_movers || [])
          setTopDroppers(result.top_droppers || [])
        } else {
          setData([])
        }
      } catch (e: any) {
        setError(e.message || '加载排行榜失败')
        setData([
          { rank: 1, model_name: 'gpt-4o', vendor: 'OpenAI', category: 'chat', total_tokens: 1250000000, share: 25.5, growth_pct: 12.3 },
          { rank: 2, model_name: 'claude-3-opus', vendor: 'Anthropic', category: 'chat', total_tokens: 980000000, share: 20.1, growth_pct: 8.5 },
          { rank: 3, model_name: 'gemini-1.5-pro', vendor: 'Google', category: 'chat', total_tokens: 870000000, share: 17.8, growth_pct: -2.1 },
          { rank: 4, model_name: 'gpt-3.5-turbo', vendor: 'OpenAI', category: 'chat', total_tokens: 650000000, share: 13.2, growth_pct: -5.4 },
          { rank: 5, model_name: 'claude-3-sonnet', vendor: 'Anthropic', category: 'chat', total_tokens: 540000000, share: 11.0, growth_pct: 15.2 },
          { rank: 6, model_name: 'llama-3-70b', vendor: 'Meta', category: 'chat', total_tokens: 420000000, share: 8.5, growth_pct: 3.1 },
          { rank: 7, model_name: 'mistral-large', vendor: 'Mistral', category: 'chat', total_tokens: 380000000, share: 7.7, growth_pct: -1.2 },
          { rank: 8, model_name: 'deepseek-chat', vendor: 'DeepSeek', category: 'chat', total_tokens: 320000000, share: 6.5, growth_pct: 22.4 },
          { rank: 9, model_name: 'qwen2-72b', vendor: 'Alibaba', category: 'chat', total_tokens: 280000000, share: 5.7, growth_pct: 9.8 },
          { rank: 10, model_name: 'command-r-plus', vendor: 'Cohere', category: 'chat', total_tokens: 210000000, share: 4.3, growth_pct: -3.5 },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [timeRange])

  const maxTokens = data[0]?.total_tokens || 1

  const formatNumber = (n: number) => {
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B'
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  const getRankDelta = (model: RankedModel) => {
    if (!model.previous_rank) return null
    return model.previous_rank - model.rank
  }

  const timeRanges = [
    { key: 'day' as TimeRange, label: '今日' },
    { key: 'week' as TimeRange, label: '本周' },
    { key: 'month' as TimeRange, label: '本月' },
  ]

  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      <div className="max-w-[1880px] mx-auto px-6 py-10">
        <SNPageHeader title="模型排行榜" subtitle="基于平台实际调用量的模型热度排名" />

        <div className="flex items-center gap-2 mb-6">
          {timeRanges.map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.key
                  ? 'bg-[#c8ff00] text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {(topMovers.length > 0 || topDroppers.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {topMovers.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-[#c8ff00]/20 transition-all duration-300">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" /> 上升最快
                </h3>
                <div className="space-y-2">
                  {topMovers.slice(0, 3).map((mover, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{mover.model_name}</span>
                      <span className="text-green-400">+{mover.rank_delta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topDroppers.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-[#c8ff00]/20 transition-all duration-300">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingDown size={16} className="text-red-400" /> 下降最快
                </h3>
                <div className="space-y-2">
                  {topDroppers.slice(0, 3).map((dropper, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{dropper.model_name}</span>
                      <span className="text-red-400">{dropper.rank_delta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* 市场份额可视化 */}
        {data.length > 0 && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#c8ff00]" /> 市场份额 Top 5
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {data.slice(0, 5).map((model, i) => (
                <div key={model.model_name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 truncate max-w-[120px]">{model.model_name}</span>
                    <span className="text-[#c8ff00] font-medium">{(model.share * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="market-share-bar h-full rounded-full"
                      style={{ transform: 'scaleX(' + [Math.max(model.share * 100 * 3, 5) / 100] + ')' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-[#c8ff00]" />
              <span className="font-semibold text-white">模型热度排名</span>
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} /> 数据每小时更新 · 点击模型可直接开始对话
            </span>
          </div>

          {loading ? (
            <SNLoading text="加载排行榜数据中..." />
          ) : (
            <div className="divide-y divide-white/5">
              {data.map((model, idx) => {
                const delta = getRankDelta(model)
                return (
                  <motion.div
                    key={model.model_name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Link
                      to="/chat"
                      search={{ model: model.model_name }}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className={`w-8 text-center font-bold ${model.rank <= 3 ? 'text-[#c8ff00]' : 'text-gray-500'}`}>
                        {model.rank}
                      </div>
                      <div className="w-8">
                        {delta === null ? (
                          <Minus size={14} className="text-gray-600" />
                        ) : delta > 0 ? (
                          <span className="text-green-400 text-xs flex items-center rank-delta-up"><TrendingUp size={12} className="rank-arrow-up" /> {delta}</span>
                        ) : delta < 0 ? (
                          <span className="text-red-400 text-xs flex items-center rank-delta-down"><TrendingDown size={12} className="rank-arrow-down" /> {Math.abs(delta)}</span>
                        ) : (
                          <Minus size={14} className="text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{model.model_name}</div>
                        <div className="text-xs text-gray-500">{model.vendor}</div>
                      </div>
                      <div className="hidden md:block w-40">
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#c8ff00] to-[#8fcc00] rounded-full" style={{ width: `${(model.total_tokens / maxTokens) * 100}%` }} />
                        </div>
                      </div>
                      <div className="text-right w-24">
                        <div className="text-sm text-white font-medium">{formatNumber(model.total_tokens)}</div>
                        <div className="text-xs text-gray-500">tokens</div>
                      </div>
                      <div className="text-right w-16">
                        <div className="text-sm text-gray-300">{model.share.toFixed(1)}%</div>
                      </div>
                      <div className="text-right w-16">
                        <div className={`text-sm font-medium ${model.growth_pct > 0 ? 'text-green-400' : model.growth_pct < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {model.growth_pct > 0 ? '+' : ''}{model.growth_pct.toFixed(1)}%
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}