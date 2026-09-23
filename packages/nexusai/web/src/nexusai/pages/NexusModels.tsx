import { useState, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, Copy, Check, ChevronDown, LayoutGrid, List, Filter, Sparkles, Clock, Gauge, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'
import { api } from '@/lib/api'
import './models-square.css'

interface ModelItem {
  name: string
  provider: string
  group: string
  endpoint: string
  inputPrice: number
  outputPrice: number
  successRate: number
  latency: number
  throughput: number
  tags: string[]
  description: string
}

function inferProvider(name: string): string {
  const lower = name.toLowerCase()
  const map: Record<string, string[]> = {
    'Anthropic': ['claude', 'anthropic'],
    'OpenAI': ['gpt', 'o1', 'o3', 'dall-e', 'whisper', 'tts', 'openai'],
    'Google': ['gemini', 'palm', 'gemma', 'google'],
    'Meta': ['llama', 'meta'],
    'Mistral': ['mistral', 'mixtral'],
    'DeepSeek': ['deepseek'],
    'Qwen': ['qwen'],
    'Zhipu': ['glm', 'zhipu', 'chatglm'],
    'Moonshot': ['kimi', 'moonshot'],
    'ByteDance': ['doubao', 'seed'],
    '01.AI': ['yi-', '01ai'],
    'Cohere': ['command', 'cohere'],
  }
  for (const [provider, keywords] of Object.entries(map)) {
    if (keywords.some(k => lower.includes(k))) return provider
  }
  return 'Other'
}

function inferEndpoint(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('dall') || lower.includes('stable') || lower.includes('midjourney') || lower.includes('flux')) return 'images'
  if (lower.includes('whisper') || lower.includes('tts')) return 'audio'
  if (lower.includes('embedding')) return 'embeddings'
  return 'chat'
}

function inferTags(name: string): string[] {
  const lower = name.toLowerCase()
  const tags: string[] = []
  if (lower.includes('gpt-4') || lower.includes('claude-3') || lower.includes('gemini-1.5') || lower.includes('opus')) tags.push('premium')
  if (lower.includes('flash') || lower.includes('mini') || lower.includes('lite') || lower.includes('small')) tags.push('fast')
  if (lower.includes('dall') || lower.includes('stable') || lower.includes('midjourney')) tags.push('image')
  if (lower.includes('code') || lower.includes('coder')) tags.push('code')
  if (lower.includes('reason') || lower.includes('o1') || lower.includes('o3')) tags.push('reasoning')
  return tags.length > 0 ? tags : ['general']
}

function generateMockMetrics(name: string) {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return { successRate: 85 + (hash % 15), latency: 0.8 + (hash % 30) / 10, throughput: 20 + (hash % 80) }
}

export function NexusModels() {
  const [models, setModels] = useState<ModelItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedEndpoint, setSelectedEndpoint] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'latency'>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    // 写死演示数据，避免未登录时 401 重定向
    const demoModels = [
      'gpt-4o', 'gpt-4o-mini', 'claude-3-opus', 'claude-3.5-sonnet',
      'gemini-2.0-flash', 'gemini-1.5-pro', 'deepseek-v3', 'deepseek-r1',
      'qwen-max', 'qwen-plus', 'glm-4-plus', 'moonshot-v1-8k',
    ]
    const items: ModelItem[] = demoModels.map(name => {
      const provider = inferProvider(name)
      const metrics = generateMockMetrics(name)
      return { name, provider, group: 'default', endpoint: inferEndpoint(name), inputPrice: 0.5 + (name.length % 20) * 0.1, outputPrice: 1.0 + (name.length % 30) * 0.1, successRate: metrics.successRate, latency: metrics.latency, throughput: metrics.throughput, tags: inferTags(name), description: '' }
    })
    setModels(items)
    setLoading(false)
  }, [])

  const providers = useMemo(() => ['all', ...new Set(models.map(m => m.provider))], [models])
  const tags = useMemo(() => ['all', ...new Set(models.flatMap(m => m.tags))], [models])
  const endpoints = useMemo(() => ['all', ...new Set(models.map(m => m.endpoint))], [models])

  const filtered = useMemo(() => {
    let result = models.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.provider.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedProvider !== 'all' && m.provider !== selectedProvider) return false
      if (selectedTag !== 'all' && !m.tags.includes(selectedTag)) return false
      if (selectedEndpoint !== 'all' && m.endpoint !== selectedEndpoint) return false
      return true
    })
    if (sortBy === 'name') result = result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'price') result = result.sort((a, b) => a.inputPrice - b.inputPrice)
    if (sortBy === 'latency') result = result.sort((a, b) => a.latency - b.latency)
    return result
  }, [models, search, selectedProvider, selectedTag, selectedEndpoint, sortBy])

  const copyName = (name: string) => { navigator.clipboard.writeText(name); setCopiedName(name); setTimeout(() => setCopiedName(null), 2000) }
  const resetFilters = () => { setSelectedProvider('all'); setSelectedTag('all'); setSelectedEndpoint('all'); setSearch('') }

  const FilterSection = ({ title, items, selected, onSelect }: { title: string; items: string[]; selected: string; onSelect: (v: string) => void }) => (
    <div className="ms-filter-section">
      <div className="ms-filter-title">{title}</div>
      <div className="ms-filter-tags">
        {items.map(item => (
          <button key={item} onClick={() => onSelect(item)} className={'ms-filter-tag ' + (selected === item ? 'ms-filter-tag-active' : '')}>
            {item === 'all' ? '所有' : item}
          </button>
        ))}
      </div>
    </div>
  )

  if (loading) return <div className="ms-page"><div className="ms-loading"><div className="ms-loading-spinner" /><p>加载模型中...</p></div></div>

  return (
    <div className="ms-page">
      <div className="ms-hero">
        <h1 className="ms-hero-title">模型广场</h1>
        <p className="ms-hero-subtitle">本站当前已启用模型，总计 {models.length} 个</p>
        <p className="ms-hero-desc">探索精选 AI 模型，清晰比较价格与能力，为不同场景选择合适的模型。</p>
      </div>

      <div className="ms-search-bar">
        <Search size={18} className="ms-search-icon" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索模型名称、供应商、端点或标签..." className="ms-search-input" />
        <kbd className="ms-search-kbd">⌘K</kbd>
      </div>

      <div className="ms-content">
        <aside className={'ms-sidebar ' + (showFilters ? '' : 'ms-sidebar-hidden')}>
          <div className="ms-sidebar-header">
            <div className="ms-sidebar-title"><Filter size={14} /> 筛选</div>
            <button onClick={resetFilters} className="ms-reset-btn">重置</button>
          </div>
          <p className="ms-sidebar-desc">按供应商、类型和标签细化模型。</p>
          <FilterSection title="供应商" items={providers} selected={selectedProvider} onSelect={setSelectedProvider} />
          <FilterSection title="模型标签" items={tags} selected={selectedTag} onSelect={setSelectedTag} />
          <FilterSection title="端点类型" items={endpoints} selected={selectedEndpoint} onSelect={setSelectedEndpoint} />
        </aside>

        <main className="ms-main">
          <div className="ms-toolbar">
            <div className="ms-toolbar-left">
              <span className="ms-model-count">{filtered.length} 个模型</span>
              {!showFilters && <button onClick={() => setShowFilters(true)} className="ms-filter-toggle"><Filter size={14} /> 筛选</button>}
            </div>
            <div className="ms-toolbar-right">
              <div className="ms-sort-group">
                <button onClick={() => setSortBy('name')} className={'ms-sort-btn ' + (sortBy === 'name' ? 'ms-sort-active' : '')}>名称</button>
                <button onClick={() => setSortBy('price')} className={'ms-sort-btn ' + (sortBy === 'price' ? 'ms-sort-active' : '')}>价格</button>
                <button onClick={() => setSortBy('latency')} className={'ms-sort-btn ' + (sortBy === 'latency' ? 'ms-sort-active' : '')}>延迟</button>
              </div>
              <div className="ms-view-toggle">
                <button onClick={() => setViewMode('grid')} className={'ms-view-btn ' + (viewMode === 'grid' ? 'ms-view-active' : '')}><LayoutGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} className={'ms-view-btn ' + (viewMode === 'list' ? 'ms-view-active' : '')}><List size={16} /></button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="ms-empty">
              <Sparkles size={48} className="ms-empty-icon" />
              <h3>没有找到匹配的模型</h3>
              <p>尝试调整筛选条件或搜索关键词</p>
              <button onClick={resetFilters} className="ms-empty-btn">重置筛选</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="ms-grid">
              {filtered.map((model, i) => (
                <motion.div key={model.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.03 }} className="ms-card">
                  <div className="ms-card-header">
                    <div className="ms-card-avatar">{model.name.charAt(0).toUpperCase()}</div>
                    <div className="ms-card-name-group">
                      <h3 className="ms-card-name">{model.name}</h3>
                      <span className="ms-card-provider">{model.provider}</span>
                    </div>
                    <button onClick={() => copyName(model.name)} className="ms-copy-btn" title="复制模型名">
                      {copiedName === model.name ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className={'ms-card-desc' + (model.description ? '' : ' ms-card-desc-empty')}>{model.description || '暂无描述。'}</p>
                  <div className="ms-card-tags">
                    <span className="ms-tag ms-tag-orange">动态计费</span>
                    {model.tags.slice(0, 2).map(tag => <span key={tag} className="ms-tag">{tag}</span>)}
                  </div>
                  <div className="ms-card-pricing">
                    <div className="ms-price-col"><span className="ms-price-label">输入</span><span className="ms-price-value">${model.inputPrice.toFixed(2)} <span className="ms-price-unit">/ 1M</span></span></div>
                    <div className="ms-price-col"><span className="ms-price-label">输出</span><span className="ms-price-value">${model.outputPrice.toFixed(2)} <span className="ms-price-unit">/ 1M</span></span></div>
                  </div>
                  <div className="ms-card-meta">
                    <span className="ms-meta-item">端点 {model.endpoint}</span>
                  </div>
                  <div className="ms-card-metrics">
                    <div className="ms-metric"><div className="ms-metric-bar" style={{ width: model.successRate + '%' }} /><span className="ms-metric-label">{model.successRate.toFixed(0)}%</span></div>
                    <div className="ms-metric-info">
                      <span><Clock size={12} /> {model.latency.toFixed(1)}s</span>
                      <span><Gauge size={12} /> {model.throughput.toFixed(0)}t/s</span>
                    </div>
                  </div>
                  <div className="ms-card-footer">
                    <Link to={'/model/' + model.provider.toLowerCase() + '/' + model.name} className="ms-detail-link">详情 <ChevronDown size={14} className="ms-detail-arrow" /></Link>
                    <Link to="/chat" className="ms-chat-btn"><MessageSquare size={14} /> 对话</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="ms-list">
              {filtered.map((model, i) => (
                <motion.div key={model.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.02 }} className="ms-list-item">
                  <div className="ms-list-avatar">{model.name.charAt(0).toUpperCase()}</div>
                  <div className="ms-list-info">
                    <h3 className="ms-list-name">{model.name}</h3>
                    <span className="ms-list-provider">{model.provider} · {model.endpoint}</span>
                  </div>
                  <div className="ms-list-pricing"><span>${model.inputPrice.toFixed(2)}/1M</span><span className="text-gray-500">→</span><span>${model.outputPrice.toFixed(2)}/1M</span></div>
                  <div className="ms-list-metrics"><span>{model.successRate.toFixed(0)}%</span><span>{model.latency.toFixed(1)}s</span></div>
                  <div className="ms-list-actions">
                    <button onClick={() => copyName(model.name)} className="ms-icon-btn">{copiedName === model.name ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>
                    <Link to="/chat" className="ms-icon-btn ms-icon-btn-primary"><MessageSquare size={14} /></Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
