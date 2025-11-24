import { ArrowRight, FileText, Loader2, Pencil } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Card, PrimaryButton, SecondaryButton } from '../components/ui'
import { MediaList } from '../components/MediaList'
import { SeverityBadge } from '../components/SeverityBadge'
import { SymptomPill } from '../components/SymptomPill'
import { usePreconsulta } from '../context/PreconsultaContext'
import { questionSets } from '../lib/questions'
import type { Question } from '../lib/questions'
import { calculateTriage } from '../lib/triage'
import { symptomLabels } from '../lib/symptoms'

const isAnswered = (question: Question, value: unknown) => {
  if (question.type === 'text') return typeof value === 'string' && value.trim().length > 0
  if (question.type === 'number') return typeof value === 'number'
  return typeof value === 'string' && value.length > 0
}

export const Review = () => {
  const { draft, finalizeSummary } = usePreconsulta()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!draft.symptom) navigate('/preconsulta/sintoma', { replace: true })
  }, [draft.symptom, navigate])

  const questions = useMemo(
    () => (draft.symptom ? questionSets[draft.symptom] : []),
    [draft.symptom],
  )

  const allAnswered = useMemo(
    () => questions.every((q) => !q.required || isAnswered(q, draft.answers[q.id])),
    [questions, draft.answers],
  )

  const triagePreview = calculateTriage(draft)

  const onGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      finalizeSummary()
      setLoading(false)
      navigate('/preconsulta/resumen')
    }, 900)
  }

  if (!draft.symptom) return null

  return (
    <div className="space-y-6">
      <AppBar
        step="Paso 4"
        title="Revisá tu preconsulta"
        right={<SymptomPill symptom={draft.symptom} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">Respuestas</div>
            <SecondaryButton
              onClick={() => navigate('/preconsulta/preguntas')}
              className="text-xs px-3 py-2 min-h-[40px]"
            >
              <Pencil className="h-4 w-4" />
              Editar respuestas
            </SecondaryButton>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {questions.map((question) => (
              <div
                key={question.id}
                className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-3 py-3"
              >
                <div className="text-sm font-semibold text-gray-900">{question.prompt}</div>
                <div className="text-sm text-gray-700">{String(draft.answers[question.id])}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 text-sm font-semibold text-gray-800">Triage automático</div>
          <SeverityBadge level={triagePreview.level} />
          <p className="mt-2 text-sm text-gray-600">{triagePreview.reason}</p>
          <div className="mt-1 text-xs text-gray-500">
            Esto es una orientación automática, no un diagnóstico.
          </div>
          <div className="mt-2 text-xs text-gray-500">Regla simple y transparente.</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">Adjuntos</div>
          <div className="text-xs text-gray-500">Se guardan solo los nombres</div>
        </div>
        <MediaList items={draft.media} />
      </Card>

      <Card className="flex flex-col gap-3 rounded-2xl border border-gray-900 bg-gray-900 px-4 py-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />
          <div>
            <div className="text-sm font-semibold">Lista para enviar</div>
            <div className="text-xs text-gray-200">
              Síntoma: {symptomLabels[draft.symptom]} · {questions.length} respuestas
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/preconsulta/preguntas')}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/50 bg-transparent px-4 py-2 text-sm text-white shadow-sm transition hover:bg-white/10"
          >
            Editar
          </button>
          <PrimaryButton
            onClick={onGenerate}
            disabled={!allAnswered || loading}
            className="text-gray-900"
            style={{ backgroundColor: '#ffffff' }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Generar resumen clínico
          </PrimaryButton>
        </div>
      </Card>
    </div>
  )
}
