import { Image, Trash2, Video, CheckCircle2 } from 'lucide-react'
import type { MediaItem } from '../types'

type Props = {
  items: MediaItem[]
  onRemove?: (id: string) => void
}

export const MediaList = ({ items, onRemove }: Props) => {
  if (!items.length) return <p className="text-sm text-gray-500">Sin adjuntos.</p>
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gray-50">
              {item.kind === 'foto' ? (
                <Image className="h-6 w-6 text-gray-700" />
              ) : (
                <Video className="h-6 w-6 text-gray-700" />
              )}
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</div>
              <div className="text-xs text-gray-500">{item.sizeKB} KB · {item.kind}</div>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700"
              aria-label="Quitar adjunto"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
