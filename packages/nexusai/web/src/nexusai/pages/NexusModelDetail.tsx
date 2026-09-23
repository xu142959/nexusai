import { useState, useEffect } from 'react'
import { Link, useParams, useRouter } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  ArrowLeft, Zap, Clock, Cpu, MessageSquare, Copy, Check,
  Sparkles, Code2, Terminal, Globe, Shield,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Markdown } from '../components/Markdown'

const codeExamples = [
  {
    lang: 'cURL',
    code: (model: string) => `curl https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": "你好！"}]
  }'`,
  },
  {
    lang: 'Python',
    code: (model: string) => `from openai import OpenAI

client = OpenAI(
    api_key="your-api-key",
    base_url="https://api.nexusai.com/v1"
)

response = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "你好！"}]
)
print(response.choices[0].message.content)`,
  },
  {
    lang: 'Node.js',
    code: (model: string) => `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.nexusai.com/v1',
})

const response = await client.chat.completions.create({
  model: '${model}',
  messages: [{ role: 'user', content: '你好！' }],
})
console.log(response.choices[0].message.content)`,
  },
]

const capabilityLabels: Record<string, string> = {
  chat: '对话',
  completion: '补全',
  embedding: '嵌入',
  'function-call': '函数调用',
  vision: '视觉',
  streaming: '流式',
  'search': '联网搜索',
  'image': '图像生成',
  'audio': '语音',
}

export function NexusModelDetail() {
  const params = useParams({ strict: false }) as { provider?: string; model?: string }
  const router = useRouter()
  const modelName = params.model ? `${params.provider}/${params.model}` : params.provider || ''
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modelInfo, setModelInfo] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // 尝试从 API 获取模型信息
        const res = await api.get('/api/user/models')
        const models = (res.data?.data || []) as string[]
        const found = models.find(m => m === modelName || m.endsWith(modelName))
        if (found) {
          setModelInfo({ name: found, id: found })
        } else {
          setModelInfo({ name: modelName, id: modelName })
        }
      } catch {
        setModelInfo({ name: modelName, id: modelName })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [modelName])

  const provider = modelName.split('/')[0] || 'unknown'
  const capabilities = ['chat', 'streaming', 'function-call']

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code(modelName))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03080a] flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      {/* 顶部导航 */}
      <div className="border-b border-white/5">
        <div className="max-w-[1880px] mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            返回模型列表
          </button>
        </div>
      </div>

      <div className="max-w-[1880px] mx-auto px-6 py-10">
        {/* 模型头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#c8ff00]/10 flex items-center justify-center">
                <Cpu size={32} className="text-[#c8ff00]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{modelName}</h1>
                <p className="text-gray-400">提供商：{provider}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {capabilities.map(cap => (
                    <span
                      key={cap}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                    >
                      {capabilityLabels[cap] || cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link
              to="/chat"
              search={{ model: modelName }}
              className="flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-black font-semibold rounded-xl hover:bg-[#d4ff33] transition-colors"
            >
              <MessageSquare size={18} />
              开始对话
            </Link>
          </div>
        </motion.div>

        {/* 模型特性 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Zap, title: '高速响应', desc: '优化的推理路径，低延迟输出' },
            { icon: Shield, title: '安全可靠', desc: '企业级安全，数据加密传输' },
            { icon: Globe, title: '全球可用', desc: '多区域部署，高可用性保障' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5"
            >
              <feature.icon size={24} className="text-[#c8ff00] mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 代码示例 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden mb-10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-[#c8ff00]" />
              <span className="font-semibold text-white">API 调用示例</span>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check size={16} className="text-[#c8ff00]" /> : <Copy size={16} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <div className="flex border-b border-white/5">
            {codeExamples.map((example, i) => (
              <button
                key={example.lang}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === i
                    ? 'text-[#c8ff00] border-b-2 border-[#c8ff00]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {example.lang}
              </button>
            ))}
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
              <code>{codeExamples[activeTab].code(modelName)}</code>
            </pre>
          </div>
        </div>

        {/* 模型说明 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-[#c8ff00]" />
            模型说明
          </h2>
          <Markdown
            content={`## ${modelName}

这是由 **${provider}** 提供的 AI 模型。

### 主要特性

- 支持自然语言对话和内容生成
- 支持流式输出，实时获取响应
- 支持函数调用，可扩展工具使用
- 上下文窗口大，适合长文本处理

### 适用场景

- 智能客服和对话机器人
- 内容创作和文案生成
- 代码辅助和技术问答
- 数据分析和报告生成

### 使用建议

1. 通过 \`/v1/chat/completions\` 端点调用
2. 使用流式输出获得更好的用户体验
3. 合理设置 \`temperature\` 和 \`max_tokens\` 参数
4. 建议设置系统提示词以规范模型行为

> 提示：点击右上角「开始对话」按钮可立即体验该模型。`}
          />
        </div>
      </div>
    </div>
  )
}
