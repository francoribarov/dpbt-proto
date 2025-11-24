# Pretotipo · Preconsulta veterinaria

Prototipo clickeable en React + Vite + TypeScript con Tailwind (estilo gris low-fi) para testear la preconsulta por síntoma con adjuntos, resumen automático, recomendaciones iniciales (prototipo) y seguimiento.

## Cómo correrlo localmente
1. Node 18+ instalado.
2. Instalar deps: `npm install`
3. Levantar en modo dev: `npm run dev` y abrir el enlace que muestra Vite.
4. Build opcional: `npm run build` (genera en `dist/`).

## Qué está mockeado
- No hay backend ni subida real de archivos: se guardan solo metadatos (nombre, tipo, tamaño) en `localStorage`.
- “Generar resumen clínico” usa `setTimeout` para simular demora y una función determinística (`lib/summary.ts`).
- “Recomendaciones iniciales” son reglas fijas por síntoma + triage (`lib/recommendations.ts`). Sin dosis, solo mensajes de ejemplo con disclaimer visible.
- Slots de agenda en “Sugerir turno” son falsos y solo sirven para testear preferencia.
- Seguimiento: los check-ins se crean y guardan en `localStorage` sin notificaciones reales (`lib/followup.ts`).
- Historial simple: se guarda el borrador final y su seguimiento en `localStorage` para reabrirlo en `/historial`.
- Botón “Reset datos” en el header borra borradores e historial locales.

## Flujo y rutas
- `/preconsulta/sintoma` → selección de síntoma (buscable).
- `/preconsulta/multimedia` → adjuntar fotos/videos (metadatos, se pueden quitar).
- `/preconsulta/preguntas` → preguntas adaptativas según síntoma (chips, stepper numérico, texto).
- `/preconsulta/revision` → revisión + triage automático transparente (nota de orientación).
- `/preconsulta/resumen` → resumen listo para copiar/descargar (PDF de texto) + recomendaciones iniciales con disclaimer; CTA de turno si severidad alta o registro de seguimiento si verde.
- `/seguimiento/:id` → check-ins simulados (6h, 24h, 3 días) con estados Pendiente/Completado.
- `/historial` → lista de preconsultas guardadas con vista solo lectura y acceso al seguimiento.

## Reglas de triage (deterministas)
- Vómitos `Con sangre` o `No puede tomar agua` → **Rojo**.
- Vómitos `Toma poca agua` → **Amarillo**.
- Letargo con ingesta `Casi nada` → **Rojo**; `Menos de lo normal` → **Amarillo**.
- Dolor al caminar con `No apoya` → **Amarillo**.
- Picazón `Fuerte` y `Más de 1 semana` → **Amarillo**.
- Caso contrario → **Verde**.

## Reglas del resumen automático y recomendaciones
- El resumen usa síntoma + respuestas clave (inicio, intensidad, hallazgos) + conteo de adjuntos y triage calculado.
- Las recomendaciones son rule-based por síntoma y triage (ver `lib/recommendations.ts`); la sección de medicación siempre muestra un disclaimer y no incluye dosis. Para triage Rojo: “No se recomienda medicar en casa. Consultá urgente.”
- Ejemplo de formato de resumen:  
  `Motivo de consulta: Vómitos. Episodios: 3. Características: espuma. Estado general: un poco decaído. Puede tomar agua: Toma poca agua. Adjuntos: 2 fotos, 1 video. Triage sugerido: Amarillo — Toma poca agua, riesgo de deshidratación.`

## Importante (seguridad)
- Es un prototipo, no un diagnóstico ni guía médica real.
- No se muestran dosis. Siempre se debe consultar a la veterinaria antes de medicar.
