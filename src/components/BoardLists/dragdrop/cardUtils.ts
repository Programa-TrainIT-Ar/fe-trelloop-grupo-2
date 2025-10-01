import { Card } from "./types";

export const getPriorityColor = (prioridad?: string) => {
  switch (prioridad?.toLowerCase()) {
    case "alta": return "border-[#A70000]";
    case "media": return "border-[#DF8200]";
    case "baja": return "border-[#667085]";
    default: return "border-purple-600";
  }
};

export const getVisibleTags = (tags?: Array<{ name: string }>) => {
  if (!tags) return [];
  const maxChars = 45;
  const maxTags = 2;
  let total = 0;
  const visibles: string[] = [];
  for (const tag of tags) {
    if (visibles.length >= maxTags) break;
    const lengthWithSpace = tag.name.length + (visibles.length > 0 ? 1 : 0);
    if (total + lengthWithSpace <= maxChars) {
      visibles.push(tag.name);
      total += lengthWithSpace;
    } else break;
  }
  return visibles;
};
