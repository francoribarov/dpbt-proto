import { palette } from '../lib/theme'

type Props = {
  level: 'verde' | 'amarillo' | 'rojo' | null | undefined
  label?: string
}

const styleMap: Record<'verde' | 'amarillo' | 'rojo', { bg: string; text: string; border: string }> = {
  verde: { bg: '#e7f6ec', text: '#1f6b3f', border: '#c8e7d3' },
  amarillo: { bg: '#fff6e6', text: '#8a6114', border: '#f3d8a0' },
  rojo: { bg: '#fdecee', text: '#8a1f2d', border: '#f4c7ce' },
}

const textMap: Record<'verde' | 'amarillo' | 'rojo', string> = {
  verde: 'Verde',
  amarillo: 'Amarillo',
  rojo: 'Rojo',
}

export const SeverityBadge = ({ level, label }: Props) => {
  if (!level) return null
  const style = styleMap[level]
  const text = label ?? textMap[level]
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-wide"
      style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.text }} />
      {text}
    </span>
  )
}
