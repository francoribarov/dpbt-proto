import type { PreconsultaDraft } from '../types'
import { calculateTriage } from './triage'
import type { TriageResult } from './triage'
import { symptomLabels } from './symptoms'

const formatSeverity = (level: TriageResult['level']) =>
  level === 'amarillo' ? 'Amarillo' : level === 'rojo' ? 'Rojo' : 'Verde'

export const buildSummaryText = (
  draft: PreconsultaDraft,
  triageResult?: TriageResult,
): string => {
  const triage = triageResult ?? calculateTriage(draft)
  const symptomLabel = draft.symptom ? symptomLabels[draft.symptom] : 'Sin síntoma'
  const mediaFotos = draft.media.filter((m) => m.kind === 'foto').length
  const mediaVideos = draft.media.filter((m) => m.kind === 'video').length
  const answers = draft.answers

  const lines: string[] = []
  lines.push(`Motivo de consulta: ${symptomLabel}.`)

  switch (draft.symptom) {
    case 'picazon':
      lines.push(`Inicio: ${answers['picazon_inicio'] ?? 'Sin dato'}.`)
      lines.push(`Intensidad: ${answers['picazon_intensidad'] ?? 'Sin dato'}.`)
      lines.push(`Lesiones visibles: ${answers['picazon_zonas'] ?? 'Sin dato'}.`)
      if (answers['picazon_cambio']) {
        lines.push(`Cambios recientes: ${answers['picazon_cambio']}.`)
      }
      break
    case 'letargo':
      lines.push(`Inicio: ${answers['letargo_tiempo'] ?? 'Sin dato'}.`)
      lines.push(`Ingesta: ${answers['letargo_ingesta'] ?? 'Sin dato'}.`)
      lines.push(`Fiebre/temblores: ${answers['letargo_fiebre'] ?? 'Sin dato'}.`)
      if (answers['letargo_evento']) {
        lines.push(`Evento reciente: ${answers['letargo_evento']}.`)
      }
      break
    case 'vomitos':
      lines.push(`Episodios: ${answers['vomitos_cantidad'] ?? 'Sin dato'}.`)
      lines.push(`Características: ${answers['vomitos_tipo'] ?? 'Sin dato'}.`)
      lines.push(`Estado general: ${answers['vomitos_estado'] ?? 'Sin dato'}.`)
      lines.push(`Puede tomar agua: ${answers['vomitos_agua'] ?? 'Sin dato'}.`)
      break
    case 'dolor_caminar':
      lines.push(`Pata afectada: ${answers['dolor_pata'] ?? 'Sin dato'}.`)
      lines.push(`Apoyo: ${answers['dolor_apoyo'] ?? 'Sin dato'}.`)
      lines.push(`Trauma: ${answers['dolor_golpe'] ?? 'Sin dato'}.`)
      lines.push(`Duración: ${answers['dolor_tiempo'] ?? 'Sin dato'}.`)
      break
    default:
      lines.push('Detalle: sin preguntas respondidas.')
      break
  }

  lines.push(`Adjuntos: ${mediaFotos} fotos, ${mediaVideos} videos.`)
  lines.push(
    `Triage sugerido: ${formatSeverity(triage.level)} — ${triage.reason || 'Evaluación automática.'}`,
  )

  return lines.join('\n')
}
