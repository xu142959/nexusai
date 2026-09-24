import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export function ConsoleDashboard() {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [userRes, logRes, keyRes] = await Promise.all([
          api.get('/api/user/self').catch(() => ({ data: {} })),
          api.get('/api/log/self?p=1&page_size=10').catch(() => ({ data: { data: { items: [] } } })),
          api.get('/api/token/', { params: { p: 1, page_size: 5 } }).catch(() => ({ data: { data: { items: [] } } })),
        ])
        if (cancelled) return
        setData({
          user: userRes.data?.data || userRes.data,
          logs: logRes.data?.data?.items || logRes.data?.data || [],
          keys: keyRes.data?.data?.items || keyRes.data?.data || [],
        })
      } catch (e) {
        console.error('[Dashboard] error:', e)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">控制台概览</h1>
      <p className="text-gray-400 mt-2">
        {loaded ? `加载完成 - 用户: ${data?.user?.username || '未知'}, 日志: ${data?.logs?.length || 0}, 密钥: ${data?.keys?.length || 0}` : '加载中...'}
      </p>
    </div>
  )
}
