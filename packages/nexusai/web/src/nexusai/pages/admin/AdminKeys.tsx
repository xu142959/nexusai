import { useState } from 'react'
import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminKeys() {
  const [keys] = useState([
    { id: 1, name: 'admin-key', user: 'admin', prefix: 'sk-...abc', quota: '无限', used: '0', status: 'active', created: '2024-01-15' },
    { id: 2, name: 'testuser123-key', user: 'testuser123', prefix: 'sk-...def', quota: '$10.00', used: '$2.34', status: 'active', created: '2024-09-23' },
    { id: 3, name: 'john-key', user: 'john_doe', prefix: 'sk-...ghi', quota: '$5.00', used: '$4.89', status: 'active', created: '2024-09-20' },
    { id: 4, name: 'jane-key', user: 'jane_smith', prefix: 'sk-...jkl', quota: '$10.00', used: '$0.00', status: 'disabled', created: '2024-09-18' },
    { id: 5, name: 'bob-key', user: 'bob_wilson', prefix: 'sk-...mno', quota: '$20.00', used: '$15.67', status: 'disabled', created: '2024-09-10' },
  ])

  return (
    <AdminLayout title="API 密钥管理">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="搜索密钥..."
          style={{
            padding: '10px 16px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
            width: '300px',
          }}
        />
        <button className="admin-btn admin-btn-primary">+ 创建密钥</button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>用户</th>
              <th>前缀</th>
              <th>额度</th>
              <th>已用</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.id}>
                <td>{key.id}</td>
                <td>{key.name}</td>
                <td>{key.user}</td>
                <td>{key.prefix}</td>
                <td>{key.quota}</td>
                <td>{key.used}</td>
                <td>
                  <span className={`admin-badge admin-badge-${key.status === 'active' ? 'success' : 'default'}`}>
                    {key.status === 'active' ? '启用' : '禁用'}
                  </span>
                </td>
                <td>{key.created}</td>
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
