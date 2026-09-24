import { api } from '@/lib/api'

const KEY_CACHE = 'nexusai-apikey'
const KEY_CACHE_TIME = 'nexusai-apikey-time'
const KEY_CACHE_TTL = 30 * 60 * 1000 // 30 分钟，key 被轮换/删除后不会长期使用旧缓存

export async function getApiKey(): Promise<string | null> {
  // 优先使用未过期的缓存，避免每次进入页面都请求
  const cached = localStorage.getItem(KEY_CACHE)
  const cachedAt = Number(localStorage.getItem(KEY_CACHE_TIME) || 0)
  if (cached && cachedAt && Date.now() - cachedAt < KEY_CACHE_TTL) return cached

  // 未登录时不调用 API，避免 401 重定向
  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    // 只读接口：列出 token（注意不能调 GET /api/user/token，那是“生成新 key 并覆盖”的接口）
    const res = await api.get('/api/token/', {
      skipErrorHandler: true,
      params: { p: 1, page_size: 10 },
    })
    const items = res.data?.data?.items || []
    if (items.length === 0) return null
    const first = items[0]
    // 取明文 key
    const keyRes = await api.post(`/api/token/${first.id}/key`, {}, { skipErrorHandler: true })
    const key = keyRes.data?.data?.key
    if (key) {
      localStorage.setItem(KEY_CACHE, key)
      localStorage.setItem(KEY_CACHE_TIME, String(Date.now()))
      return key
    }
  } catch {
    // 安全验证或网络异常时静默失败
  }
  return null
}

export function clearApiKeyCache() {
  localStorage.removeItem(KEY_CACHE)
  localStorage.removeItem(KEY_CACHE_TIME)
}
