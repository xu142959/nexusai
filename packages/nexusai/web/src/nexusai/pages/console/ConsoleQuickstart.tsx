import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Copy, Check, Terminal, Code2, BookOpen, Zap, KeyRound, Globe, Cpu } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const codeExamples: Record<string, (key: string, baseUrl: string) => string> = {
  curl: (key, baseUrl) => `curl ${baseUrl}/v1/chat/completions \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "你好"}
    ],
    "stream": true
  }'`,
  python: (key, baseUrl) => `from openai import OpenAI

client = OpenAI(
    api_key="${key}",
    base_url="${baseUrl}/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`,
  javascript: (key, baseUrl) => `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: '${key}',
  baseURL: '${baseUrl}/v1',
})

const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '你好' }],
  stream: true,
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}`,
  go: (key, baseUrl) => `package main

import (
    "context"
    "fmt"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    config := openai.DefaultConfig("${key}")
    config.BaseURL = "${baseUrl}/v1"
    client := openai.NewClientWithConfig(config)

    ctx := context.Background()
    req := openai.ChatCompletionRequest{
        Model: "gpt-4o",
        Messages: []openai.ChatCompletionMessage{
            {Role: openai.ChatMessageRoleUser, Content: "你好"},
        },
        Stream: true,
    }

    stream, _ := client.CreateChatCompletionStream(ctx, req)
    defer stream.Close()
    for {
        resp, err := stream.Recv()
        if err != nil {
            break
        }
        fmt.Print(resp.Choices[0].Delta.Content)
    }
}`,
}

const tabs = [
  { id: 'curl', label: 'cURL', icon: Terminal },
  { id: 'python', label: 'Python', icon: Code2 },
  { id: 'javascript', label: 'Node.js', icon: Code2 },
  { id: 'go', label: 'Go', icon: Code2 },
]

export function ConsoleQuickstart() {
  const [apiKey, setApiKey] = useState('')
  const [keys, setKeys] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('curl')
  const [copied, setCopied] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
    const loadKeys = async () => {
      try {
        const res = await api.get('/api/user/token')
        const data = res.data?.data || []
        setKeys(data)
        if (data.length > 0) {
          setApiKey(data[0].key || data[0].token || 'sk-...')
        }
      } catch {
        setApiKey('sk-your-api-key')
      }
    }
    loadKeys()
  }, [])

  const copyCode = async () => {
    const code = codeExamples[activeTab](apiKey, baseUrl)
    await navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('代码已复制到剪贴板')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyKey = async () => {
    await navigator.clipboard.writeText(apiKey)
    toast.success('API Key 已复制')
  }

  const steps = [
    { num: 1, title: '获取 API Key', desc: '在控制台创建你的第一个 API 密钥，用于身份验证', icon: KeyRound },
    { num: 2, title: '选择模型', desc: '从模型广场查看可用模型和定价，选择适合的模型', icon: Cpu },
    { num: 3, title: '发送请求', desc: '使用 OpenAI 兼容接口发送你的第一个 API 请求', icon: Zap },
    { num: 4, title: '查看用量', desc: '在用量统计页面实时查看调用消耗和日志', icon: BookOpen },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">API 接入指南</h2>
        <p className="text-sm text-gray-500 mt-1">三步快速接入，使用你的 API Key 开始调用</p>
      </div>

      {/* 接入步骤 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:border-[#c8ff00]/20 transition-all"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#c8ff00] flex items-center justify-center text-black font-bold text-sm">
              {step.num}
            </div>
            <step.icon size={20} className="text-[#c8ff00] mb-3 mt-2" />
            <h3 className="font-semibold text-white text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* API Key 展示 */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <KeyRound size={16} className="text-[#c8ff00]" /> 你的 API Key
          </h3>
          {keys.length === 0 && (
            <a href="/console/keys" className="text-xs text-[#c8ff00 hover:underline">去创建 →</a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 truncate">
            {apiKey || 'sk-your-api-key'}
          </div>
          <button
            onClick={copyKey}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c8ff00] text-black rounded-lg text-sm font-medium hover:bg-[#b8ef00] transition-colors flex-shrink-0"
          >
            <Copy size={14} /> 复制
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Globe size={12} />
          <span>API Base URL: </span>
          <code className="text-gray-400 font-mono">{baseUrl}/v1</code>
        </div>
      </div>

      {/* 代码示例 */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#c8ff00]/10 text-[#c8ff00]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? '已复制' : '复制代码'}
          </button>
        </div>
        <div className="p-5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre">
            {codeExamples[activeTab](apiKey, baseUrl)}
          </pre>
        </div>
      </div>

      {/* 注意事项 */}
      <div className="mt-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
        <h3 className="font-semibold text-yellow-400 text-sm mb-3 flex items-center gap-2">
          <Zap size={14} /> 注意事项
        </h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            <span>API Key 是敏感信息，请勿在客户端代码中暴露，建议通过后端代理转发请求</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            <span>接口完全兼容 OpenAI 格式，可直接替换 base_url 和 api_key 使用现有 SDK</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            <span>支持流式响应（stream: true），通过 SSE 逐字返回结果</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            <span>如遇 429 限流错误，请降低请求频率或联系管理员提升额度</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
