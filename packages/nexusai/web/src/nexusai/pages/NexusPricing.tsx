import { useState, useEffect, useMemo } from 'react'
import { SNPageHeader, SNLoading, SNEmptyState } from '../components/StoryNestUI';
import { Link, useRouter } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Check, ArrowRight, Zap, Shield, Clock, HelpCircle,
  ChevronDown, ChevronUp, CreditCard, Coins, Calculator,
  Search, TrendingUp, Cpu,
} from 'lucide-react'
import { BRAND } from '../config/brand'
import { getCommonHeaders, api } from '@/lib/api'

interface ModelPricing {
  model_name: string
  model_ratio: number
  model_price: number
  completion_ratio: number
  enable_groups: string[]
  supported_endpoint_types: string[]
  billing_mode: string
}

const faqs = [
  {
    q: '如何计费？',
    a: '采用按量计费模式，按实际消耗的 Token 数量收费。不同模型有不同的输入/输出单价，精确到千 Token。充值后即可使用，无最低消费。',
  },
  {
    q: '有没有免费额度？',
    a: '新用户注册后可获得免费体验额度。此外，部分提供商的免费模型可以零成本使用。具体以管理端配置为准。',
  },
  {
    q: '支持哪些支付方式？',
    a: '支持支付宝、微信支付、Stripe（信用卡）、加密货币等多种支付方式。企业客户可联系销售开通对公转账和月结。',
  },
  {
    q: '可以退款吗？',
    a: '未使用的余额可以申请退款，退款将原路返回。已消耗的 Token 费用不支持退款。',
  },
  {
    q: '如何查看用量？',
    a: '登录后进入控制台，在「使用日志」中可以查看详细的调用记录、Token 消耗和费用明细，支持按时间范围和模型筛选。',
  },
  {
    q: '企业客户有什么优惠？',
    a: '月消费超过一定额度的企业客户可享受阶梯折扣，还可获得专属技术支持、SLA 保障和定制化服务。请联系销售了解详情。',
  },
]

const features = [
  { icon: Zap, title: '按量计费', desc: '只用付实际消耗的费用，无最低消费，无隐藏费用' },
  { icon: Shield, title: '资金安全', desc: '余额实时可查，消费明细透明，支持设置消费上限' },
  { icon: Clock, title: '实时扣费', desc: '每次调用实时扣费，余额不足及时提醒，避免超额' },
  { icon: Coins, title: '充值灵活', desc: '支持多种支付方式，最低 10 元起充，即时到账' },
]

export function NexusPricing() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [pricingLoading, setPricingLoading] = useState(true)
  const [pricingError, setPricingError] = useState<string | null>(null)
  const [modelPricingList, setModelPricingList] = useState<ModelPricing[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  useEffect(() => {
    setIsAuthed(!!getCommonHeaders())
  }, [])

  // 从 New API 获取真实定价数据
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setPricingLoading(true)
        setPricingError(null)
        const res = await api.get('/api/pricing')
        const data = res.data?.data || res.data || []
        setModelPricingList(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error('获取定价数据失败:', err)
        setPricingError(err?.message || '获取定价数据失败')
      } finally {
        setPricingLoading(false)
      }
    }
    fetchPricing()
  }, [])

  // 过滤和排序模型定价
  const filteredPricing = useMemo(() => {
    let list = [...modelPricingList]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(m => m.model_name.toLowerCase().includes(q))
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.model_name.localeCompare(b.model_name))
    } else if (sortBy === 'price') {
      list.sort((a, b) => a.model_ratio - b.model_ratio)
    }
    return list
  }, [modelPricingList, searchQuery, sortBy])

  // 计算价格统计
  const priceStats = useMemo(() => {
    if (modelPricingList.length === 0) return { min: 0, max: 0, avg: 0, count: 0 }
    const ratios = modelPricingList.map(m => m.model_ratio).filter(r => r > 0)
    return {
      min: ratios.length > 0 ? Math.min(...ratios) : 0,
      max: ratios.length > 0 ? Math.max(...ratios) : 0,
      avg: ratios.length > 0 ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 0,
      count: modelPricingList.length,
    }
  }, [modelPricingList])

  const handleRecharge = () => {
    if (isAuthed) {
      router.navigate({ to: '/console/billing' })
    } else {
      router.navigate({ to: '/sign-in' })
    }
  }
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [tokenUsage, setTokenUsage] = useState(50000000)
  const [modelType, setModelType] = useState('text')
  const modelPrices: Record<string, number> = { text: 0.002, image: 0.02, code: 0.005 }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#03080a]">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c8ff00]/10 rounded-full blur-[100px]" />
        <div className="max-w-[1880px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#c8ff00]/10 text-[#c8ff00] rounded-full px-4 py-1.5 text-sm font-medium mb-6"
          >
            <CreditCard size={14} /> 按量计费，透明定价
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            简单透明的定价
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            按实际消耗的 Token 付费，用多少付多少，无订阅费
          </motion.p>
        </div>
      </section>

      {/* 计费特点 */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-[1880px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#c8ff00]/10 flex items-center justify-center mx-auto mb-3">
                <f.icon size={24} className="text-[#c8ff00]" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 充值方案 */}
      <section className="py-20 px-6">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">充值方案</h2>
            <p className="text-gray-400">选择适合你的充值金额，余额永久有效</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { amount: '¥50', bonus: '', desc: '适合个人体验', highlight: false },
              { amount: '¥200', bonus: '送 ¥20', desc: '适合日常使用', highlight: true },
              { amount: '¥1000', bonus: '送 ¥150', desc: '适合开发者/团队', highlight: false },
            ].map((plan, i) => (
              <motion.div
                key={plan.amount}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlight
                    ? 'bg-[#c8ff00]/10 border-2 border-[#c8ff00]'
                    : 'bg-white/[0.03] border border-white/5'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8ff00] text-black text-xs font-bold px-3 py-1 rounded-full">
                    最受欢迎
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-1">{plan.amount}</div>
                  {plan.bonus && (
                    <div className="text-[#c8ff00] text-sm font-medium">{plan.bonus}</div>
                  )}
                  <div className="text-gray-500 text-sm mt-2">{plan.desc}</div>
                </div>
                <Link
                  to="/sign-in"
                  className={`w-full block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-[#c8ff00] text-black hover:bg-[#d4ff33]'
                      : 'border border-white/20 hover:bg-white/5'
                  }`}
                >
                  立即充值
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            支持支付宝、微信支付、信用卡等多种支付方式 · 充值即时到账
          </p>
        </div>
      </section>

      {/* 模型定价 - 真实API数据 */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">模型定价</h2>
            <p className="text-gray-400 mb-8">
              实时同步管理端配置，查看所有可用模型的价格
            </p>
          </motion.div>

          {/* 价格统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-gray-500 text-sm mb-1">可用模型</div>
              <div className="text-2xl font-bold text-[#c8ff00]">
                {pricingLoading ? '...' : priceStats.count}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-gray-500 text-sm mb-1">最低倍率</div>
              <div className="text-2xl font-bold">
                {pricingLoading ? '...' : priceStats.min.toFixed(1) + 'x'}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-gray-500 text-sm mb-1">最高倍率</div>
              <div className="text-2xl font-bold">
                {pricingLoading ? '...' : priceStats.max.toFixed(1) + 'x'}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-gray-500 text-sm mb-1">平均倍率</div>
              <div className="text-2xl font-bold">
                {pricingLoading ? '...' : priceStats.avg.toFixed(1) + 'x'}
              </div>
            </div>
          </div>

          {/* 搜索和排序 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="搜索模型名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#c8ff00]/50 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('name')}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  sortBy === 'name' ? 'bg-[#c8ff00] text-black' : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.08]'
                }`}
              >
                按名称
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  sortBy === 'price' ? 'bg-[#c8ff00] text-black' : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.08]'
                }`}
              >
                按价格
              </button>
            </div>
          </div>

          {/* 模型定价表格 */}
          {pricingLoading ? (
            <div className="py-20 flex justify-center">
              <SNLoading text="加载定价数据..." />
            </div>
          ) : pricingError ? (
            <div className="py-20">
              <SNEmptyState
                icon={<TrendingUp size={48} />}
                title="加载失败"
                description={pricingError}
              />
            </div>
          ) : filteredPricing.length === 0 ? (
            <div className="py-20">
              <SNEmptyState
                icon={<Cpu size={48} />}
                title="暂无模型"
                description="管理端尚未配置模型定价"
              />
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      <th className="px-6 py-4 font-medium text-gray-400">模型名称</th>
                      <th className="px-6 py-4 font-medium text-gray-400">输入倍率</th>
                      <th className="px-6 py-4 font-medium text-gray-400">输出倍率</th>
                      <th className="px-6 py-4 font-medium text-gray-400">计费模式</th>
                      <th className="px-6 py-4 font-medium text-gray-400">端点类型</th>
                      <th className="px-6 py-4 font-medium text-gray-400">分组</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPricing.slice(0, 50).map((model, i) => (
                      <motion.tr
                        key={model.model_name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.02, 0.5) }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{model.model_name}</td>
                        <td className="px-6 py-4">
                          <span className="text-[#c8ff00] font-mono">{model.model_ratio}x</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-blue-400 font-mono">{model.completion_ratio}x</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{model.billing_mode || 'default'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {model.supported_endpoint_types?.map(ep => (
                              <span key={ep} className="text-xs bg-white/5 px-2 py-0.5 rounded">{ep}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {model.enable_groups?.map(g => (
                              <span key={g} className="text-xs bg-[#c8ff00]/10 text-[#c8ff00] px-2 py-0.5 rounded">{g}</span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPricing.length > 50 && (
                <div className="px-6 py-4 text-center text-gray-500 text-sm">
                  显示前 50 个模型，共 {filteredPricing.length} 个 · 前往模型广场查看全部
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 用量计算器 */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-[1880px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#c8ff00]/10 border border-[#c8ff00]/20 rounded-full px-4 py-1.5 mb-4">
              <Calculator size={14} className="text-[#c8ff00]" />
              <span className="text-xs font-medium text-[#c8ff00]">用量计算器</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">预估你的使用成本</h2>
            <p className="text-gray-400">拖动滑块，实时查看预估费用</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">模型类型</label>
              <div className="flex gap-2">
                {[{ id: "text", label: "文本模型" }, { id: "image", label: "图像模型" }, { id: "code", label: "代码模型" }].map((type) => (
                  <button key={type.id} onClick={() => setModelType(type.id)} className={"flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all " + (modelType === type.id ? "bg-[#c8ff00] text-black" : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.08]")}>{type.label}</button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-300">月 Token 用量</label>
                <span className="text-lg font-bold text-[#c8ff00]">{(tokenUsage / 1000000).toFixed(1)}M</span>
              </div>
              <input type="range" min="1000000" max="500000000" step="1000000" value={tokenUsage} onChange={(e) => setTokenUsage(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#c8ff00]" />
              <div className="flex justify-between text-xs text-gray-500 mt-2"><span>1M</span><span>250M</span><span>500M</span></div>
            </div>
            <div className="bg-black/30 rounded-xl p-5 border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">预估月费用</span>
                <span className="text-3xl font-bold text-[#c8ff00]">¥{(tokenUsage / 1000000 * modelPrices[modelType] * 7.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500"><span>输入 + 输出混合单价</span><span>¥{(modelPrices[modelType] * 7.2).toFixed(4)}/千Token</span></div>
            </div>
            <div className="mt-6 flex items-center gap-3 p-4 bg-[#c8ff00]/5 border border-[#c8ff00]/20 rounded-xl">
              <Zap size={20} className="text-[#c8ff00] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">推荐充值方案</p>
                <p className="text-xs text-gray-400">{tokenUsage / 1000000 * modelPrices[modelType] * 7.2 < 50 ? "¥50 体验版" : tokenUsage / 1000000 * modelPrices[modelType] * 7.2 < 200 ? "¥200 标准版（送¥20）" : "¥1000 专业版（送¥150）"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">常见问题</h2>
            <p className="text-gray-400">关于计费和充值的常见疑问</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#c8ff00]/20 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="font-medium flex items-center gap-2">
                    <HelpCircle size={16} className="text-[#c8ff00]" />
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-[1880px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-gray-400 mb-8">注册即送免费体验额度，无需信用卡</p>
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 bg-[#c8ff00] text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-[#d4ff33] transition-colors"
          >
            免费注册 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
