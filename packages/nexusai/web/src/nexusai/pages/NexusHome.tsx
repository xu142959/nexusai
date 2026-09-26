import { copyToClipboard } from '@/lib/copy-to-clipboard'
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  ArrowRight, Zap, Shield, Globe, Cpu, Code2, Terminal,
  MessageSquare, Image, Mic, Brain, ChevronRight, Sparkles,
  Copy, Check,
} from 'lucide-react'
import { BRAND } from '../config/brand'
import { api } from '@/lib/api'

const features = [
  {
    icon: Zap,
    title: '极速响应',
    desc: '智能路由优化，确保跨提供商的最低延迟，让你的应用飞起来。',
  },
  {
    icon: Shield,
    title: '企业级安全',
    desc: '端到端加密、审计日志、细粒度权限控制，保护你的数据安全。',
  },
  {
    icon: Globe,
    title: '统一接入',
    desc: '一个 API 接口接入多家模型提供商，无需分别对接和维护。',
  },
  {
    icon: Cpu,
    title: '智能故障转移',
    desc: '提供商宕机时自动切换，保证你的应用永不中断。',
  },
]

const useCases = [
  { icon: MessageSquare, title: '智能对话', desc: '构建聊天机器人、AI 助手、客服系统', color: 'from-blue-500/20 to-transparent' },
  { icon: Image, title: '图像生成', desc: 'AI 绘画、图像编辑、设计辅助工具', color: 'from-purple-500/20 to-transparent' },
  { icon: Code2, title: '代码助手', desc: '代码补全、代码审查、自动化测试', color: 'from-green-500/20 to-transparent' },
  { icon: Brain, title: '数据分析', desc: '自然语言查询、报告生成、趋势分析', color: 'from-orange-500/20 to-transparent' },
  { icon: Mic, title: '语音处理', desc: '语音转文字、文字转语音、语音翻译', color: 'from-pink-500/20 to-transparent' },
  { icon: Sparkles, title: '内容创作', desc: '文章写作、营销文案、社交媒体内容', color: 'from-yellow-500/20 to-transparent' },
]

const codeExamples = [
  {
    lang: 'cURL',
    code: `curl ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-3-opus",
    "messages": [{"role": "user", "content": "你好！"}]
  }'`,
  },
  {
    lang: 'Python',
    code: `from openai import OpenAI

client = OpenAI(
    api_key="your-api-key",
    base_url="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/v1"
)

response = client.chat.completions.create(
    model="claude-3-opus",
    messages=[{"role": "user", "content": "你好！"}]
)
print(response.choices[0].message.content)`,
  },
  {
    lang: 'Node.js',
    code: `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: '${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/v1',
})

const response = await client.chat.completions.create({
  model: 'claude-3-opus',
  messages: [{ role: 'user', content: '你好！' }],
})
console.log(response.choices[0].message.content)`,
  },
]

export function NexusHome() {
  const [modelCount, setModelCount] = useState(0)
  const [providerCount, setProviderCount] = useState(0)
  const [hotModels, setHotModels] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // 从后端获取真实模型和定价数据
    api.get('/api/pricing').then((res) => {
      const data = res.data?.data || []
      setModelCount(data.length)
      // 提供商数量取自接口返回的 vendors 列表（真实渠道供应商）
      const vendors = res.data?.vendors || []
      setProviderCount(Array.isArray(vendors) ? vendors.length : 0)
      // 取前6个模型作为热门
      setHotModels(data.slice(0, 6).map((m: any) => m.id || m.model_name || m.name))
    }).catch(() => {
      // 公开接口，失败时保持0
    })
  }, [])

  const copyCode = () => {
    copyToClipboard(codeExamples[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#03080a]">
      {/* NexusAI Hero */}
      <section className="relative overflow-hidden py-28 px-6">
        {/* 背景光晕 - 全屏径向渐变 */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0.04) 40%, transparent 70%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#03080a]" />
        {/* 动态浮动光晕 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-glow hero-glow-3" />
        </div>

        {/* 动态网格背景 */}
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />

        {/* 扫描线效果 */}
        <div className="absolute inset-0 hero-scanline pointer-events-none" />

        <div className="max-w-[1880px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-8"
          >
            <Sparkles size={14} className="text-[#c8ff00]" />
            {modelCount > 0 ? `支持 ${modelCount} 个 AI 模型` : '统一 AI 模型 API 网关'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            一个 API，接入所有 AI 模型
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-[1880px] mx-auto"
          >
            更优价格，更稳可用，无需订阅。{modelCount > 0 ? `${modelCount} 个模型` : '多模型'}统一接入，OpenAI 兼容接口
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/sign-up"
              className="bg-[#c8ff00] text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-[#d4ff33] transition-colors flex items-center gap-2 text-base"
            >
              免费开始 <ArrowRight size={18} />
            </Link>
            <Link
              to="/chat"
              className="border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/5 transition-colors flex items-center gap-2 text-base"
            >
              <MessageSquare size={18} /> 在线体验
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-[1880px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${modelCount}`, label: '可用模型' },
            { value: `${providerCount}`, label: '提供商' },
            { value: 'v1.0', label: '当前版本' },
            { value: 'OpenAI', label: '兼容协议' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#c8ff00]">{s.value}</div>
              <div className="text-sm text-gray-500 mt-2">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">为什么选择 {BRAND.name}</h2>
            <p className="text-gray-400 max-w-[1880px] mx-auto">
              我们提供最全面的 AI 模型接入方案，让你专注于产品创新
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 hover:border-[#c8ff00]/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#c8ff00]/10 flex items-center justify-center mb-5 group-hover:bg-[#c8ff00]/20 transition-colors">
                  <f.icon size={28} className="text-[#c8ff00]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">应用场景</h2>
            <p className="text-gray-400 max-w-[1880px] mx-auto">
              无论你在构建什么，{BRAND.name} 都能帮你快速集成 AI 能力
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all overflow-hidden group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${uc.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <uc.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{uc.title}</h3>
                  <p className="text-gray-400 text-sm">{uc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Models */}
      {hotModels.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-[1880px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">热门模型</h2>
                <p className="text-gray-400">点击直接开始对话</p>
              </div>
              <Link
                to="/models"
                className="text-[#c8ff00] hover:underline flex items-center gap-1 text-sm font-medium"
              >
                查看全部 <ChevronRight size={16} />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {hotModels.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to="/chat"
                    search={{ model: name }}
                    className="block bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-[#c8ff00]/30 hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white group-hover:text-[#c8ff00] transition-colors truncate">
                        {name}
                      </span>
                      <ArrowRight size={14} className="text-gray-600 group-hover:text-[#c8ff00] transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Developer Quick Start */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#c8ff00]/10 text-[#c8ff00] rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Terminal size={14} /> 开发者友好
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">三行代码接入</h2>
            <p className="text-gray-400">OpenAI 兼容 API，无缝切换，零迁移成本</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a0f12] border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* 标签栏 */}
            <div className="flex items-center justify-between border-b border-white/10 px-4">
              <div className="flex gap-1">
                {codeExamples.map((ex, i) => (
                  <button
                    key={ex.lang}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === i
                        ? 'text-[#c8ff00] border-b-2 border-[#c8ff00]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {ex.lang}
                  </button>
                ))}
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            {/* 代码区 */}
            <pre className="p-6 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
              <code>{codeExamples[activeTab].code}</code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-[1880px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-[#c8ff00]/10 via-[#c8ff00]/5 to-transparent border border-[#c8ff00]/20 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8ff00]/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始了吗？</h2>
              <p className="text-gray-400 mb-8 text-lg">
                免费注册，立即获得 API Key，无需信用卡
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/sign-up"
                  className="bg-[#c8ff00] text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-[#d4ff33] transition-colors flex items-center gap-2 text-base"
                >
                  立即注册 <ArrowRight size={18} />
                </Link>
                <Link
                  to="/models"
                  className="border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/5 transition-colors text-base"
                >
                  浏览模型
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


