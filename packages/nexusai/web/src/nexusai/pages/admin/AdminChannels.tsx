import { useState } from 'react'
import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminChannels() {
  const [channels] = useState([
    { id: 1, name: 'OpenAI 官方', type: 'OpenAI', models: '12', status: 'success', priority: 1 },
    { id: 2, name: 'Claude 官方', type: 'Anthropic', models: '5', status: 'success', priority: 2 },
    { id: 3, name: 'DeepSeek 直连', type: 'DeepSeek', models: '3', status: 'success', priority: 3 },
    { id: 4, name: '通义千问', type: 'Qwen', models: '8', status: 'warning', priority: 4 },
    { id: 5, name: 'Gemini Pro', type: 'Google', models: '4', status: 'error', priority: 5 },
  ])

  return (
    <AdminLayout title="渠道管理">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="搜索渠道..."
          style={{
            padding: '10px 16px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
            width: '300px',
          }}
        />
        <button className="admin-btn admin-btn-primary">+ 添加渠道</button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>类型</th>
              <th>模型数</th>
              <th>优先级</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.id}>
                <td>{ch.id}</td>
                <td>{ch.name}</td>
                <td>{ch.type}</td>
                <td>{ch.models}</td>
                <td>{ch.priority}</td>
                <td>
                  <span className={`admin-badge admin-badge-${ch.status}`}>
                    {ch.status === 'success' ? '正常' : ch.status === 'warning' ? '警告' : '异常'}
                  </span>
                </td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ marginRight: '8px' }}>
                    编辑
                  </button>
                  <button className="admin-btn admin-btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
