import { Component, type ErrorInfo, type ReactNode } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

/**
 * 全局错误边界。
 *
 * 捕获未被路由级 errorComponent 处理的 React 渲染错误（例如 Provider
 * 子树内的异常），显示可恢复的降级界面，避免整页白屏 / 浏览器崩溃页。
 * 事件处理器中的错误不会被错误边界捕获，但它们不会中断渲染，因此
 * 不影响本边界的职责。
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary] Uncaught render error:', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#03080a',
            color: '#fff',
            fontFamily: 'Inter Tight, -apple-system, sans-serif',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '52px', lineHeight: 1 }}>⚠️</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
            页面出了点问题
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '14px',
              margin: 0,
              maxWidth: '420px',
            }}
          >
            界面渲染时发生异常，点击下方按钮重新加载。
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '8px',
              padding: '10px 28px',
              borderRadius: '10px',
              border: 'none',
              background: '#c8ff00',
              color: '#000',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            重新加载
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
