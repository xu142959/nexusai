import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Copy, Check, Terminal, Key, Zap, BookOpen, ArrowRight, Code2 } from 'lucide-react'
import { NexusLayout } from '../components/NexusLayout'
import { BRAND } from '../config/brand'

const steps = [
  {
    id: 1,
    title: '注册账号',
    desc: '创建您的 NexusAI 账号，完成邮箱验证',
    icon: Key,
  },
  {
    id: 2,
    title: '获取 API Key',
    desc: '在控制台创建 API 密钥，妥善保管',
    icon: Terminal,
  },
  {
    id: 3,
    title: '发送第一个请求',
    desc: '使用 cURL 或 SDK 调用聊天补全接口',
    icon: Zap,
  },
  {
    id: 4,
    title: '探索更多模型',
    desc: '浏览模型广场，选择最适合的 AI 模型',
    icon: BookOpen,
  },
]

export function NexusQuickstart() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const codeExamples = useMemo(() => [
    {
      lang: 'cURL',
      code: `curl ${baseUrl}/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "你好！"}]
  }'`,
    },
    {
      lang: 'Python',
      code: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${baseUrl}/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好！"}]
)
print(response.choices[0].message.content)`,
    },
    {
      lang: 'Node.js',
      code: `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: '${baseUrl}/v1',
})

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '你好！' }],
})
console.log(response.choices[0].message.content)`,
    },
  ], [baseUrl])

  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <NexusLayout>
      <div className="quickstart-page">
        {/* Hero */}
        <motion.div
          className="quickstart-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="quickstart-hero-badge">
            <Zap size={16} /> 5 分钟快速上手
          </div>
          <h1 className="quickstart-hero-title">快速开始</h1>
          <p className="quickstart-hero-subtitle">
            只需四步，即可开始使用 {BRAND.shortName} 的 AI 模型服务
          </p>
        </motion.div>

        {/* 步骤 */}
        <div className="quickstart-steps">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              className="quickstart-step-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="quickstart-step-number">{step.id}</div>
              <step.icon size={24} className="quickstart-step-icon" />
              <h3 className="quickstart-step-title">{step.title}</h3>
              <p className="quickstart-step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* API 调用示例 */}
        <motion.div
          className="quickstart-code-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="quickstart-section-header">
            <Code2 size={20} />
            <h2>第一个 API 调用</h2>
          </div>
          <div className="quickstart-code-tabs">
            {codeExamples.map((ex, i) => (
              <button
                key={ex.lang}
                className={`quickstart-code-tab ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {ex.lang}
              </button>
            ))}
            <button className="quickstart-copy-btn" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <pre className="quickstart-code-block">
            <code>{codeExamples[activeTab].code}</code>
          </pre>
        </motion.div>

        {/* 下一步 */}
        <motion.div
          className="quickstart-next-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2>下一步</h2>
          <div className="quickstart-next-cards">
            <Link to="/console/keys" className="quickstart-next-card">
              <Key size={20} />
              <div>
                <h3>创建 API Key</h3>
                <p>前往控制台生成您的第一个密钥</p>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/models" className="quickstart-next-card">
              <BookOpen size={20} />
              <div>
                <h3>浏览模型</h3>
                <p>探索 500+ AI 模型，找到最适合的</p>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/docs" className="quickstart-next-card">
              <Code2 size={20} />
              <div>
                <h3>阅读文档</h3>
                <p>查看完整的 API 参考和最佳实践</p>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .quickstart-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .quickstart-hero {
          text-align: center;
          margin-bottom: 64px;
        }
        .quickstart-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(200, 255, 0, 0.1);
          border: 1px solid rgba(200, 255, 0, 0.3);
          border-radius: 999px;
          color: #c8ff00;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .quickstart-hero-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 700;
          color: #fcfcfe;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .quickstart-hero-subtitle {
          font-size: 18px;
          color: rgba(252, 252, 254, 0.6);
          margin: 0;
        }
        .quickstart-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 64px;
        }
        @media (max-width: 900px) {
          .quickstart-steps { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .quickstart-steps { grid-template-columns: 1fr; }
        }
        .quickstart-step-card {
          position: relative;
          padding: 32px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .quickstart-step-card:hover {
          border-color: rgba(200, 255, 0, 0.3);
          transform: translateY(-4px);
        }
        .quickstart-step-number {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 48px;
          font-weight: 800;
          color: rgba(200, 255, 0, 0.1);
          line-height: 1;
        }
        .quickstart-step-icon {
          color: #c8ff00;
          margin-bottom: 16px;
        }
        .quickstart-step-title {
          font-size: 18px;
          font-weight: 600;
          color: #fcfcfe;
          margin: 0 0 8px;
        }
        .quickstart-step-desc {
          font-size: 14px;
          color: rgba(252, 252, 254, 0.5);
          margin: 0;
          line-height: 1.6;
        }
        .quickstart-code-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 64px;
        }
        .quickstart-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .quickstart-section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #fcfcfe;
          margin: 0;
        }
        .quickstart-code-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0;
        }
        .quickstart-code-tab {
          padding: 10px 20px;
          background: transparent;
          border: none;
          color: rgba(252, 252, 254, 0.5);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.2s;
        }
        .quickstart-code-tab.active {
          color: #c8ff00;
          border-bottom-color: #c8ff00;
        }
        .quickstart-copy-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(200, 255, 0, 0.1);
          border: 1px solid rgba(200, 255, 0, 0.2);
          border-radius: 8px;
          color: #c8ff00;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quickstart-copy-btn:hover {
          background: rgba(200, 255, 0, 0.2);
        }
        .quickstart-code-block {
          background: #0a0e12;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 24px;
          overflow-x: auto;
          margin: 0;
        }
        .quickstart-code-block code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.7;
          color: rgba(252, 252, 254, 0.85);
          white-space: pre;
        }
        .quickstart-next-section h2 {
          font-size: 24px;
          font-weight: 600;
          color: #fcfcfe;
          margin: 0 0 24px;
        }
        .quickstart-next-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .quickstart-next-cards { grid-template-columns: 1fr; }
        }
        .quickstart-next-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
        }
        .quickstart-next-card:hover {
          border-color: rgba(200, 255, 0, 0.3);
          transform: translateX(4px);
        }
        .quickstart-next-card svg:first-child {
          color: #c8ff00;
          flex-shrink: 0;
        }
        .quickstart-next-card div {
          flex: 1;
        }
        .quickstart-next-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fcfcfe;
          margin: 0 0 4px;
        }
        .quickstart-next-card p {
          font-size: 13px;
          color: rgba(252, 252, 254, 0.5);
          margin: 0;
        }
        .quickstart-next-card svg:last-child {
          color: rgba(252, 252, 254, 0.3);
          transition: transform 0.2s;
        }
        .quickstart-next-card:hover svg:last-child {
          transform: translateX(4px);
          color: #c8ff00;
        }
      `}</style>
    </NexusLayout>
  )
}
