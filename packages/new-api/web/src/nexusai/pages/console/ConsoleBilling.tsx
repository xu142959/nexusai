import { useState } from 'react'
import { SNPageHeader, SNCard, SNBadge, SNButton, SNStatCard } from '../../components/StoryNestUI';
import { motion } from 'motion/react'
import { CreditCard, Wallet, Gift, Check, Zap } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const amounts = [
  { value: 10, label: '¥10', bonus: 0 },
  { value: 50, label: '¥50', bonus: 2 },
  { value: 100, label: '¥100', bonus: 5 },
  { value: 200, label: '¥200', bonus: 15 },
  { value: 500, label: '¥500', bonus: 50 },
  { value: 1000, label: '¥1000', bonus: 120 },
]

const paymentMethods = [
  { id: 'alipay', name: '支付宝', icon: '💳' },
  { id: 'wechat', name: '微信支付', icon: '💬' },
  { id: 'stripe', name: '信用卡', icon: '💳' },
]

export function ConsoleBilling() {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('alipay')
  const [processing, setProcessing] = useState(false)

  const handleTopup = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount
    if (!amount || amount < 1) {
      toast.error('请输入有效的充值金额')
      return
    }

    setProcessing(true)
    try {
      // New API 充值接口
      const res = await api.post('/api/user/topup', {
        amount: amount,
        payment_method: paymentMethod,
      })
      if (res.data?.success) {
        toast.success('充值订单已创建，请完成支付')
        // 这里可以跳转到支付页面
      }
    } catch (e: any) {
      toast.error('创建订单失败：' + (e.response?.data?.message || '请稍后重试'))
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">充值账单</h2>
        <p className="text-sm text-gray-500 mt-1">为账户充值，按量消费</p>
      </div>

      {/* 余额卡片 */}
      <div className="bg-gradient-to-r from-[#c8ff00]/10 to-transparent border border-[#c8ff00]/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Wallet size={20} className="text-[#c8ff00]" />
          <span className="text-sm text-gray-400">账户余额</span>
        </div>
        <div className="text-3xl font-bold text-[#c8ff00]">$0.00</div>
        <p className="text-xs text-gray-500 mt-2">余额永久有效，按实际 Token 消耗扣费</p>
      </div>

      {/* 充值金额 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">选择充值金额</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {amounts.map(amt => (
            <button
              key={amt.value}
              onClick={() => { setSelectedAmount(amt.value); setCustomAmount('') }}
              className={`relative p-4 rounded-xl border text-center transition-all ${
                selectedAmount === amt.value && !customAmount
                  ? 'border-[#c8ff00] bg-[#c8ff00]/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {amt.bonus > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#c8ff00] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                  送 ¥{amt.bonus}
                </div>
              )}
              <div className={`text-lg font-bold ${selectedAmount === amt.value && !customAmount ? 'text-[#c8ff00]' : 'text-white'}`}>
                {amt.label}
              </div>
              {amt.bonus > 0 && (
                <div className="text-xs text-gray-500 mt-1">到账 ¥{amt.value + amt.bonus}</div>
              )}
            </button>
          ))}
        </div>

        {/* 自定义金额 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">自定义</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
            <input
              type="number"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              placeholder="输入金额（最低 ¥1）"
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]/50"
            />
          </div>
        </div>
      </div>

      {/* 支付方式 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">选择支付方式</h3>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-4 rounded-xl border text-center transition-all ${
                paymentMethod === method.id
                  ? 'border-[#c8ff00] bg-[#c8ff00]/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-1">{method.icon}</div>
              <div className={`text-sm font-medium ${paymentMethod === method.id ? 'text-[#c8ff00]' : 'text-white'}`}>
                {method.name}
              </div>
              {paymentMethod === method.id && (
                <Check size={14} className="text-[#c8ff00] mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 充值按钮 */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <button
          onClick={handleTopup}
          disabled={processing}
          className="w-full bg-[#c8ff00] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#d4ff33] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CreditCard size={20} />
          {processing ? '处理中...' : `立即充值 ¥${customAmount || selectedAmount}`}
        </button>
      </motion.div>

      {/* 充值说明 */}
      <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-xl p-5">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Zap size={14} className="text-[#c8ff00]" /> 充值说明
        </h4>
        <ul className="space-y-2 text-xs text-gray-500">
          <li className="flex items-start gap-2">
            <Check size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
            充值即时到账，余额永久有效
          </li>
          <li className="flex items-start gap-2">
            <Check size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
            按实际 Token 消耗扣费，用多少扣多少
          </li>
          <li className="flex items-start gap-2">
            <Check size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
            未使用的余额可申请退款（原路返回）
          </li>
          <li className="flex items-start gap-2">
            <Gift size={12} className="text-[#c8ff00] mt-0.5 flex-shrink-0" />
            赠送金额不可提现，仅限 API 消费
          </li>
        </ul>
      </div>
    </div>
  )
}
