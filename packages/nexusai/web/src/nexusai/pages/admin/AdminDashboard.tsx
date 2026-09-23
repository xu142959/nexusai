import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminDashboard() {
  const stats = [
    { label: '总用户数', value: '1,234', change: '+12%', up: true },
    { label: '今日请求', value: '45.2K', change: '+8.3%', up: true },
    { label: '今日 Token 消耗', value: '2.3M', change: '-3.1%', up: false },
    { label: '活跃渠道', value: '8', change: '+2', up: true },
  ]

  const recentRequests = [
    { time: '10:23:45', user: 'testuser123', model: 'gpt-4o', tokens: '1,234', status: 'success' },
    { time: '10:23:42', user: 'john_doe', model: 'claude-3.5-sonnet', tokens: '2,567', status: 'success' },
    { time: '10:23:38', user: 'jane_smith', model: 'gemini-2.0-flash', tokens: '892', status: 'success' },
    { time: '10:23:35', user: 'testuser123', model: 'deepseek-v3', tokens: '1,567', status: 'error' },
    { time: '10:23:30', user: 'admin', model: 'gpt-4o', tokens: '3,456', status: 'success' },
  ]

  const channelStatus = [
    { name: 'OpenAI 官方', type: 'OpenAI', models: '12', status: 'success' },
    { name: 'Claude 官方', type: 'Anthropic', models: '5', status: 'success' },
    { name: 'DeepSeek', type: 'DeepSeek', models: '3', status: 'success' },
    { name: '通义千问', type: 'Qwen', models: '8', status: 'warning' },
    { name: 'Gemini', type: 'Google', models: '4', status: 'error' },
  ]

  return (
    <AdminLayout title="仪表盘">
      {/* 统计卡片 */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className={`admin-stat-change ${stat.up ? 'up' : 'down'}`}>
              {stat.up ? '↑' : '↓'} {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* 最近请求 */}
      <div className="admin-card">
        <h3 className="admin-card-title">最近请求</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>用户</th>
              <th>模型</th>
              <th>Token</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((req, i) => (
              <tr key={i}>
                <td>{req.time}</td>
                <td>{req.user}</td>
                <td>{req.model}</td>
                <td>{req.tokens}</td>
                <td>
                  <span className={`admin-badge admin-badge-${req.status === 'success' ? 'success' : 'error'}`}>
                    {req.status === 'success' ? '成功' : '失败'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 渠道状态 */}
      <div className="admin-card">
        <h3 className="admin-card-title">渠道状态</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>渠道名称</th>
              <th>类型</th>
              <th>模型数</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {channelStatus.map((ch, i) => (
              <tr key={i}>
                <td>{ch.name}</td>
                <td>{ch.type}</td>
                <td>{ch.models}</td>
                <td>
                  <span className={`admin-badge admin-badge-${ch.status}`}>
                    {ch.status === 'success' ? '正常' : ch.status === 'warning' ? '警告' : '异常'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
