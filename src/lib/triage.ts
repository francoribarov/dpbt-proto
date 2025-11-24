import type { PreconsultaDraft } from '../types'

export type TriageResult = {
  level: 'verde' | 'amarillo' | 'rojo'
  reason: string
}

export const calculateTriage = (draft: PreconsultaDraft): TriageResult => {
  const answers = draft.answers
  const symptom = draft.symptom

  if (symptom === 'vomitos') {
    const tipo = String(answers['vomitos_tipo'] ?? '')
    const agua = String(answers['vomitos_agua'] ?? '')
    if (tipo === 'Con sangre') {
      return { level: 'rojo', reason: 'Vómitos con sangre declarados.' }
    }
    if (agua === 'No') {
      return { level: 'rojo', reason: 'No puede mantener agua.' }
    }
    if (agua === 'Poco') {
      return { level: 'amarillo', reason: 'Toma poca agua, riesgo de deshidratación.' }
    }
  }

  if (symptom === 'letargo') {
    const ingesta = String(answers['letargo_ingesta'] ?? '')
    if (ingesta === 'Casi nada') {
      return { level: 'rojo', reason: 'Casi no come ni toma agua.' }
    }
    if (ingesta === 'Menos de lo normal') {
      return { level: 'amarillo', reason: 'Disminución de ingesta reportada.' }
    }
  }

  if (symptom === 'dolor_caminar') {
    const apoyo = String(answers['dolor_apoyo'] ?? '')
    if (apoyo === 'No apoya') {
      return { level: 'amarillo', reason: 'No apoya la pata afectada.' }
    }
  }

  if (symptom === 'picazon') {
    const intensidad = String(answers['picazon_intensidad'] ?? '')
    const inicio = String(answers['picazon_inicio'] ?? '')
    if (intensidad === 'Fuerte' && inicio === 'Más de 1 semana') {
      return { level: 'amarillo', reason: 'Picazón fuerte y prolongada.' }
    }
  }

  return { level: 'verde', reason: 'Sin signos de alarma declarados.' }
}
