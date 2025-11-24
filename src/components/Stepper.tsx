import { Minus, Plus } from 'lucide-react'

type Props = {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export const Stepper = ({ value, min, max, onChange }: Props) => {
  const clamp = (val: number) => Math.min(max, Math.max(min, val))

  return (
    <div className="inline-flex items-center rounded-2xl border border-gray-200 bg-white shadow-inner shadow-black/5">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        className="grid h-12 w-12 place-items-center border-r border-gray-100 text-gray-700 transition hover:bg-gray-50 disabled:text-gray-400"
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="w-14 text-center text-lg font-semibold text-gray-800">{value}</div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        className="grid h-12 w-12 place-items-center border-l border-gray-100 text-gray-700 transition hover:bg-gray-50 disabled:text-gray-400"
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
