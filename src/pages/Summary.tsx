import {
  Clipboard,
  Download,
  ExternalLink,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Card,
  InfoBox,
  PrimaryButton,
  SecondaryButton,
} from "../components/ui";
import { SeverityBadge } from "../components/SeverityBadge";
import { SymptomPill } from "../components/SymptomPill";
import { usePreconsulta } from "../context/PreconsultaContext";
import { buildSummaryText } from "../lib/summary";
import { calculateTriage } from "../lib/triage";
import { buildRecommendations } from "../lib/recommendations";

const mockSlots = [
  "Hoy 17:30 — Videollamada corta",
  "Mañana 10:00 — Presencial",
  "Mañana 15:30 — Videollamada",
  "Sábado 11:00 — Presencial",
];

export const Summary = () => {
  const { draft, resetDraft, createFollowUpPlan } = usePreconsulta();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [slotModal, setSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const triage = useMemo(() => {
    if (draft.triage) return { level: draft.triage, reason: "" };
    return calculateTriage(draft);
  }, [draft]);

  const [summaryText, setSummaryText] = useState(
    draft.summaryText ??
      buildSummaryText({ ...draft, triage: triage.level }, triage)
  );

  useEffect(() => {
    if (!draft.symptom) navigate("/preconsulta/sintoma", { replace: true });
  }, [draft.symptom, navigate]);

  useEffect(() => {
    if (draft.summaryText) {
      setSummaryText(draft.summaryText);
    } else {
      setSummaryText(
        buildSummaryText({ ...draft, triage: triage.level }, triage)
      );
    }
  }, [draft, triage]);

  if (!draft.symptom) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resumen-preconsulta.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const startNew = () => {
    resetDraft();
    navigate("/preconsulta/sintoma");
  };

  const goToFollowUp = () => {
    const plan = createFollowUpPlan(draft.id);
    if (!plan.length) return;
    navigate(`/seguimiento/${draft.id}`);
  };

  const severityLevel = triage.level;
  const recommendations = useMemo(
    () =>
      draft.recommendations ??
      (draft.symptom
        ? buildRecommendations(draft.symptom, severityLevel)
        : null),
    [draft.recommendations, draft.symptom, severityLevel]
  );

  return (
    <div className="space-y-6 pb-32 sm:pb-0">
      <AppBar
        step="Paso 5"
        title="Resumen clínico"
        subtitle="Podés enviarlo a tu veterinaria"
        right={
          <div className="flex items-center gap-2">
            <SymptomPill symptom={draft.symptom} />
            <SeverityBadge level={severityLevel} />
          </div>
        }
      />

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Sparkles className="h-4 w-4" />
          Resumen auto-generado
        </div>
        <pre className="whitespace-pre-wrap rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
          {summaryText}
        </pre>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <SecondaryButton onClick={handleCopy} className="w-full sm:w-auto">
            <Clipboard className="h-4 w-4" />
            {copied ? "Copiado" : "Copiar resumen"}
          </SecondaryButton>
          <PrimaryButton onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Descargar PDF
          </PrimaryButton>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Recomendaciones iniciales
            </div>
            <div className="text-xs text-gray-600">
              No sustituyen una consulta veterinaria
            </div>
          </div>
          <Stethoscope className="h-5 w-5 text-gray-600" />
        </div>
        {recommendations?.medicacion?.some((m) => m.includes("⚠️")) && (
          <InfoBox>
            {recommendations.medicacion.find((m) => m.includes("⚠️"))}
          </InfoBox>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 text-sm font-semibold text-gray-800">
              Cuidados en casa
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {(recommendations?.cuidados ?? [])
                .filter(Boolean)
                .map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 text-sm font-semibold text-gray-800">
              Medicación sugerida (prototipo)
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {(recommendations?.medicacion ?? [])
                .filter(Boolean)
                .map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 text-sm font-semibold text-gray-800">
              Cuándo consultar urgente
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {(recommendations?.urgente ?? [])
                .filter(Boolean)
                .map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 flex flex-col gap-2 border-t border-gray-200 bg-white p-4 sm:static sm:z-auto sm:border-none sm:bg-transparent sm:p-0 sm:flex-row sm:flex-wrap">
          {severityLevel === "verde" ? (
            <PrimaryButton onClick={goToFollowUp} className="w-full sm:w-auto">
              <ExternalLink className="h-4 w-4" />
              Registrar seguimiento
            </PrimaryButton>
          ) : (
            <SecondaryButton
              onClick={() => setSlotModal(true)}
              className="w-full sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" />
              Sugerir turno
            </SecondaryButton>
          )}
          <SecondaryButton onClick={startNew} className="w-full sm:w-auto">
            Iniciar nueva preconsulta
          </SecondaryButton>
        </div>
      </Card>

      {slotModal && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/30 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  Agenda simulada
                </div>
                <div className="text-xs text-gray-500">
                  Opciones falsas para testear preferencia de horario
                </div>
              </div>
              <button
                onClick={() => setSlotModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {mockSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                    selectedSlot === slot
                      ? "border-teal-700 bg-[#e3f1f2] text-gray-900"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <PrimaryButton
                onClick={() => setSlotModal(false)}
                disabled={!selectedSlot}
                className="w-full sm:w-auto"
              >
                Confirmar turno
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
