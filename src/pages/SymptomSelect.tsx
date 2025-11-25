import { PawPrint, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Card, CardOption, InputSearch, PrimaryButton, SecondaryButton } from '../components/ui'
import { usePreconsulta } from '../context/PreconsultaContext'
import { symptomOptions } from '../lib/symptoms'

export const SymptomSelect = () => {
  const { draft, setSymptom, resetDraft } = usePreconsulta()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(
    () =>
      symptomOptions.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  )

  const onContinue = () => {
    if (draft.symptom) navigate('/preconsulta/multimedia')
  }

  const onNew = () => {
    resetDraft()
  }

  return (
    <div className="space-y-6">
      <AppBar
        step="Paso 1"
        title="Preconsulta"
        subtitle="¿Qué síntoma tiene tu perro?"
        right={
          <SecondaryButton onClick={onNew} className="w-full text-sm sm:w-auto">
            Iniciar borrador nuevo
          </SecondaryButton>
        }
      />

      <InputSearch
        value={query}
        onChange={setQuery}
        placeholder="Buscar síntoma…"
        icon={<Search className="h-5 w-5 text-gray-400" />}
      />

      <div className="flex items-center gap-2 text-gray-600">
        <PawPrint className="h-5 w-5 text-gray-700" />
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Síntomas frecuentes
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <CardOption
            key={item.key}
            title={item.label}
            selected={draft.symptom === item.key}
            onClick={() => setSymptom(item.key)}
          />
        ))}
        {!filtered.length && (
          <Card className="p-4 text-sm text-gray-500 border-dashed">
            No encontramos ese síntoma. Probá otra palabra.
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <PrimaryButton
          onClick={onContinue}
          disabled={!draft.symptom}
          className="w-full sm:w-auto"
        >
          Continuar
        </PrimaryButton>
      </div>
    </div>
  )
}
