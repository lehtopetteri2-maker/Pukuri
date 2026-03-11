import { useState } from "react";
import { AgeGroup } from "@/lib/weatherData";

interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
}

const checklistByAge: Record<AgeGroup, ChecklistItem[]> = {
  vauva: [
    { id: "vaippapaketti", label: "Vaippapaketti", emoji: "🧷" },
    { id: "tutti", label: "Tutti", emoji: "🍼" },
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "varaBody", label: "Varabody", emoji: "👶" },
    { id: "unilelu", label: "Unilelu", emoji: "🧸" },
    { id: "aurinkorasva", label: "Aurinkorasva", emoji: "☀️" },
  ],
  taapero: [
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "varaHousut", label: "Varahousut", emoji: "👖" },
    { id: "vaippapaketti", label: "Vaippapaketti", emoji: "🧷" },
    { id: "vesipullo", label: "Vesipullo", emoji: "💧" },
    { id: "unilelu", label: "Unilelu", emoji: "🧸" },
    { id: "aurinkorasva", label: "Aurinkorasva", emoji: "☀️" },
  ],
  "leikki-ikäinen": [
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "varaHousut", label: "Varahousut", emoji: "👖" },
    { id: "vesipullo", label: "Vesipullo", emoji: "💧" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
    { id: "luistimet", label: "Luistimet", emoji: "⛸️" },
    { id: "aurinkorasva", label: "Aurinkorasva", emoji: "☀️" },
  ],
  koululainen: [
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
    { id: "vesipullo", label: "Vesipullo", emoji: "💧" },
    { id: "avaimet", label: "Avaimet", emoji: "🔑" },
    { id: "luistimet", label: "Luistimet", emoji: "⛸️" },
  ],
};

interface DaycareChecklistProps {
  ageGroup: AgeGroup;
}

export default function DaycareChecklist({ ageGroup }: DaycareChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const isSummer = () => {
    const month = new Date().getMonth(); // 0-indexed
    return month >= 5 && month <= 7; // kesä (6), heinä (7), elo (8)
  };

  const baseItems = checklistByAge[ageGroup];
  const items = isSummer()
    ? [...baseItems, { id: "aurinkorasva", label: "Aurinkorasva", emoji: "☀️" }]
    : baseItems;
  const allDone = items.every((i) => checked.has(i.id));

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-700 text-foreground">🎒 Päiväkoti-reppu</h2>
        {allDone && (
          <span className="text-xs font-medium bg-primary/15 text-primary px-2 py-1 rounded-full">
            ✅ Kaikki pakattu!
          </span>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isDone = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all duration-150 text-left ${
                isDone
                  ? "bg-mint-light/60 border-primary/20 opacity-70"
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isDone ? "bg-primary border-primary" : "border-muted-foreground/40"
                }`}
              >
                {isDone && <span className="text-primary-foreground text-xs">✓</span>}
              </div>
              <span className="text-lg">{item.emoji}</span>
              <span
                className={`text-sm font-medium ${
                  isDone ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
