import { Camera, ChevronLeft, FileVideo, Lightbulb } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Card, PrimaryButton, SecondaryButton } from '../components/ui'
import { MediaList } from '../components/MediaList'
import { SymptomPill } from '../components/SymptomPill'
import { usePreconsulta } from '../context/PreconsultaContext'
import type { MediaItem } from '../types'

export const MediaUpload = () => {
  const { draft, addMedia, removeMedia } = usePreconsulta()
  const navigate = useNavigate()
  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!draft.symptom) {
      navigate('/preconsulta/sintoma', { replace: true })
    }
  }, [draft.symptom, navigate])

  const createId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  const toMetadata = (file: File, kind: MediaItem['kind']): MediaItem => ({
    id: createId(),
    kind,
    name: file.name,
    sizeKB: Math.max(1, Math.round(file.size / 1024)),
  })

  const handleFiles = (files: FileList | null, kind: MediaItem['kind']) => {
    if (!files?.length) return
    const items = Array.from(files).map((file) => toMetadata(file, kind))
    addMedia(items)
  }

  return (
    <div className="space-y-6">
      <AppBar
        step="Paso 2"
        title="Adjuntar evidencia"
        subtitle="Podés agregar fotos o videos del síntoma"
        right={<SymptomPill symptom={draft.symptom} />}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <SecondaryButton
          onClick={() => photoInputRef.current?.click()}
          className="w-full sm:w-auto"
        >
          <Camera className="h-4 w-4" />
          Agregar foto
        </SecondaryButton>
        <SecondaryButton
          onClick={() => videoInputRef.current?.click()}
          className="w-full sm:w-auto"
        >
          <FileVideo className="h-4 w-4" />
          Agregar video
        </SecondaryButton>
        <input
          type="file"
          accept="image/*"
          ref={photoInputRef}
          className="hidden"
          multiple
          onChange={(e) => {
            handleFiles(e.target.files, 'foto')
            if (e.target) e.target.value = ''
          }}
        />
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          className="hidden"
          multiple
          onChange={(e) => {
            handleFiles(e.target.files, 'video')
            if (e.target) e.target.value = ''
          }}
        />
      </div>

      <Card className="p-4">
        <div className="mb-3 text-sm font-semibold text-gray-800">Adjuntos</div>
        <MediaList items={draft.media} onRemove={removeMedia} />
      </Card>

      <Card className="border-dashed bg-[#fffaf4] p-4 text-sm text-gray-700">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          Checklist rápida
        </div>
        <ul className="grid gap-2 text-gray-600 sm:grid-cols-3">
          <li>• Que se vea bien el síntoma</li>
          <li>• Buena luz</li>
          <li>• Si es video, 10–20 segundos</li>
        </ul>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SecondaryButton
          onClick={() => navigate('/preconsulta/sintoma')}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          Atrás
        </SecondaryButton>
        <PrimaryButton
          onClick={() => navigate('/preconsulta/preguntas')}
          className="w-full sm:w-auto"
        >
          Continuar
        </PrimaryButton>
      </div>
    </div>
  )
}
