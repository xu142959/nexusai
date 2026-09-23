import { motion } from 'motion/react'
import { SNPageHeader } from '../components/StoryNestUI';
import {
  FileText, User, CreditCard, AlertTriangle, Ban,
  Scale, RefreshCw, Headphones,
} from 'lucide-react'

const sections = [
  {
    icon: User,
    title: '1. 账户与注册',
    content: `1.1 您必须年满 18 周岁或具有完全民事行为能力才能注册使用本服务。

1.2 注册时需提供真实、准确、完整的信息，并及时更新。

1.3 您负责保管账户密码和 API Key 的安全，因您保管不善造成的损失由您自行承担。

1.4 每个用户仅限注册一个账户，禁止多账户套利或滥用免费额度。

1.5 我们有权对涉嫌欺诈、滥用或违反本条款的账户进行暂停或终止。`,
  },
  {
    icon: CreditCard,
    title: '2. 服务与计费',
    content: `2.1 我们提供 AI 模型 API 调用服务，采用按量计费模式。

2.2 具体价格以定价页公示为准，我们保留调整价格的权利，调整前会提前通知。

2.3 充值金额最低 $1.00，余额永久有效，不支持退款（法律另有规定除外）。

2.4 我们会在账户余额不足时发送提醒，但不因未收到提醒而免除您的付款义务。

2.5 所有费用以美元计价，实际支付金额以支付时汇率为准。`,
  },
  {
    icon: AlertTriangle,
    title: '3. 可接受使用政策',
    content: `您同意不将本服务用于以下用途：

3.1 违反任何适用法律法规的活动
3.2 生成或传播违法、有害、欺诈性内容
3.3 侵犯他人知识产权或隐私权
3.4 未经授权访问或干扰系统安全
3.5 大规模爬虫、压力测试或恶意攻击
3.6 生成深度伪造内容用于欺诈或诽谤
3.7 用于医疗、法律、金融等专业建议而未附加免责声明

违反本政策可能导致账户暂停或终止，并保留追究法律责任的权利。`,
  },
  {
    icon: Ban,
    title: '4. 服务限制与免责',
    content: `4.1 AI 模型生成的内容仅供参考，不构成任何专业建议。

4.2 我们不保证服务的绝对可用性，可能因维护、升级或不可抗力导致服务中断。

4.3 模型输出可能存在错误、偏见或不准确，您应自行验证关键信息。

4.4 我们不对因使用本服务造成的任何间接、附带或后果性损失承担责任。

4.5 我们的总责任不超过您在过去 12 个月内向我们支付的费用总额。`,
  },
  {
    icon: Scale,
    title: '5. 知识产权',
    content: `5.1 本服务的软件、界面、商标等知识产权归我们所有。

5.2 您通过 API 输入的内容（提示词、文件等）的知识产权归您所有。

5.3 模型生成内容的知识产权归属取决于适用法律和模型提供商的政策，您应自行确认。

5.4 您授予我们为提供服务所必需的、有限的内容处理许可。

5.5 禁止反向工程、反编译或以其他方式试图获取源代码。`,
  },
  {
    icon: RefreshCw,
    title: '6. 条款变更与终止',
    content: `6.1 我们可能不时更新本服务条款，重大变更会提前 30 天通知。

6.2 继续使用服务即表示您接受更新后的条款。

6.3 您可以随时停止使用服务并注销账户。

6.4 如您违反本条款，我们有权立即暂停或终止服务。

6.5 条款终止后，您应立即停止使用本服务，已产生的费用仍需支付。`,
  },
  {
    icon: Headphones,
    title: '7. 争议解决',
    content: `7.1 本条款的解释和执行适用中华人民共和国法律。

7.2 因本条款产生的争议，双方应首先友好协商解决。

7.3 协商不成的，任何一方可向我们所在地有管辖权的人民法院提起诉讼。

7.4 本条款任何部分被认定为无效或不可执行，不影响其他部分的效力。

7.5 我们未行使任何权利不构成对该权利的放弃。`,
  },
]

export function NexusTerms() {
  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      <div className="max-w-[1880px] mx-auto px-6 py-10">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#c8ff00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-[#c8ff00]" />
          </div>
          <SNPageHeader title="服务条款" subtitle="使用 NexusAI 服务的条款和条件" />
          <p className="text-gray-500 text-sm">最后更新：2026 年 9 月 1 日 · 生效日期：2026 年 9 月 1 日</p>
        </div>

        {/* 引言 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <p className="text-gray-400 text-sm leading-relaxed">
            欢迎使用 NexusAI（以下简称"本服务"）。在使用本服务前，请仔细阅读以下服务条款。注册或使用本服务即表示您已阅读、理解并同意受本条款约束。如您不同意任何条款，请立即停止使用本服务。
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
          <p className="text-sm text-gray-400 mb-4">如有任何关于服务条款的问题，请联系我们</p>
          <a
            href="mailto:legal@nexusai.com"
            className="inline-flex items-center gap-2 bg-[#c8ff00] text-black px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d4ff33] transition-colors"
          >
            legal@nexusai.com
          </a>
        </div>
      </div>
    </div>
  )
}
