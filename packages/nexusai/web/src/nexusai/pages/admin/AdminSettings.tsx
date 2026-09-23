import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminSettings() {
  return (
    <AdminLayout title="系统设置">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* 站点设置 */}
        <div className="admin-card">
          <h3 className="admin-card-title">站点设置</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                站点名称
              </label>
              <input
                type="text"
                defaultValue="NexusAI"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                站点描述
              </label>
              <textarea
                defaultValue="一站式 AI 模型接入平台，支持 500+ 模型"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                 Logo URL
              </label>
              <input
                type="text"
                placeholder="/logo.png"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
            <button className="admin-btn admin-btn-primary" style={{ alignSelf: 'flex-start' }}>
              保存设置
            </button>
          </div>
        </div>

        {/* 注册设置 */}
        <div className="admin-card">
          <h3 className="admin-card-title">注册与认证</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>允许新用户注册</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>邮箱验证</span>
              <input type="checkbox" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>Turnstile 验证码</span>
              <input type="checkbox" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                新用户默认额度 ($)
              </label>
              <input
                type="number"
                defaultValue="5"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
          </div>
        </div>

        {/* 支付设置 */}
        <div className="admin-card">
          <h3 className="admin-card-title">支付设置</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>启用支付宝</span>
              <input type="checkbox" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>启用微信支付</span>
              <input type="checkbox" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>启用 Stripe</span>
              <input type="checkbox" />
            </div>
          </div>
        </div>

        {/* 邮件设置 */}
        <div className="admin-card">
          <h3 className="admin-card-title">邮件设置</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                SMTP 服务器
              </label>
              <input
                type="text"
                placeholder="smtp.example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                SMTP 端口
              </label>
              <input
                type="number"
                defaultValue="587"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                发件邮箱
              </label>
              <input
                type="email"
                placeholder="noreply@nexusai.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </div>
            <button className="admin-btn admin-btn-secondary">发送测试邮件</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
