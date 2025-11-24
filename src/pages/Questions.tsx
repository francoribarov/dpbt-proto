import { ChevronLeft, ListChecks } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Card, PrimaryButton, SecondaryButton } from '../components/ui'
import { ChoiceChip } from '../components/ChoiceChip'
import { Stepper } from '../components/Stepper'
import { SymptomPill } from '../components/SymptomPill'
import { usePreconsulta } from '../context/PreconsultaContext'
import { questionSets } from '../lib/questions'
import type { Question } from '../lib/questions'

const isAnswered = (question: Question, value: unknown) => {
  if (question.type === 'text') return typeof value === 'string' && value.trim().length > 0
  if (question.type === 'number') return typeof value === 'number'
  return typeof value === 'string' && value.length > 0
}

export const Questions = () => {
  const { draft, updateAnswer } = usePreconsulta()
  const navigate = useNavigate()

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

  if (!draft.symptom) return null

  return (
    <div className="space-y-6">
      <AppBar
        step="Paso 3"
        title="Contanos más"
        subtitle="Responde solo lo necesario"
        right={<SymptomPill symptom={draft.symptom} />}
      />

      <Card className="p-5 space-y-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <ListChecks className="h-4 w-4" />
          Preguntas adaptadas
        </div>
        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="space-y-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-4"
            >
              <div className="text-base font-semibold text-gray-900">{question.prompt}</div>
              {question.type === 'chips' && (
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <ChoiceChip
                      key={option}
                      label={option}
                      selected={draft.answers[question.id] === option}
                      onSelect={() => updateAnswer(question.id, option)}
                    />
                  ))}
                </div>
              )}
              {question.type === 'number' && (
                <Stepper
                  value={Number(draft.answers[question.id] ?? question.min)}
                  min={question.min}
                  max={question.max}
                  onChange={(val) => updateAnswer(question.id, val)}
                />
              )}
              {question.type === 'text' && (
                <input
                  type="text"
                  placeholder={question.placeholder}
                  value={String(draft.answers[question.id] ?? '')}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-gray-800 placeholder:text-gray-500 shadow-inner shadow-black/5"
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SecondaryButton onClick={() => navigate('/preconsulta/multimedia')}>
          <ChevronLeft className="h-4 w-4" />
          Atrás
        </SecondaryButton>
        <PrimaryButton onClick={() => navigate('/preconsulta/revision')} disabled={!allAnswered}>
          Continuar
        </PrimaryButton>
      </div>
    </div>
  )
}
