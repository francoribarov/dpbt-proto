import { Clock4, Inbox } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Card, PrimaryButton, SecondaryButton } from '../components/ui'
import { SeverityBadge } from '../components/SeverityBadge'
import { usePreconsulta } from '../context/PreconsultaContext'
import { buildSummaryText } from '../lib/summary'
import {
  cloneTreatmentPlan,
  createEmptyMedication,
  createEmptyTreatmentPlan,
} from '../lib/treatmentPlan'
import { symptomLabels } from '../lib/symptoms'
import type { PreconsultaDraft, TreatmentMedication, TreatmentPlan } from '../types'

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
  const { history, updateTreatmentPlan } = usePreconsulta()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<PreconsultaDraft | null>(null)
  const [planDraft, setPlanDraft] = useState<TreatmentPlan>(() => createEmptyTreatmentPlan())

  useEffect(() => {
    if (history.length) setSelected(history[0])
  }, [history])

  useEffect(() => {
    if (!selected) {
      setPlanDraft(createEmptyTreatmentPlan())
      return
    }
    setPlanDraft(cloneTreatmentPlan(selected.treatmentPlan ?? createEmptyTreatmentPlan()))
  }, [selected])

  const basePlan = useMemo(
    () => selected?.treatmentPlan ?? createEmptyTreatmentPlan(),
    [selected],
  )

  const isDirty = useMemo(() => {
    if (!selected) return false
    return JSON.stringify(planDraft) !== JSON.stringify(basePlan)
  }, [basePlan, planDraft, selected])

  const handleMedicationChange = (
    medicationId: string,
    field: keyof TreatmentMedication,
    value: string,
  ) => {
    setPlanDraft((prev) => ({
      ...prev,
      medications: prev.medications.map((med) =>
        med.id === medicationId ? { ...med, [field]: value } : med,
      ),
    }))
  }

  const handleAddMedication = () => {
    setPlanDraft((prev) => ({
      ...prev,
      medications: [...prev.medications, createEmptyMedication()],
    }))
  }

  const handleRemoveMedication = (medicationId: string) => {
    setPlanDraft((prev) => ({
      ...prev,
      medications: prev.medications.filter((med) => med.id !== medicationId),
    }))
  }

  const handleNotesChange = (value: string) => {
    setPlanDraft((prev) => ({ ...prev, notes: value }))
  }

  const handleSavePlan = () => {
    if (!selected) return
    updateTreatmentPlan(selected.id, planDraft)
  }

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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${selected?.id === item.id
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

          <div className="space-y-4 lg:col-span-2">
            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Inbox className="h-4 w-4" />
                Resumen guardado
              </div>
              {selected ? (
                <>
                  <pre className="whitespace-pre-wrap rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                    {selected.summaryText ??
                      buildSummaryText(selected, {
                        level: selected.triage ?? 'verde',
                        reason: '',
                      })}
                  </pre>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-gray-600">
                      Seguimiento:{' '}
                      {selected.followUps.length ? `${selected.followUps.length} check-ins` : 'No creado'}
                    </div>
                    {selected.followUps.length > 0 && (
                      <SecondaryButton
                        onClick={() => navigate(`/seguimiento/${selected.id}`)}
                        className="w-full px-3 py-2 text-sm min-h-[40px] sm:w-auto"
                      >
                        Abrir seguimiento
                      </SecondaryButton>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Elegí un caso para ver el detalle.</p>
              )}
            </Card>

            {selected && (
              <Card className="space-y-4 p-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Plan de tratamiento</div>
                  <div className="text-xs text-gray-500">
                    Guardá los medicamentos, recordatorios y notas para el seguimiento.
                  </div>
                </div>
                {planDraft.medications.length ? (
                  <div className="space-y-3">
                    {planDraft.medications.map((med, idx) => (
                      <div key={med.id} className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">
                            Medicamento {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(med.id)}
                            className="text-xs font-semibold text-red-500 transition hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="grid gap-2 text-xs text-gray-700 sm:grid-cols-2">
                          <input
                            value={med.name}
                            onChange={(event) =>
                              handleMedicationChange(med.id, 'name', event.target.value)
                            }
                            placeholder="Nombre del medicamento"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none"
                          />
                          <input
                            value={med.dose}
                            onChange={(event) =>
                              handleMedicationChange(med.id, 'dose', event.target.value)
                            }
                            placeholder="Dosis / vía"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none"
                          />
                          <input
                            value={med.frequency}
                            onChange={(event) =>
                              handleMedicationChange(med.id, 'frequency', event.target.value)
                            }
                            placeholder="Frecuencia (ej: cada 12h)"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none"
                          />
                          <input
                            value={med.reminder}
                            onChange={(event) =>
                              handleMedicationChange(med.id, 'reminder', event.target.value)
                            }
                            placeholder="Recordatorio (ej: 8 hs, con comida)"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <textarea
                          value={med.notes}
                          onChange={(event) =>
                            handleMedicationChange(med.id, 'notes', event.target.value)
                          }
                          placeholder="Notas específicas del medicamento"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-inner shadow-black/5 focus:border-teal-500 focus:outline-none"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Agregá el medicamento y la frecuencia para tenerlo en tu seguimiento.
                  </p>
                )}
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Notas generales
                  </div>
                  <textarea
                    value={planDraft.notes}
                    onChange={(event) => handleNotesChange(event.target.value)}
                    placeholder="Completá información útil para recordarte el tratamiento"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-inner shadow-black/5 focus:border-teal-500 focus:outline-none"
                    rows={3}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <SecondaryButton onClick={handleAddMedication} type="button" className="w-full sm:w-auto">
                    Agregar medicamento
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleSavePlan}
                    disabled={!isDirty}
                    className="w-full sm:w-auto"
                  >
                    Guardar plan
                  </PrimaryButton>
                </div>
                <p className="text-xs text-gray-500">
                  Tus medicamentos se guardan con el historial y aparecen cuando revisás este caso.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
