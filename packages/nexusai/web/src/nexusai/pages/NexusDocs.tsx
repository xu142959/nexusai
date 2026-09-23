import { useState } from 'react'
import { SNPageHeader } from '../components/StoryNestUI';
import { motion } from 'motion/react'
import {
  BookOpen, Code2, Terminal, KeyRound, MessageSquare,
  Copy, Check, ChevronRight, AlertCircle, Zap, Shield,
} from 'lucide-react'

const codeExamples = {
  curl: `curl https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "你是一个有用的助手"},
      {"role": "user", "content": "你好！"}
    ],
    "stream": true
  }'`,
  python: `from openai import OpenAI

client = OpenAI(
    api_key="your-api-key",
    base_url="https://api.nexusai.com/v1"
)

# 流式对话
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好！"}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
  nodejs: `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.nexusai.com/v1',
})

// 流式对话
const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '你好！' }],
  stream: true,
})
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}`,
  go: `package main

import (
    "context"
    "fmt"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    client := openai.NewClientWithConfig(openai.DefaultConfig("your-api-key"))
    client.BaseURL = "https://api.nexusai.com/v1"

    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: "gpt-4o",
            Messages: []openai.ChatCompletionMessage{
                {Role: openai.ChatMessageRoleUser, Content: "你好！"},
            },
        },
    )
    if err != nil {
        panic(err)
    }
    fmt.Println(resp.Choices[0].Message.Content)
}`,
}

const endpoints = [
  { method: 'POST', path: '/v1/chat/completions', desc: '聊天补全（支持流式）' },
  { method: 'POST', path: '/v1/completions', desc: '文本补全' },
  { method: 'POST', path: '/v1/embeddings', desc: '文本嵌入' },
  { method: 'POST', path: '/v1/images/generations', desc: '图像生成' },
  { method: 'POST', path: '/v1/audio/transcriptions', desc: '语音转文字' },
  { method: 'GET', path: '/v1/models', desc: '获取可用模型列表' },
]

const errorCodes = [
  { code: '401', desc: 'API Key 无效或已过期', solution: '检查 API Key 是否正确，或在控制台创建新的 Key' },
  { code: '404', desc: '模型不存在或不可用', solution: '检查模型名称是否正确，或在模型列表中查看可用模型' },
  { code: '429', desc: '请求频率超限', solution: '降低请求频率，或升级套餐提高限流阈值' },
  { code: '500', desc: '服务器内部错误', solution: '稍后重试，如持续出现请联系技术支持' },
  { code: '503', desc: '服务暂不可用', solution: '提供商可能暂时不可用，系统会自动故障转移' },
]

export function NexusDocs() {
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>('curl')
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('quickstart')

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sections = [
    { id: 'quickstart', label: '快速开始', icon: Zap },
    { id: 'authentication', label: '认证', icon: KeyRound },
    { id: 'endpoints', label: 'API 端点', icon: Terminal },
    { id: 'errors', label: '错误码', icon: AlertCircle },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#03080a]">
      <div className="max-w-[1880px] mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="mb-8 sn-animate-fade-up">
          <div className="flex items-center gap-2 text-[#c8ff00] text-sm font-medium mb-2">
            <BookOpen size={16} /> 开发者文档
          </div>
          <SNPageHeader title="API 文档" subtitle="快速接入 NexusAI 的完整开发指南" />
          <p className="text-gray-400">OpenAI 兼容 API，三行代码接入 500+ 模型</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边导航 */}
          <aside className="md:w-48 flex-shrink-0">
            <nav className="space-y-1 sticky top-20">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === s.id
                      ? 'bg-[#c8ff00]/10 text-[#c8ff00]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <s.icon size={14} /> {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* 主内容 */}
          <div className="flex-1 min-w-0">
            {/* 快速开始 */}
            {activeSection === 'quickstart' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">1. 获取 API Key</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    注册账号后，在控制台的「API 密钥」页面创建你的 API Key。
                  </p>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-sm">
                    <code className="text-[#c8ff00]">sk-xxxxxxxxxxxxxxxxxxxxxxxx</code>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4">2. 发送请求</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    使用 OpenAI 兼容的 API 格式，将 base_url 指向我们的服务。
                  </p>

                  {/* 代码标签 */}
                  <div className="bg-[#0a0f12] border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 px-4">
                      <div className="flex gap-1">
                        {Object.keys(codeExamples).map(lang => (
                          <button
                            key={lang}
                            onClick={() => setActiveTab(lang as keyof typeof codeExamples)}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${
                              activeTab === lang
                                ? 'text-[#c8ff00] border-b-2 border-[#c8ff00]'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {lang === 'curl' ? 'cURL' : lang === 'nodejs' ? 'Node.js' : lang === 'go' ? 'Go' : 'Python'}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={copyCode}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                      >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? '已复制' : '复制'}
                      </button>
                    </div>
                    <pre className="p-6 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
                      <code>{codeExamples[activeTab]}</code>
                    </pre>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4">3. 查看响应</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    API 返回标准的 OpenAI 兼容格式：
                  </p>
                  <pre className="bg-[#0a0f12] border border-white/10 rounded-xl p-6 text-sm text-gray-300 overflow-x-auto font-mono">
{`{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "gpt-4o",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "你好！有什么我可以帮你的吗？"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}`}
                  </pre>
                </section>
              </motion.div>
            )}

            {/* 认证 */}
            {activeSection === 'authentication' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white">认证方式</h2>
                <p className="text-gray-400 text-sm">
                  所有 API 请求都需要在 Header 中携带 API Key：
                </p>
                <pre className="bg-[#0a0f12] border border-white/10 rounded-xl p-4 text-sm font-mono">
                  <code className="text-gray-300">Authorization: Bearer sk-xxxxxxxxxxxx</code>
                </pre>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-200">
                      <strong>安全提示：</strong>请勿在客户端代码中暴露 API Key，建议通过后端代理转发请求。
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-[#c8ff00]" /> 安全最佳实践
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-[#c8ff00] mt-0.5 flex-shrink-0" />
                      为不同环境创建独立的 API Key
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-[#c8ff00] mt-0.5 flex-shrink-0" />
                      设置 API Key 的额度上限，防止意外超额
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-[#c8ff00] mt-0.5 flex-shrink-0" />
                      定期轮换 API Key
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-[#c8ff00] mt-0.5 flex-shrink-0" />
                      不要将 API Key 提交到代码仓库
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* API 端点 */}
            {activeSection === 'endpoints' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white">API 端点</h2>
                <p className="text-gray-400 text-sm">
                  Base URL: <code className="text-[#c8ff00]">https://api.nexusai.com/v1</code>
                </p>

                <div className="space-y-2">
                  {endpoints.map(ep => (
                    <div
                      key={ep.path}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center gap-4"
                    >
                      <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                        ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="text-sm text-white flex-1">{ep.path}</code>
                      <span className="text-xs text-gray-500">{ep.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#c8ff00]" /> 流式响应
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    设置 <code className="text-[#c8ff00]">"stream": true</code> 即可启用 SSE 流式响应，实时获取模型输出。
                  </p>
                  <pre className="bg-[#0a0f12] rounded-lg p-4 text-xs font-mono text-gray-400">
{`data: {"choices":[{"delta":{"content":"你"}}]}

data: {"choices":[{"delta":{"content":"好"}}]}

data: [DONE]`}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* 错误码 */}
            {activeSection === 'errors' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white">错误码</h2>
                <div className="space-y-3">
                  {errorCodes.map(err => (
                    <div
                      key={err.code}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">
                          {err.code}
                        </span>
                        <span className="font-medium text-white">{err.desc}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">解决方案：</strong>{err.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
