import { Clock4, Inbox } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Card, SecondaryButton } from '../components/ui'
import { SeverityBadge } from '../components/SeverityBadge'
import { usePreconsulta } from '../context/PreconsultaContext'
import { buildSummaryText } from '../lib/summary'
import { symptomLabels } from '../lib/symptoms'
import type { PreconsultaDraft } from '../types'

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString('es-UY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

export const History = () => {
  const { history } = usePreconsulta()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<PreconsultaDraft | null>(null)

  useEffect(() => {
    if (history.length) setSelected(history[0])
  }, [history])

  return (
    <div className="space-y-6">
      <AppBar
        step="Historial"
        title="Preconsultas guardadas"
        subtitle="Solo para testear recurrencia y confianza"
      />

      {!history.length ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
          <Inbox className="mb-3 h-8 w-8 text-gray-500" />
          <div className="text-sm font-semibold">Aún no hay registros</div>
          <div className="text-xs text-gray-500">Completá una preconsulta para ver acá.</div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-4 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Clock4 className="h-4 w-4" />
              Últimas preconsultas
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                    selected?.id === item.id
                      ? 'border-teal-600 bg-[#e3f1f2]'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {item.symptom ? symptomLabels[item.symptom] : 'Sin síntoma'}
                    </div>
                    <SeverityBadge level={item.triage} />
                  </div>
                  <div className={`text-xs ${selected?.id === item.id ? 'text-gray-700' : 'text-gray-600'}`}>
                    {formatDate(item.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Inbox className="h-4 w-4" />
              Resumen guardado
            </div>
            {selected ? (
              <>
                <pre className="whitespace-pre-wrap rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                  {selected.summaryText ??
                    buildSummaryText(selected, { level: selected.triage ?? 'verde', reason: '' })}
                </pre>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    Seguimiento: {selected.followUps.length ? `${selected.followUps.length} check-ins` : 'No creado'}
                  </div>
                  {selected.followUps.length > 0 && (
                    <SecondaryButton onClick={() => navigate(`/seguimiento/${selected.id}`)} className="px-3 py-2 text-sm min-h-[40px]">
                      Abrir seguimiento
                    </SecondaryButton>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600">Elegí un caso para ver el detalle.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
