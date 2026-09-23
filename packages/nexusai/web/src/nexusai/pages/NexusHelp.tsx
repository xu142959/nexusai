import { useState } from 'react'
import { SNPageHeader } from '../components/StoryNestUI';
import { motion } from 'motion/react'
import {
  HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle,
  Mail, BookOpen, Zap, KeyRound, CreditCard, Shield,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: '入门',
    question: '如何开始使用 NexusAI？',
    answer: '注册账号后，前往控制台创建 API Key，然后使用该 Key 调用我们的 API 接口。支持 OpenAI 兼容格式，可直接替换 base_url 为 https://api.nexusai.com/v1。',
  },
  {
    category: '入门',
    question: '支持哪些 AI 模型？',
    answer: '我们支持 500+ 主流 AI 模型，包括 GPT-4o、Claude 3 系列、Gemini、Llama 3、Mistral、DeepSeek、Qwen 等。访问模型列表页查看全部可用模型。',
  },
  {
    category: 'API',
    question: 'API 接口格式是什么？',
    answer: '我们完全兼容 OpenAI API 格式。使用 POST /v1/chat/completions 端点，在 Authorization header 中传入 Bearer sk-xxx 即可。支持流式输出（stream: true）。',
  },
  {
    category: 'API',
    question: '如何查看 API 用量？',
    answer: '登录后前往控制台 > 用量统计，可以查看按模型、按日期的详细用量统计和费用明细。',
  },
  {
    category: '计费',
    question: '如何计费？',
    answer: '采用按量计费模式，根据输入和输出 token 数计费。不同模型价格不同，具体请查看定价页。充值后余额永久有效，无最低消费。',
  },
  {
    category: '计费',
    question: '支持哪些支付方式？',
    answer: '支持支付宝、微信支付、Stripe 信用卡支付。最低充值 $1.00，充值后立即到账。',
  },
  {
    category: '安全',
    question: '我的数据安全吗？',
    answer: '我们采用企业级加密传输，不存储用户的对话内容。API Key 仅显示一次，请妥善保管。可以随时在控制台撤销或重新生成密钥。',
  },
  {
    category: '安全',
    question: '如何保护我的 API Key？',
    answer: '建议为不同环境创建不同的 Key（生产/测试），设置合理的额度限制，定期轮换密钥。不要在客户端代码中硬编码 Key。',
  },
]

const categories = ['全部', '入门', 'API', '计费', '安全']

const categoryIcons: Record<string, any> = {
  入门: BookOpen,
  API: Zap,
  计费: CreditCard,
  安全: Shield,
}

export function NexusHelp() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = faqs.filter(faq => {
    const matchCategory = activeCategory === '全部' || faq.category === activeCategory
    const matchSearch = !search ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      <div className="max-w-[1880px] mx-auto px-6 py-10">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#c8ff00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-[#c8ff00]" />
          </div>
          <SNPageHeader title="帮助中心" subtitle="常见问题解答和使用指南" />
          <p className="text-gray-400">查找常见问题解答，或联系我们的支持团队</p>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索问题..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#c8ff00]/50 text-sm"
          />
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#c8ff00] text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ 列表 */}
        <div className="space-y-3 mb-12">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search size={40} className="mx-auto text-gray-700 mb-3" />
              <p className="text-gray-500">没有找到相关问题</p>
            </div>
          ) : (
            filtered.map((faq, idx) => {
              const Icon = categoryIcons[faq.category] || HelpCircle
              const isOpen = openIndex === idx
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-[#c8ff00]" />
                    </div>
                    <span className="flex-1 font-medium text-white text-sm">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500" />
                    )}
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-5 pb-4 pl-16"
                    >
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {/* 联系支持 */}
        <div className="bg-gradient-to-br from-[#c8ff00]/10 to-transparent border border-[#c8ff00]/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">没有找到答案？</h2>
          <p className="text-gray-400 text-sm mb-6">联系我们的支持团队，我们会尽快回复</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:support@nexusai.com"
              className="flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-black font-semibold rounded-xl hover:bg-[#d4ff33] transition-colors text-sm"
            >
              <Mail size={16} /> 发送邮件
            </a>
            <Link
              to="/docs"
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors text-sm"
            >
              <BookOpen size={16} /> 查看文档
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
