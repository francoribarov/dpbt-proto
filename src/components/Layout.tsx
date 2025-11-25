import { Link, useLocation } from 'react-router-dom'
import { Dog, History, Trash2 } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { usePreconsulta } from '../context/PreconsultaContext'

const navClasses = (active: boolean) =>
  `inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${active ? 'border-gray-800 bg-gray-100 text-gray-900' : 'border-gray-200 text-gray-600'
  }`

export const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation()
  const { clearAll } = usePreconsulta()

  const onReset = () => {
    if (confirm('¿Borrar borradores e historial guardado?')) {
      clearAll()
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <Link to="/preconsulta/sintoma" className="flex items-center gap-3 text-gray-900">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <Dog className="h-5 w-5 text-gray-700" />
            </span>
            <div className="hidden sm:block">
              <div className="text-xs uppercase tracking-wide text-gray-500">Pretotipo</div>
              <div className="text-lg font-semibold text-gray-900">Preconsulta veterinaria</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/preconsulta/sintoma"
              className={navClasses(location.pathname.startsWith('/preconsulta'))}
            >
              <Dog className="h-4 w-4" />
              <span className="hidden sm:inline">Flujo</span>
            </Link>
            <Link to="/historial" className={navClasses(location.pathname.startsWith('/historial'))}>
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500 transition hover:border-gray-400 hover:bg-gray-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Reset datos</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">{children}</main>
    </div>
  )
}
