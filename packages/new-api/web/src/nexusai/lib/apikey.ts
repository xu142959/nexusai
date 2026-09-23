import { api } from '@/lib/api'

const KEY_CACHE = 'nexusai-apikey'

export async function getApiKey(): Promise<string | null> {
  // 先从缓存
  const cached = localStorage.getItem(KEY_CACHE)
  if (cached) return cached

  // 未登录时不调用 API，避免 401 重定向
  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    const res = await api.get('/api/user/token', { skipErrorHandler: true })
    const tokens = res.data?.data?.items || res.data?.data || []
    if (tokens.length > 0 && tokens[0].key) {
      localStorage.setItem(KEY_CACHE, tokens[0].key)
      return tokens[0].key
    }
  } catch {
    // 安全验证时无法获取
  }
  return null
}

export function clearApiKeyCache() {
  localStorage.removeItem(KEY_CACHE)
}

