import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { SNPageHeader } from '../components/StoryNestUI';
import {
  Target, Eye, Globe, Zap, Shield, Heart,
  Link, Mail,
} from 'lucide-react'
import { Link as RouterLink } from '@tanstack/react-router'
import { api } from '@/lib/api'

const values = [
  {
    icon: Zap,
    title: '极致性能',
    desc: '智能路由优化，低延迟高可用，让 AI 调用更快更稳定。',
  },
  {
    icon: Shield,
    title: '安全可靠',
    desc: '企业级加密传输，审计日志，保护您的隐私安全。',
  },
  {
    icon: Globe,
    title: '开放兼容',
    desc: '完全兼容 OpenAI API 格式，一行代码即可切换接入。',
  },
  {
    icon: Heart,
    title: '用户至上',
    desc: '透明定价，按量计费，无隐藏费用。',
  },
]

export function NexusAbout() {
  const [modelCount, setModelCount] = useState(0)
  const [providerCount, setProviderCount] = useState(0)
  const [version, setVersion] = useState('v1.0')

  useEffect(() => {
    api.get('/api/pricing').then((res) => {
      const data = res.data?.data || []
      setModelCount(data.length)
      const providers = new Set<string>()
      data.forEach((m: any) => { if (m.provider_name) providers.add(m.provider_name) })
      setProviderCount(providers.size)
    }).catch(() => {})
    api.get('/api/status').then((res) => {
      const v = res.data?.data?.version
      if (v) setVersion(v)
    }).catch(() => {})
  }, [])

  const stats = [
    { value: `${modelCount}`, label: '可用模型' },
    { value: `${providerCount}`, label: '提供商' },
    { value: version, label: '当前版本' },
    { value: 'OpenAI', label: '兼容协议' },
  ]
  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-[#c8ff00]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-[#c8ff00]">N</span>
          </div>
          <SNPageHeader title="关于 NexusAI" subtitle="统一的 AI 模型接口平台" />
          <p className="text-xl text-gray-400 max-w-[1880px] mx-auto">
            我们致力于打造最开放、最高效的 AI 模型聚合平台，让每个人都能轻松使用最先进的 AI 技术。
          </p>
        </motion.div>
      </section>

      {/* 统计数据 */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-[1880px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#c8ff00] mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 使命与愿景 */}
      <section className="py-16 px-6">
        <div className="max-w-[1880px] mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mb-4">
              <Target size={24} className="text-[#c8ff00]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">我们的使命</h2>
            <p className="text-gray-400 leading-relaxed">
              打破 AI 模型的使用壁垒，让开发者和企业能够以最低的成本、最简单的方式接入全球最优质的 AI 模型，加速 AI 技术的普及与创新。
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mb-4">
              <Eye size={24} className="text-[#c8ff00]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">我们的愿景</h2>
            <p className="text-gray-400 leading-relaxed">
              成为全球领先的 AI 模型聚合平台，连接每一个 AI 模型与每一位开发者，构建开放、公平、高效的 AI 生态系统。
            </p>
          </div>
        </div>
      </section>

      {/* 核心价值观 */}
      <section className="py-16 px-6 bg-white/[0.02]">
        <div className="max-w-[1880px] mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">核心价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-[#c8ff00]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-[1880px] mx-auto text-center bg-gradient-to-br from-[#c8ff00]/10 to-transparent border border-[#c8ff00]/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">加入我们</h2>
          <p className="text-gray-400 mb-6">无论您是开发者还是企业用户，NexusAI 都能为您提供最优质的 AI 服务</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <RouterLink
              to="/sign-up"
              className="bg-[#c8ff00] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#d4ff33] transition-colors"
            >
              免费注册
            </RouterLink>
            <RouterLink
              to="/docs"
              className="border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/5 transition-colors"
            >
              查看文档
            </RouterLink>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-10 px-6 border-t border-white/5">
        <div className="max-w-[1880px] mx-auto flex flex-wrap justify-center gap-6">
          <a href="mailto:hello@nexusai.com" className="flex items-center gap-2 text-gray-500 hover:text-[#c8ff00] transition-colors text-sm">
            <Mail size={16} /> hello@nexusai.com
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#c8ff00] transition-colors text-sm">
            <Globe size={16} /> 官网
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#c8ff00] transition-colors text-sm">
            <Link size={16} /> 博客
          </a>
        </div>
      </section>
    </div>
  )
}
