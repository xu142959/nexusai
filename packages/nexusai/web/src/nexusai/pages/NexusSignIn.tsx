import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { UserAuthForm } from '@/features/auth/sign-in/components/user-auth-form'
import { TermsFooter } from '@/features/auth/components/terms-footer'
import { useStatus } from '@/hooks/use-status'
import { BRAND } from '../config/brand'

export function NexusSignIn() {
  const { status } = useStatus()
  const redirect = '/'

  return (
    <div className="nexus-auth-page">
      {/* 背景装饰 */}
      <div className="nexus-auth-bg">
        <div className="nexus-auth-glow nexus-auth-glow-1" />
        <div className="nexus-auth-glow nexus-auth-glow-2" />
      </div>

      <motion.div
        className="nexus-auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link to="/" className="nexus-auth-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(200,255,0,0.15)" stroke="#c8ff00" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#c8ff00" />
            <circle cx="10" cy="10" r="2" fill="#c8ff00" />
            <circle cx="22" cy="10" r="2" fill="#c8ff00" />
            <circle cx="10" cy="22" r="2" fill="#c8ff00" />
            <circle cx="22" cy="22" r="2" fill="#c8ff00" />
          </svg>
          <span>{BRAND.shortName}</span>
        </Link>

        {/* 登录卡片 */}
        <div className="nexus-auth-card">
          <div className="nexus-auth-header">
            <h1>欢迎回来</h1>
            <p>登录您的账户，继续探索 AI 的无限可能</p>
          </div>

          {!status?.self_use_mode_enabled && status?.register_enabled !== false && (
            <p className="nexus-auth-switch">
              没有账号？{' '}
              <Link to="/sign-up" className="nexus-auth-link">
                立即注册 <ArrowRight size={14} />
              </Link>
            </p>
          )}

          <UserAuthForm redirectTo={redirect} />

          <TermsFooter
            variant="sign-in"
            status={status}
            className="nexus-auth-terms"
          />
        </div>

        {/* 返回首页 */}
        <Link to="/" className="nexus-auth-back">
          ← 返回首页
        </Link>
      </motion.div>

      <style>{`
        .nexus-auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #03080a;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }
        .nexus-auth-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .nexus-auth-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }
        .nexus-auth-glow-1 {
          width: 600px;
          height: 600px;
          background: #c8ff00;
          top: -200px;
          right: -100px;
        }
        .nexus-auth-glow-2 {
          width: 500px;
          height: 500px;
          background: #00ff88;
          bottom: -150px;
          left: -100px;
        }
        .nexus-auth-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }
        .nexus-auth-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #fcfcfe;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .nexus-auth-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
        }
        .nexus-auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .nexus-auth-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fcfcfe;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .nexus-auth-header p {
          font-size: 14px;
          color: rgba(252, 252, 254, 0.5);
          margin: 0;
        }
        .nexus-auth-switch {
          text-align: center;
          font-size: 14px;
          color: rgba(252, 252, 254, 0.5);
          margin: 0 0 24px;
        }
        .nexus-auth-link {
          color: #c8ff00;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s;
        }
        .nexus-auth-link:hover {
          opacity: 0.8;
        }
        .nexus-auth-terms {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: rgba(252, 252, 254, 0.3);
        }
        .nexus-auth-back {
          color: rgba(252, 252, 254, 0.4);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .nexus-auth-back:hover {
          color: #c8ff00;
        }
        /* 覆盖 New API 表单样式 */
        .nexus-auth-card form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .nexus-auth-card label {
          color: rgba(252, 252, 254, 0.7) !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .nexus-auth-card input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          color: #fcfcfe !important;
          font-size: 14px !important;
          transition: all 0.2s !important;
        }
        .nexus-auth-card input:focus {
          border-color: #c8ff00 !important;
          box-shadow: 0 0 0 3px rgba(200, 255, 0, 0.1) !important;
          outline: none !important;
        }
        .nexus-auth-card input::placeholder {
          color: rgba(252, 252, 254, 0.3) !important;
        }
        .nexus-auth-card button[type="submit"] {
          background: #c8ff00 !important;
          color: #03080a !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 14px !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          margin-top: 8px !important;
        }
        .nexus-auth-card button[type="submit"]:hover {
          background: #d4ff33 !important;
          transform: translateY(-1px) !important;
        }
        .nexus-auth-card button[type="submit"]:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }
      `}</style>
    </div>
  )
}
