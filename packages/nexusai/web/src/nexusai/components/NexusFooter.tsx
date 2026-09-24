import { Link } from '@tanstack/react-router'
import { BRAND } from '../config/brand'

export function NexusFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#03080a]/80 backdrop-blur-xl" style={{ fontFamily: "'Inter Tight', -apple-system, sans-serif" }}>
      <div className="max-w-[1880px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* 品牌 */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(200,255,0,0.15)" stroke="#c8ff00" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="3" fill="#c8ff00" />
                <circle cx="10" cy="10" r="2" fill="#c8ff00" />
                <circle cx="22" cy="10" r="2" fill="#c8ff00" />
                <circle cx="10" cy="22" r="2" fill="#c8ff00" />
                <circle cx="22" cy="22" r="2" fill="#c8ff00" />
              </svg>
              <span className="text-xl font-semibold text-white tracking-tight">{BRAND.shortName}</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">统一接入 500+ AI 模型，更优价格，更稳可用</p>
          </div>

          {/* 产品 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">产品</h4>
            <div className="space-y-3">
              <Link to="/chat" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">在线聊天</Link>
              <Link to="/models" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">模型列表</Link>
              <Link to="/rankings" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">模型排行</Link>
              <Link to="/plans" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">定价方案</Link>
              <Link to="/console/keys" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">控制台</Link>
            </div>
          </div>

          {/* 开发者 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">开发者</h4>
            <div className="space-y-3">
              <Link to="/docs" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">API 文档</Link>
              <Link to="/docs" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">快速开始</Link>
              <Link to="/help" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">帮助中心</Link>
              <a href={BRAND.social.github} target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">GitHub</a>
            </div>
          </div>

          {/* 公司 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">公司</h4>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">关于我们</Link>
              <Link to="/privacy" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">隐私政策</Link>
              <Link to="/terms" className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">服务条款</Link>
              <a href={`mailto:${BRAND.supportEmail}`} className="block text-sm text-white/50 hover:text-[#c8ff00] transition-colors">联系我们</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">© 2026 {BRAND.company}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-white/40 hover:text-[#c8ff00] transition-colors">隐私政策</Link>
            <Link to="/terms" className="text-xs text-white/40 hover:text-[#c8ff00] transition-colors">服务条款</Link>
            <Link to="/help" className="text-xs text-white/40 hover:text-[#c8ff00] transition-colors">帮助中心</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
