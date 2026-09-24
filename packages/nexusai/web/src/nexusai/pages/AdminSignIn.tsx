import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { UserAuthForm } from '@/features/auth/sign-in/components/user-auth-form'
import { BRAND } from '../config/brand'

export function AdminSignIn() {
  return (
    <div className="nexus-auth-page">
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
        <div className="nexus-auth-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(200,255,0,0.15)" stroke="#c8ff00" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#c8ff00" />
            <circle cx="10" cy="10" r="2" fill="#c8ff00" />
            <circle cx="22" cy="10" r="2" fill="#c8ff00" />
            <circle cx="10" cy="22" r="2" fill="#c8ff00" />
            <circle cx="22" cy="22" r="2" fill="#c8ff00" />
          </svg>
          <span>{BRAND.shortName}</span>
        </div>

        {/* 登录卡片 */}
        <div className="nexus-auth-card">
          <div className="nexus-auth-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldCheck size={24} color="#c8ff00" />
              </div>
            </div>
            <h1>管理后台登录</h1>
            <p>仅限管理员账户访问</p>
          </div>

          <UserAuthForm redirectTo="/admin/dashboard" />
        </div>

        {/* 返回用户端 */}
        <Link to="/" className="nexus-auth-back">
          <ArrowLeft size={14} style={{ display: 'inline', marginRight: 4 }} />
          返回用户端
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
          opacity: 0.12;
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
          background: #0066ff;
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
        .nexus-auth-back {
          color: rgba(252, 252, 254, 0.4);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
          display: inline-flex;
          align-items: center;
        }
        .nexus-auth-back:hover {
          color: #c8ff00;
        }
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
