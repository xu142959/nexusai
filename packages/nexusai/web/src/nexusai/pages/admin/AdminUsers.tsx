import { useState } from 'react'
import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminUsers() {
  const [users] = useState([
    { id: 1, username: 'admin', email: 'admin@nexusai.com', role: '管理员', quota: '无限', used: '0', status: 'active', created: '2024-01-15' },
    { id: 2, username: 'testuser123', email: 'test@example.com', role: '普通用户', quota: '$10.00', used: '$2.34', status: 'active', created: '2024-09-23' },
    { id: 3, username: 'john_doe', email: 'john@example.com', role: '普通用户', quota: '$5.00', used: '$4.89', status: 'active', created: '2024-09-20' },
    { id: 4, username: 'jane_smith', email: 'jane@example.com', role: '普通用户', quota: '$10.00', used: '$0.00', status: 'inactive', created: '2024-09-18' },
    { id: 5, username: 'bob_wilson', email: 'bob@example.com', role: '普通用户', quota: '$20.00', used: '$15.67', status: 'banned', created: '2024-09-10' },
  ])

  return (
    <AdminLayout title="用户管理">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="搜索用户..."
          style={{
            padding: '10px 16px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
            width: '300px',
          }}
        />
        <button className="admin-btn admin-btn-primary">+ 添加用户</button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>额度</th>
              <th>已用</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.quota}</td>
                <td>{user.used}</td>
                <td>
                  <span className={`admin-badge admin-badge-${user.status === 'active' ? 'success' : user.status === 'inactive' ? 'default' : 'error'}`}>
                    {user.status === 'active' ? '正常' : user.status === 'inactive' ? '未激活' : '已封禁'}
                  </span>
                </td>
                <td>{user.created}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ marginRight: '8px' }}>
                    编辑
                  </button>
                  <button className="admin-btn admin-btn-danger">封禁</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
