import { useState, useEffect } from 'react'
import { User, Mail, Calendar, Shield, Save } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export function ConsoleProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/user/self')
        const data = res.data?.data || {}
        setUser(data)
        setDisplayName(data.display_name || '')
      } catch (e: any) {
        toast.error('加载用户信息失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveProfile = async () => {
    try {
      await api.put('/api/user/self', {
        display_name: displayName,
      })
      toast.success('保存成功')
    } catch (e: any) {
      toast.error('保存失败：' + (e.response?.data?.message || e.message))
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-white/10 rounded w-1/4 animate-pulse" />
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-white/5 rounded" />
            <div className="h-10 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">个人资料</h2>
        <p className="text-sm text-gray-500 mt-1">管理你的账户信息</p>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User size={16} className="text-[#c8ff00]" /> 基本信息
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">用户名</label>
              <input
                value={user?.username || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">显示名称</label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="设置你的显示名称"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#c8ff00]/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">邮箱</label>
              <div className="flex items-center gap-2">
                <input
                  value={user?.email || '未绑定'}
                  disabled
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                />
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Mail size={12} />
                  {user?.verified ? '已验证' : '未验证'}
                </span>
              </div>
            </div>

            <button
              onClick={saveProfile}
              className="flex items-center gap-2 bg-[#c8ff00] text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d4ff33] transition-colors"
            >
              <Save size={16} /> 保存修改
            </button>
          </div>
        </div>

        {/* 账户信息 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={16} className="text-[#c8ff00]" /> 账户信息
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">用户 ID</p>
              <p className="text-white font-mono">{user?.id}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">角色</p>
              <p className="text-white">
                {user?.role === 100 ? '管理员' : user?.role === 10 ? '普通用户' : '用户'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">注册时间</p>
              <p className="text-white flex items-center gap-1">
                <Calendar size={12} />
                {user?.created_time ? new Date(user.created_time * 1000).toLocaleDateString('zh-CN') : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">账户状态</p>
              <p className="text-green-400">正常</p>
            </div>
          </div>
        </div>

        {/* 安全设置 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={16} className="text-[#c8ff00]" /> 安全设置
          </h3>
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-sm text-gray-300">修改密码</span>
              <span className="text-xs text-gray-500">→</span>
            </div>
            <div
              className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-sm text-gray-300">两步验证</span>
              <span className="text-xs text-gray-500">→</span>
            </div>
            <div
              className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-sm text-gray-300">登录设备管理</span>
              <span className="text-xs text-gray-500">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
