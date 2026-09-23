import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { motion } from 'motion/react'
import './storynest-ui.css'

/* ============ Button ============ */
interface SNButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

export function SNButton({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: SNButtonProps) {
  return (
    <button
      className={`sn-btn sn-btn-${variant} sn-btn-${size} ${className}`}
      {...props}
    >
      {icon && <span className="sn-btn-icon">{icon}</span>}
      {children}
    </button>
  )
}

/* ============ Input ============ */
interface SNInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  label?: string
}

export function SNInput({ icon, label, className = '', ...props }: SNInputProps) {
  return (
    <div className="sn-input-wrapper">
      {label && <label className="sn-input-label">{label}</label>}
      <div className="sn-input-container">
        {icon && <span className="sn-input-icon">{icon}</span>}
        <input className={`sn-input ${icon ? 'sn-input-with-icon' : ''} ${className}`} {...props} />
      </div>
    </div>
  )
}

/* ============ Card ============ */
interface SNCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
  delay?: number
}

export function SNCard({ children, className = '', hover = true, animate = false, delay = 0 }: SNCardProps) {
  const card = (
    <div className={`sn-card ${hover ? 'sn-card-hover' : ''} ${className}`}>
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {card}
      </motion.div>
    )
  }

  return card
}

/* ============ Badge ============ */
interface SNBadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export function SNBadge({ children, variant = 'default', size = 'md', className = '' }: SNBadgeProps) {
  return (
    <span className={`sn-badge sn-badge-${variant} sn-badge-${size} ${className}`}>
      {children}
    </span>
  )
}

/* ============ StatCard ============ */
interface SNStatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: string
  trendUp?: boolean
  animate?: boolean
  delay?: number
}

export function SNStatCard({ label, value, icon, trend, trendUp, animate = false, delay = 0 }: SNStatCardProps) {
  const content = (
    <div className="sn-stat-card">
      <div className="sn-stat-card-header">
        <span className="sn-stat-card-label">{label}</span>
        {icon && <span className="sn-stat-card-icon">{icon}</span>}
      </div>
      <div className="sn-stat-card-value">{value}</div>
      {trend && (
        <div className={`sn-stat-card-trend ${trendUp ? 'sn-stat-card-trend-up' : 'sn-stat-card-trend-down'}`}>
          {trend}
        </div>
      )}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}

/* ============ Select ============ */
interface SNSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function SNSelect({ label, options, className = '', ...props }: SNSelectProps) {
  return (
    <div className="sn-select-wrapper">
      {label && <label className="sn-input-label">{label}</label>}
      <select className={`sn-select ${className}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

/* ============ EmptyState ============ */
interface SNEmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function SNEmptyState({ icon, title, description, action }: SNEmptyStateProps) {
  return (
    <div className="sn-empty-state">
      <div className="sn-empty-state-icon">{icon}</div>
      <h3 className="sn-empty-state-title">{title}</h3>
      {description && <p className="sn-empty-state-description">{description}</p>}
      {action && <div className="sn-empty-state-action">{action}</div>}
    </div>
  )
}

/* ============ Loading ============ */
export function SNLoading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="sn-loading">
      <div className="sn-loading-spinner" />
      <span className="sn-loading-text">{text}</span>
    </div>
  )
}

/* ============ Divider ============ */
export function SNDivider({ className = '' }: { className?: string }) {
  return <div className={`sn-divider ${className}`} />
}

/* ============ PageHeader ============ */
interface SNPageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  animate?: boolean
}

export function SNPageHeader({ title, subtitle, actions, animate = true }: SNPageHeaderProps) {
  return (
    <motion.div
      className="sn-page-header"
      initial={animate ? { opacity: 0, y: -20, filter: 'blur(10px)' } : false}
      animate={animate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : false}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sn-page-header-content">
        <h1 className="sn-page-title">{title}</h1>
        {subtitle && <p className="sn-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="sn-page-header-actions">{actions}</div>}
    </motion.div>
  )
}
