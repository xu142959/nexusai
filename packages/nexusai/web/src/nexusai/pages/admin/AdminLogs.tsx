import { useState } from 'react'
import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminLogs() {
  const [logs] = useState([
    { id: 1, time: '2024-09-24 10:23:45', user: 'testuser123', model: 'gpt-4o', tokens: '1,234', cost: '$0.003', status: 'success' },
    { id: 2, time: '2024-09-24 10:23:42', user: 'john_doe', model: 'claude-3.5-sonnet', tokens: '2,567', cost: '$0.015', status: 'success' },
    { id: 3, time: '2024-09-24 10:23:38', user: 'jane_smith', model: 'gemini-2.0-flash', tokens: '892', cost: '$0.001', status: 'success' },
    { id: 4, time: '2024-09-24 10:23:35', user: 'testuser123', model: 'deepseek-v3', tokens: '1,567', cost: '$0.002', status: 'error' },
    { id: 5, time: '2024-09-24 10:23:30', user: 'admin', model: 'gpt-4o', tokens: '3,456', cost: '$0.008', status: 'success' },
    { id: 6, time: '2024-09-24 10:23:25', user: 'bob_wilson', model: 'qwen-max', tokens: '678', cost: '$0.001', status: 'success' },
    { id: 7, time: '2024-09-24 10:23:20', user: 'john_doe', model: 'claude-3-opus', tokens: '4,567', cost: '$0.034', status: 'success' },
    { id: 8, time: '2024-09-24 10:23:15', user: 'testuser123', model: 'gpt-4o-mini', tokens: '234', cost: '$0.0001', status: 'success' },
  ])

  return (
    <AdminLayout title="使用日志">
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="搜索用户/模型..."
          style={{
            padding: '10px 16px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
            width: '300px',
          }}
        />
        <select
          style={{
            padding: '10px 16px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
          }}
        >
          <option>全部状态</option>
          <option>成功</option>
          <option>失败</option>
        </select>
        <button className="admin-btn admin-btn-secondary">导出日志</button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>时间</th>
              <th>用户</th>
              <th>模型</th>
              <th>Token</th>
              <th>费用</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.time}</td>
                <td>{log.user}</td>
                <td>{log.model}</td>
                <td>{log.tokens}</td>
                <td>{log.cost}</td>
                <td>
                  <span className={`admin-badge admin-badge-${log.status}`}>
                    {log.status === 'success' ? '成功' : '失败'}
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
