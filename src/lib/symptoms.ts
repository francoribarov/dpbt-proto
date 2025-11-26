import type { SymptomKey, SymptomOption } from "../types";

export const symptomLabels: Record<SymptomKey, string> = {
  picazon: "Picazón / se rasca mucho",
  letargo: "Cansancio / baja energía",
  vomitos: "Vómitos",
  dolor_caminar: "Dolor al caminar",
};

export const symptomOptions: SymptomOption[] = [
  { key: "picazon", label: symptomLabels.picazon },
  { key: "letargo", label: symptomLabels.letargo },
  { key: "vomitos", label: symptomLabels.vomitos },
  { key: "dolor_caminar", label: symptomLabels.dolor_caminar },
];
