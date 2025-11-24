import type { PropsWithChildren } from 'react'
import { CheckCircle2, Info } from 'lucide-react'
import { palette } from '../lib/theme'

export const Card = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <div
    className={`rounded-2xl border border-[#e5e7eb] bg-white shadow-sm shadow-black/5 ${className}`}
  >
    {children}
  </div>
)

type AppBarProps = {
  step?: string
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export const AppBar = ({ step, title, subtitle, right }: AppBarProps) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
    <div className="space-y-1">
      {step && <p className="text-xs uppercase tracking-wide text-gray-500">{step}</p>}
      <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
    {right}
  </div>
)

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
  style?: React.CSSProperties
}

export const PrimaryButton = ({ children, className = '', style, ...rest }: ButtonProps) => (
  <button
    {...rest}
    className={`inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 py-3 text-white shadow-sm shadow-black/10 transition-all duration-150 ease-out hover:translate-y-[-1px] hover:shadow-md active:scale-[0.99] disabled:translate-y-0 disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none ${className}`}
    style={{ backgroundColor: palette.primary, ...style }}
  >
    {children}
  </button>
)

export const SecondaryButton = ({ children, className = '', style, ...rest }: ButtonProps) => (
  <button
    {...rest}
    className={`inline-flex min-h-[48px] items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-800 shadow-sm transition-all duration-150 ease-out hover:translate-y-[-1px] hover:border-gray-400 hover:shadow-md active:scale-[0.99] disabled:translate-y-0 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:shadow-none ${className}`}
    style={style}
  >
    {children}
  </button>
)

type InputSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
}

export const InputSearch = ({ value, onChange, placeholder, icon }: InputSearchProps) => (
  <div className="relative">
    {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-10 text-base text-gray-800 shadow-inner shadow-black/5 outline-none transition focus:border-[#3b8b8f] focus:ring-2 focus:ring-[#3b8b8f]/30"
    />
  </div>
)

type CardOptionProps = {
  title: string
  selected?: boolean
  onClick?: () => void
}

export const CardOption = ({ title, selected, onClick }: CardOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex h-full w-full flex-col gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-md ${
      selected
        ? 'shadow-sm'
        : 'border-gray-200 bg-white'
    }`}
    style={
      selected
        ? { borderColor: palette.primary, backgroundColor: palette.primarySoft }
        : { borderColor: '#e5e7eb', backgroundColor: '#fff' }
    }
  >
    <div className="text-base font-semibold text-gray-900">{title}</div>
    <div className="text-xs text-gray-500">Tocá para seleccionar</div>
    {selected && (
      <span className="absolute right-3 top-3" style={{ color: palette.primary }}>
        <CheckCircle2 className="h-5 w-5" />
      </span>
    )}
  </button>
)

type BadgeProps = {
  label: string
  tone?: 'muted' | 'info'
}

export const Badge = ({ label, tone = 'muted' }: BadgeProps) => {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border"
      style={
        tone === 'info'
          ? { backgroundColor: palette.primarySoft, color: palette.primary, borderColor: palette.primary }
          : { backgroundColor: '#f3f4f6', color: '#4b5563', borderColor: '#e5e7eb' }
      }
    >
      {label}
    </span>
  )
}

export const InfoBox = ({ children }: PropsWithChildren) => (
  <div
    className="flex items-start gap-2 rounded-xl px-3 py-3 text-sm text-gray-800"
    style={{ border: `1px solid ${palette.primary}`, backgroundColor: palette.primarySoft }}
  >
    <Info className="mt-0.5 h-4 w-4" style={{ color: palette.primary }} />
    <div>{children}</div>
  </div>
)
