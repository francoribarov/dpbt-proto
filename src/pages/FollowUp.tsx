import { AlertTriangle, ArrowLeft, Clock3, MessageCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppBar, Card, SecondaryButton } from '../components/ui'
import { SeverityBadge } from '../components/SeverityBadge'
import { SymptomPill } from '../components/SymptomPill'
import { usePreconsulta } from '../context/PreconsultaContext'
import { statusLabel } from '../lib/followup'
import { calculateTriage } from '../lib/triage'
import { symptomLabels } from '../lib/symptoms'
import type { FollowUpCheckIn, PreconsultaDraft } from '../types'

const labels = ['A las 6 horas', 'A las 24 horas', 'A los 3 días']

export const FollowUp = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { draft, history, createFollowUpPlan, updateFollowUp } = usePreconsulta()
  const [entry, setEntry] = useState<PreconsultaDraft | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const found = history.find((h) => h.id === id) ?? (draft.id === id ? draft : null)
    if (!found) return
    if (!initialized && !found.followUps.length) {
      createFollowUpPlan(found.id)
      setInitialized(true)
      return
    }
    setEntry(found)
  }, [draft, history, id, initialized, createFollowUpPlan])

  useEffect(() => {
    if (!entry && id && draft.id === id) setEntry(draft)
  }, [draft, entry, id])

  const triage = useMemo(() => {
    if (entry?.triage) return entry.triage
    return entry ? calculateTriage(entry).level : null
  }, [entry])

  if (!entry) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-700">No encontramos ese seguimiento.</p>
        <SecondaryButton onClick={() => navigate('/historial')} className="px-3 py-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Volver al historial
        </SecondaryButton>
      </div>
    )
  }

  const hasAlert = entry.followUps.some((c) => c.outcome === 'peor')

  const handleOutcome = (check: FollowUpCheckIn, outcome: FollowUpCheckIn['outcome']) => {
    updateFollowUp(entry.id, check.id, { outcome, status: 'completado' })
  }

  const handleNotes = (check: FollowUpCheckIn, notes: string) => {
    updateFollowUp(entry.id, check.id, { notes })
  }

  return (
    <div className="space-y-6">
      <AppBar
        step="Seguimiento"
        title="Check-ins programados"
        subtitle="Te avisamos para ver cómo sigue"
        right={
          <div className="flex items-center gap-2">
            <SymptomPill symptom={entry.symptom} />
            <SeverityBadge level={triage} />
          </div>
        }
      />

      {hasAlert && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Recomendamos contactar a tu veterinaria.
        </div>
      )}

      <Card className="space-y-3 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Clock3 className="h-4 w-4" />
          Seguimiento de {entry.symptom ? symptomLabels[entry.symptom] : 'síntoma'}
        </div>
        <div className="space-y-3">
          {entry.followUps.map((check, idx) => (
            <div
              key={check.id}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-gray-900">{labels[idx] ?? 'Check-in'}</div>
                <span className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 bg-white">
                  {statusLabel(check.status)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Programado: {new Date(check.scheduledAt).toLocaleString('es-UY')}
              </div>
              <div className="mt-3 text-sm font-semibold text-gray-800">¿Cómo sigue tu perro?</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(['mejor', 'igual', 'peor'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOutcome(check, option)}
                    className={`rounded-full px-4 py-2 text-sm min-h-[44px] transition w-full ${check.outcome === option
                        ? 'border border-teal-600 bg-[#e3f1f2] text-gray-900'
                        : 'border border-dashed border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {option === 'mejor' ? 'Mejor' : option === 'igual' ? 'Igual' : 'Peor'}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <MessageCircle className="h-4 w-4" />
                Comentarios adicionales…
              </div>
              <textarea
                value={check.notes}
                onChange={(e) => handleNotes(check, e.target.value)}
                placeholder="Comentarios adicionales…"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-inner shadow-black/5"
                rows={2}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <SecondaryButton
          onClick={() => navigate('/historial')}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al historial
        </SecondaryButton>
      </div>
    </div>
  )
}
