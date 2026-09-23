import { motion } from 'motion/react'
import { SNPageHeader } from '../components/StoryNestUI';
import { Shield, Clock, Eye, Database, Lock, Globe } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: '1. 我们收集的信息',
    content: `我们收集以下类型的信息：

• 账户信息：注册时提供的邮箱、用户名、密码
• 支付信息：通过第三方支付处理商处理的交易信息，我们不存储完整的信用卡号
• 使用数据：API 调用记录、模型使用量、时间戳（用于计费和统计）
• 技术信息：IP 地址、浏览器类型、设备信息（用于安全和性能优化）

我们不会收集或存储您通过 API 发送的对话内容和提示词。`,
  },
  {
    icon: Database,
    title: '2. 信息的使用',
    content: `我们使用收集的信息用于：

• 提供和维护我们的服务
• 处理交易和发送账单
• 改进和优化我们的产品
• 检测和防止欺诈及滥用
• 发送服务通知和更新
• 响应您的支持请求

我们不会将您的个人数据出售给第三方。`,
  },
  {
    icon: Lock,
    title: '3. 数据安全',
    content: `我们采取以下措施保护您的数据安全：

• 所有数据传输采用 TLS 1.3 加密
• 敏感数据使用 AES-256 加密存储
• API Key 仅在创建时显示一次，之后不可逆
• 定期进行安全审计和渗透测试
• 严格的内部访问控制和审计日志

尽管我们采取了合理的安全措施，但没有任何互联网传输或电子存储方法是 100% 安全的。`,
  },
  {
    icon: Globe,
    title: '4. 数据共享与披露',
    content: `我们仅在以下情况下共享您的数据：

• 经您明确同意
• 为完成交易必需的支付处理商
• 遵守法律要求或政府请求
• 保护我们的权利、财产和安全
• 业务合并或收购时（会提前通知）

我们要求所有第三方遵守严格的数据保护标准。`,
  },
  {
    icon: Clock,
    title: '5. 数据保留',
    content: `我们按照以下期限保留您的数据：

• 账户信息：账户存续期间，注销后 30 天内删除
• 交易记录：法律要求的最低保留期限（通常 7 年）
• 使用统计：聚合数据永久保留，明细数据保留 90 天
• API 调用日志：保留 30 天用于调试和安全分析

您可以随时请求删除您的账户和相关数据。`,
  },
  {
    icon: Shield,
    title: '6. 您的权利',
    content: `您对您的个人数据享有以下权利：

• 访问权：随时查看您的个人信息
• 更正权：更新不准确的信息
• 删除权：请求删除您的账户和数据
• 可携带权：导出您的数据
• 限制处理权：限制某些数据处理活动
• 反对权：反对基于合法利益的数据处理

如需行使这些权利，请联系 privacy@nexusai.com。`,
  },
]

export function NexusPrivacy() {
  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      <div className="max-w-[1880px] mx-auto px-6 py-10">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#c8ff00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-[#c8ff00]" />
          </div>
          <SNPageHeader title="隐私政策" subtitle="我们如何保护您的数据和隐私" />
          <p className="text-gray-500 text-sm">最后更新：2026 年 9 月 1 日</p>
        </div>

        {/* 引言 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <p className="text-gray-400 text-sm leading-relaxed">
            NexusAI（以下简称"我们"）非常重视您的隐私。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本政策中描述的做法。
          </p>
        </div>

        {/* 各章节 */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#c8ff00]/10 rounded-lg flex items-center justify-center">
                    <Icon size={18} className="text-[#c8ff00]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                </div>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 联系我们 */}
        <div className="mt-10 bg-gradient-to-br from-[#c8ff00]/10 to-transparent border border-[#c8ff00]/20 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-white mb-2">有疑问？</h3>
          <p className="text-sm text-gray-400 mb-4">如有任何关于隐私政策的问题，请联系我们</p>
          <a
            href="mailto:privacy@nexusai.com"
            className="inline-flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d4ff33] transition-colors"
          >
            privacy@nexusai.com
          </a>
        </div>
      </div>
    </div>
  )
}
