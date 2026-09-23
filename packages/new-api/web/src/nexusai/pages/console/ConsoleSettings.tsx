import { useState, useEffect } from 'react'
import { SNPageHeader, SNCard, SNBadge, SNButton, SNStatCard, SNLoading, SNEmptyState } from '../../components/StoryNestUI';
import { motion } from 'motion/react'
import {
  Settings, Moon, Sun, Globe, Bell, Palette, Save,
  Monitor, Languages, User, Mail, Calendar, Coins,
} from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const themes = [
  { id: 'dark', label: '深色', icon: Moon },
  { id: 'light', label: '浅色', icon: Sun },
  { id: 'system', label: '跟随系统', icon: Monitor },
]

const languages = [
  { id: 'zhCN', label: '简体中文' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
  { id: 'zhTW', label: '繁體中文' },
]

interface UserInfo {
  id?: string
  username?: string
  email?: string
  display_name?: string
  role?: number
  quota?: number
  used_quota?: number
  request_count?: number
  group?: string
  created_at?: number
}

export function ConsoleSettings() {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('zhCN')
  const [notifications, setNotifications] = useState({
    email: true,
    usage: true,
    marketing: false,
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 从 New API 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get('/api/user/self')
        const data = res.data?.data || res.data || {}
        setUserInfo(data)

        // 从用户信息中加载设置
        if (data.language) setLanguage(data.language)
      } catch (err: any) {
        console.error('获取用户信息失败:', err)
        setError(err?.message || '获取用户信息失败')
      } finally {
        setLoading(false)
      }
    }
    fetchUserInfo()
  }, [])

  // 从 localStorage 加载本地设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('nexusai-theme')
    const savedLang = localStorage.getItem('i18nextLng')
    if (savedTheme) setTheme(savedTheme)
    if (savedLang) setLanguage(savedLang)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // 保存本地设置
      localStorage.setItem('nexusai-theme', theme)
      localStorage.setItem('i18nextLng', language)

      // 尝试保存到后端（如果支持）
      try {
        await api.put('/api/user/self', {
          language: language,
        })
      } catch (e) {
        // 后端可能不支持更新语言，忽略
        console.log('后端不支持更新用户设置，仅保存本地')
      }

      toast.success('设置已保存')
    } catch {
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (ts?: number) => {
    if (!ts) return '-'
    return new Date(ts * 1000).toLocaleDateString('zh-CN')
  }

  const formatQuota = (quota?: number) => {
    if (!quota || quota < 0) return '无限'
    return `$${(quota / 500000).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <SNLoading text="加载用户设置..." />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">偏好设置</h2>
        <p className="text-sm text-gray-500 mt-1">自定义你的使用体验，数据实时同步管理端</p>
      </div>

      {/* 用户信息卡片 - 从API获取 */}
      {userInfo && (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User size={16} className="text-[#c8ff00]" />
            账户信息
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <User size={12} /> 用户名
              </div>
              <div className="text-sm font-medium text-white">{userInfo.username || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Mail size={12} /> 邮箱
              </div>
              <div className="text-sm font-medium text-white">{userInfo.email || '未绑定'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Coins size={12} /> 余额
              </div>
              <div className="text-sm font-medium text-[#c8ff00]">
                {formatQuota(userInfo.quota)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Calendar size={12} /> 注册时间
              </div>
              <div className="text-sm font-medium text-white">{formatDate(userInfo.created_at)}</div>
            </div>
          </div>
          {userInfo.group && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-xs text-gray-500">用户分组：</span>
              <span className="text-xs bg-[#c8ff00]/10 text-[#c8ff00] px-2 py-0.5 rounded ml-2">
                {userInfo.group}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 主题设置 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-4">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Palette size={16} className="text-[#c8ff00]" />
          主题
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                theme === t.id
                  ? 'border-[#c8ff00] bg-[#c8ff00]/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <t.icon size={20} className={theme === t.id ? 'text-[#c8ff00]' : 'text-gray-400'} />
              <span className={`text-sm ${theme === t.id ? 'text-white' : 'text-gray-400'}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 语言设置 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-4">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Languages size={16} className="text-[#c8ff00]" />
          语言
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                language === lang.id
                  ? 'border-[#c8ff00] bg-[#c8ff00]/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <Globe size={16} className={language === lang.id ? 'text-[#c8ff00]' : 'text-gray-400'} />
              <span className={`text-sm ${language === lang.id ? 'text-white' : 'text-gray-400'}`}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 通知设置 */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Bell size={16} className="text-[#c8ff00]" />
          通知
        </h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: '邮件通知', desc: '接收账户相关的邮件通知' },
            { key: 'usage', label: '用量提醒', desc: '用量达到阈值时提醒' },
            { key: 'marketing', label: '产品更新', desc: '接收新功能和产品更新信息' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-[#c8ff00]' : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-black font-semibold rounded-xl hover:bg-[#d4ff33] transition-colors disabled:opacity-50"
      >
        <Save size={18} />
        {saving ? '保存中...' : '保存设置'}
      </button>
    </div>
  )
}
