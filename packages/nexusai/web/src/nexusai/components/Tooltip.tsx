import { ReactNode, useState } from 'react'
import './tooltip.css'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  let timeout: ReturnType<typeof setTimeout>

  const show = () => {
    timeout = setTimeout(() => setVisible(true), delay)
  }

  const hide = () => {
    clearTimeout(timeout)
    setVisible(false)
  }

  return (
    <span
      className="snt-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span className={`snt-tooltip snt-${position}`} role="tooltip">
          {content}
          <span className="snt-arrow" />
        </span>
      )}
    </span>
  )
}
