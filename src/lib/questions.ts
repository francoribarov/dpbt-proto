import type { SymptomKey } from '../types'

export type Question =
  | {
      id: string
      prompt: string
      type: 'chips'
      options: string[]
      required?: boolean
    }
  | {
      id: string
      prompt: string
      type: 'number'
      min: number
      max: number
      required?: boolean
    }
  | {
      id: string
      prompt: string
      type: 'text'
      placeholder?: string
      required?: boolean
    }

export const questionSets: Record<SymptomKey, Question[]> = {
  picazon: [
    {
      id: 'picazon_inicio',
      prompt: '¿Hace cuánto empezó?',
      type: 'chips',
      options: ['Hoy', '1–3 días', '1 semana', 'Más de 1 semana'],
      required: true,
    },
    {
      id: 'picazon_intensidad',
      prompt: '¿Qué tan intensa es la picazón?',
      type: 'chips',
      options: ['Leve', 'Media', 'Fuerte'],
      required: true,
    },
    {
      id: 'picazon_zonas',
      prompt: '¿Tiene zonas sin pelo o rojas?',
      type: 'chips',
      options: ['Sí', 'No'],
      required: true,
    },
    {
      id: 'picazon_cambio',
      prompt: '¿Cambió algo recientemente?',
      type: 'text',
      placeholder: 'Ej.: comida, shampoo, parque…',
      required: true,
    },
  ],
  letargo: [
    {
      id: 'letargo_tiempo',
      prompt: '¿Hace cuánto está así?',
      type: 'chips',
      options: ['Horas', '1–2 días', '3–7 días', 'Más de 1 semana'],
      required: true,
    },
    {
      id: 'letargo_ingesta',
      prompt: '¿Come y toma agua normal?',
      type: 'chips',
      options: ['Sí', 'Menos de lo normal', 'Casi nada'],
      required: true,
    },
    {
      id: 'letargo_fiebre',
      prompt: '¿Tiene fiebre o temblores?',
      type: 'chips',
      options: ['Sí', 'No', 'No estoy seguro'],
      required: true,
    },
    {
      id: 'letargo_evento',
      prompt: '¿Hubo algún evento reciente?',
      type: 'text',
      placeholder: 'Ej.: golpe, viaje, estrés…',
      required: true,
    },
  ],
  vomitos: [
    {
      id: 'vomitos_cantidad',
      prompt: '¿Cuántas veces vomitó?',
      type: 'number',
      min: 0,
      max: 10,
      required: true,
    },
    {
      id: 'vomitos_tipo',
      prompt: '¿Cómo es el vómito?',
      type: 'chips',
      options: ['Comida', 'Espuma', 'Amarillo/verde', 'Con sangre'],
      required: true,
    },
    {
      id: 'vomitos_estado',
      prompt: '¿Está decaído?',
      type: 'chips',
      options: ['No', 'Un poco', 'Sí'],
      required: true,
    },
    {
      id: 'vomitos_agua',
      prompt: '¿Puede tomar agua?',
      type: 'chips',
      options: ['Sí', 'Poco', 'No'],
      required: true,
    },
  ],
  dolor_caminar: [
    {
      id: 'dolor_pata',
      prompt: '¿Qué pata le duele?',
      type: 'chips',
      options: ['Delantera', 'Trasera', 'No sé'],
      required: true,
    },
    {
      id: 'dolor_apoyo',
      prompt: '¿Cojea o evita apoyar?',
      type: 'chips',
      options: ['Cojea un poco', 'No apoya', 'Solo a veces'],
      required: true,
    },
    {
      id: 'dolor_golpe',
      prompt: '¿Hubo golpe o caída?',
      type: 'chips',
      options: ['Sí', 'No', 'No estoy seguro'],
      required: true,
    },
    {
      id: 'dolor_tiempo',
      prompt: '¿Hace cuánto?',
      type: 'chips',
      options: ['Hoy', '1–3 días', '1 semana', 'Más tiempo'],
      required: true,
    },
  ],
}
