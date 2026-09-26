import { copyToClipboard } from '@/lib/copy-to-clipboard'
import { useState, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, Copy, Check, ChevronDown, LayoutGrid, List, Filter, Sparkles, MessageSquare, GitCompare, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import './models-square.css'

interface ModelItem {
  name: string
  provider: string
  group: string
  endpoint: string
  inputPrice: number | null
  outputPrice: number | null
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

export function NexusModels() {
  const [models, setModels] = useState<ModelItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedEndpoint, setSelectedEndpoint] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const toggleCompare = (name: string) => {
    setCompareList(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name)
      if (prev.length >= 4) { toast.warning('最多对比4个模型'); return prev }
      return [...prev, name]
    })
  }

  const compareModels = useMemo(() =>
    compareList.map(name => models.find(m => m.name === name)).filter(Boolean) as ModelItem[],
    [compareList, models]
  )

  useEffect(() => {
    const loadModels = async () => {
      try {
        const pricingRes = await api.get('/api/pricing')
        const pricingData = pricingRes.data?.data || []
        const priceMap = new Map<string, { input: number | null; output: number | null }>()
        pricingData.forEach((p: any) => {
          const id = p.id || p.model_name || p.name
          if (id) {
            priceMap.set(id, {
              input: p.model_ratio != null ? p.model_ratio : (p.input_price ?? null),
              output: p.completion_ratio != null ? p.completion_ratio : (p.output_price ?? null),
            })
          }
        })

        const res = await api.get('/api/user/models')
        const realModels: string[] = res.data?.data || []
        if (realModels.length > 0) {
          const items: ModelItem[] = realModels.map(name => {
            const price = priceMap.get(name)
            return {
              name,
              provider: inferProvider(name),
              group: 'default',
              endpoint: inferEndpoint(name),
              inputPrice: price?.input ?? null,
              outputPrice: price?.output ?? null,
              tags: inferTags(name),
              description: '',
            }
          })
          setModels(items)
        } else if (pricingData.length > 0) {
          const items: ModelItem[] = pricingData.map((p: any) => {
            const name = p.id || p.model_name || p.name || ''
            return {
              name,
              provider: p.provider_name || inferProvider(name),
              group: p.group || 'default',
              endpoint: inferEndpoint(name),
              inputPrice: p.model_ratio != null ? p.model_ratio : (p.input_price ?? null),
              outputPrice: p.completion_ratio != null ? p.completion_ratio : (p.output_price ?? null),
              tags: inferTags(name),
              description: p.description || '',
            }
          })
          setModels(items)
        } else {
          setModels([])
        }
      } catch {
        setModels([])
      } finally {
        setLoading(false)
      }
    }
    loadModels()
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
    if (sortBy === 'price') result = result.sort((a, b) => (a.inputPrice ?? 999) - (b.inputPrice ?? 999))
    return result
  }, [models, search, selectedProvider, selectedTag, selectedEndpoint, sortBy])

  const copyName = (name: string) => { copyToClipboard(name); setCopiedName(name); setTimeout(() => setCopiedName(null), 2000) }
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
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="ms-compare-btn"
                  style={{ background: '#c8ff00', color: '#03080a', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginRight: 12 }}
                >
                  <GitCompare size={14} /> 对比 ({compareList.length})
                </button>
              )}
              <div className="ms-sort-group">
                <button onClick={() => setSortBy('name')} className={'ms-sort-btn ' + (sortBy === 'name' ? 'ms-sort-active' : '')}>名称</button>
                <button onClick={() => setSortBy('price')} className={'ms-sort-btn ' + (sortBy === 'price' ? 'ms-sort-active' : '')}>价格</button>
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
                <motion.div key={model.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.03 }} className="ms-card" style={{ position: 'relative' }}>
                  <button
                    onClick={() => toggleCompare(model.name)}
                    title={compareList.includes(model.name) ? '取消对比' : '加入对比'}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 10,
                      width: 28, height: 28, borderRadius: 6,
                      background: compareList.includes(model.name) ? '#c8ff00' : 'rgba(255,255,255,0.1)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: compareList.includes(model.name) ? '#03080a' : '#999',
                    }}
                  >
                    {compareList.includes(model.name) ? <Check size={14} /> : <GitCompare size={14} />}
                  </button>
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
                    <div className="ms-price-col">
                      <span className="ms-price-label">输入</span>
                      <span className="ms-price-value">
                        {model.inputPrice != null ? (<>{model.inputPrice.toFixed(2)} <span className="ms-price-unit">/ 1M</span></>) : '—'}
                      </span>
                    </div>
                    <div className="ms-price-col">
                      <span className="ms-price-label">输出</span>
                      <span className="ms-price-value">
                        {model.outputPrice != null ? (<>{model.outputPrice.toFixed(2)} <span className="ms-price-unit">/ 1M</span></>) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="ms-card-meta">
                    <span className="ms-meta-item">端点 {model.endpoint}</span>
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
                  <div className="ms-list-pricing"><span>{model.inputPrice != null ? `$${model.inputPrice.toFixed(2)}/1M` : '—'}</span><span className="text-gray-500">→</span><span>{model.outputPrice != null ? `$${model.outputPrice.toFixed(2)}/1M` : '—'}</span></div>
                  <div className="ms-list-metrics"><span>{model.endpoint}</span></div>
                  <div className="ms-list-actions">
                    <button onClick={() => toggleCompare(model.name)} title="加入对比" style={{ width: 32, height: 32, borderRadius: 6, background: compareList.includes(model.name) ? '#c8ff00' : 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: compareList.includes(model.name) ? '#03080a' : '#999' }}>
                      {compareList.includes(model.name) ? <Check size={14} /> : <GitCompare size={14} />}
                    </button>
                    <button onClick={() => copyName(model.name)} className="ms-icon-btn">{copiedName === model.name ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>
                    <Link to="/chat" className="ms-icon-btn ms-icon-btn-primary"><MessageSquare size={14} /></Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 对比弹窗 */}
      <AnimatePresence>
        {showCompare && compareModels.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setShowCompare(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ background: '#0a0f12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, maxWidth: 900, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: 32 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitCompare size={20} className="text-[#c8ff00]" /> 模型对比
                </h2>
                <button onClick={() => setShowCompare(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#666', fontWeight: 500, fontSize: 12 }}>对比项</th>
                      {compareModels.map(m => (
                        <th key={m.name} style={{ textAlign: 'center', padding: '12px 16px', color: '#c8ff00', fontWeight: 600 }}>
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{m.provider}</div>
                          {m.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#999' }}>输入价格</td>
                      {compareModels.map(m => (
                        <td key={m.name} style={{ textAlign: 'center', padding: '12px 16px', color: '#fff', fontFamily: 'monospace' }}>
                          {m.inputPrice != null ? `$${m.inputPrice.toFixed(2)}/1M` : '—'}
                        </td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#999' }}>输出价格</td>
                      {compareModels.map(m => (
                        <td key={m.name} style={{ textAlign: 'center', padding: '12px 16px', color: '#fff', fontFamily: 'monospace' }}>
                          {m.outputPrice != null ? `$${m.outputPrice.toFixed(2)}/1M` : '—'}
                        </td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#999' }}>端点类型</td>
                      {compareModels.map(m => (
                        <td key={m.name} style={{ textAlign: 'center', padding: '12px 16px', color: '#fff' }}>{m.endpoint}</td>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#999' }}>标签</td>
                      {compareModels.map(m => (
                        <td key={m.name} style={{ textAlign: 'center', padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {m.tags.map(t => (
                              <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(200,255,0,0.1)', color: '#c8ff00' }}>{t}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 16px', color: '#999' }}>操作</td>
                      {compareModels.map(m => (
                        <td key={m.name} style={{ textAlign: 'center', padding: '12px 16px' }}>
                          <Link to="/chat" style={{ fontSize: 12, color: '#c8ff00', textDecoration: 'none', fontWeight: 500 }}>开始对话 →</Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' }}>点击卡片右上角对比图标可添加/移除模型，最多对比4个</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
