import { useState } from 'react'
import { AdminLayout } from '@/nexusai/components/AdminLayout'

export function AdminModels() {
  const [models] = useState([
    { id: 1, name: 'gpt-4o', provider: 'OpenAI', context: '128K', inputPrice: '$2.50/1M', outputPrice: '$10.00/1M', status: 'success' },
    { id: 2, name: 'gpt-4o-mini', provider: 'OpenAI', context: '128K', inputPrice: '$0.15/1M', outputPrice: '$0.60/1M', status: 'success' },
    { id: 3, name: 'claude-3.5-sonnet', provider: 'Anthropic', context: '200K', inputPrice: '$3.00/1M', outputPrice: '$15.00/1M', status: 'success' },
    { id: 4, name: 'claude-3-opus', provider: 'Anthropic', context: '200K', inputPrice: '$15.00/1M', outputPrice: '$75.00/1M', status: 'success' },
    { id: 5, name: 'gemini-2.0-flash', provider: 'Google', context: '1M', inputPrice: '$0.10/1M', outputPrice: '$0.40/1M', status: 'success' },
    { id: 6, name: 'deepseek-v3', provider: 'DeepSeek', context: '128K', inputPrice: '$0.27/1M', outputPrice: '$1.10/1M', status: 'success' },
    { id: 7, name: 'deepseek-r1', provider: 'DeepSeek', context: '128K', inputPrice: '$0.55/1M', outputPrice: '$2.19/1M', status: 'warning' },
    { id: 8, name: 'qwen-max', provider: 'Alibaba', context: '32K', inputPrice: '$0.40/1M', outputPrice: '$1.20/1M', status: 'success' },
  ])

  return (
    <AdminLayout title="模型管理">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="搜索模型..."
          style={{
            padding: '10px 16px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
            width: '300px',
          }}
        />
        <button className="admin-btn admin-btn-primary">+ 添加模型</button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>模型名称</th>
              <th>提供商</th>
              <th>上下文</th>
              <th>输入价格</th>
              <th>输出价格</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td>{model.id}</td>
                <td>{model.name}</td>
                <td>{model.provider}</td>
                <td>{model.context}</td>
                <td>{model.inputPrice}</td>
                <td>{model.outputPrice}</td>
                <td>
                  <span className={`admin-badge admin-badge-${model.status}`}>
                    {model.status === 'success' ? '可用' : '维护中'}
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
