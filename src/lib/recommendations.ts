import type { Recommendation, SymptomKey } from "../types";

type Level = "verde" | "amarillo" | "rojo";

export const buildRecommendations = (
  symptom: SymptomKey,
  triage: Level
): Recommendation => {
  if (triage === "rojo") {
    return {
      cuidados: getCuidados(symptom),
      medicacion: ["No se recomienda medicar en casa. Consultá urgente."],
      urgente: getUrgente(symptom, triage),
    };
  }

  return {
    cuidados: getCuidados(symptom),
    medicacion: [...getMedicacion(symptom, triage)],
    urgente: getUrgente(symptom, triage),
  };
};

const getCuidados = (symptom: SymptomKey): string[] => {
  switch (symptom) {
    case "picazon":
      return [
        "Evitá que se rasque (collar isabelino si tenés).",
        "Revisá pulgas/ácaros y cambios recientes.",
      ];
    case "letargo":
      return [
        "Mantenelo en reposo y observá hidratación.",
        "Ofrecé agua fresca y comida liviana.",
      ];
    case "vomitos":
      return [
        "Ayuno corto de comida sólida según tolerancia.",
        "Agua en pequeñas cantidades frecuentes.",
      ];
    case "dolor_caminar":
      return [
        "Reposo y evitar saltos/escaleras.",
        "Aplicar frío local suave si parece inflamado.",
      ];
  }
};

const getMedicacion = (symptom: SymptomKey, triage: Level): string[] => {
  switch (symptom) {
    case "picazon":
      return [
        "Antipulgas/antiparasitario habitual (si ya usás uno).",
        "Baño con shampoo hipoalergénico para perros.",
      ];
    case "letargo":
      if (triage === "verde")
        return ["No medicar de inicio. Priorizar observación."];
      return ["No medicar sin consulta. Considerar control veterinario."];
    case "vomitos":
      if (triage === "verde") return ["No medicar de inicio. Observación."];
      if (triage === "amarillo")
        return ["Antiemético SOLO si tu veterinaria ya lo indicó antes."];
      return ["No medicar en casa."];
    case "dolor_caminar":
      if (triage === "verde") return ["No dar analgésicos humanos."];
      if (triage === "amarillo")
        return [
          "Analgesia SOLO si fue recetada previamente por tu veterinaria.",
        ];
      return ["No medicar en casa."];
  }
};

const getUrgente = (symptom: SymptomKey, triage: Level): string[] => {
  switch (symptom) {
    case "picazon":
      if (triage === "amarillo")
        return ["Si empeora o hay heridas abiertas, pedí turno en 24–48 hs."];
      if (triage === "rojo") return ["Consultá hoy mismo."];
      return [""];
    case "letargo":
      if (triage === "amarillo")
        return ["Si no mejora en 24 hs, pedí consulta."];
      if (triage === "rojo") return ["Consultá urgente."];
      return [""];
    case "vomitos":
      if (triage === "amarillo") return ["Consulta recomendada en 24 hs."];
      if (triage === "rojo") return ["Urgencia inmediata."];
      return [""];
    case "dolor_caminar":
      if (triage === "amarillo") return ["Pedí turno en 24–48 hs."];
      if (triage === "rojo") return ["Consultá hoy."];
      return [""];
  }
};
