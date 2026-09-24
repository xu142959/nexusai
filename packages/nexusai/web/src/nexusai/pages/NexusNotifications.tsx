import { useState, useEffect } from 'react'
import { SNPageHeader, SNLoading, SNEmptyState } from '../components/StoryNestUI';
import { motion } from 'motion/react'
import { Bell, Check, CheckCheck, Trash2, AlertCircle, Info, Zap, Gift, Megaphone } from 'lucide-react'
import { api } from '@/lib/api'

interface Announcement {
  id?: string
  title?: string
  content?: string
  created_at?: number
  type?: string
}

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'promo' | 'announcement'
  title: string
  message: string
  time: number
  read: boolean
}

const typeConfig = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  success: { icon: Check, color: 'text-green-400', bg: 'bg-green-400/10' },
  promo: { icon: Gift, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  announcement: { icon: Megaphone, color: 'text-[#c8ff00]', bg: 'bg-[#c8ff00]/10' },
}

export function NexusNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 从 New API 获取真实公告数据
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get('/api/status')
        const data = res.data?.data || res.data || {}
        const announcements: Announcement[] = data.announcements || []

        // 将公告转换为通知格式
        const announcementNotifications: Notification[] = announcements.map((a, idx) => ({
          id: a.id || `announcement-${idx}`,
          type: 'announcement',
          title: a.title || '系统公告',
          message: a.content || '',
          time: a.created_at ? a.created_at * 1000 : Date.now() - idx * 3600000,
          read: false,
        }))

        setNotifications(announcementNotifications)
      } catch (err: any) {
        console.error('获取通知失败:', err)
        setError(err?.message || '获取通知失败')
        // API 失败时显示空状态
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    if (confirm('确定要清空所有通知吗？')) {
      setNotifications([])
    }
  }

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts
    if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    return `${Math.floor(diff / 86400000)} 天前`
  }

  return (
    <div className="min-h-screen bg-[#03080a] text-[#fcfcfe]">
      <div className="max-w-[1880px] mx-auto px-6 py-10">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell size={24} className="text-[#c8ff00]" />
              通知中心
              {unreadCount > 0 && (
                <span className="bg-[#c8ff00] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">实时同步管理端公告和系统消息</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <CheckCheck size={14} /> 全部已读
            </button>
            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} /> 清空
            </button>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'unread' as const, label: '未读' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                filter === f.key
                  ? 'bg-[#c8ff00] text-black font-medium'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 通知列表 */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <SNLoading text="加载通知..." />
          </div>
        ) : error ? (
          <div className="py-20">
            <SNEmptyState
              icon={<AlertCircle size={48} />}
              title="加载失败"
              description={error}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">暂无通知</p>
            <p className="text-gray-600 text-sm mt-1">管理端发布公告后将显示在这里</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif, idx) => {
              const config = typeConfig[notif.type]
              const Icon = config.icon
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative bg-white/[0.03] border rounded-xl p-4 transition-all hover:bg-white/[0.05] ${
                    notif.read ? 'border-white/5' : 'border-[#c8ff00]/20'
                  }`}
                  onClick={() => markRead(notif.id)}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-[#c8ff00] rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${notif.read ? 'text-gray-600' : 'text-gray-400'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">{formatTime(notif.time)}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNotification(notif.id) }}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1 self-start"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
