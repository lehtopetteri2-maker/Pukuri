import { AgeGroup } from "@/lib/weatherData";

interface AgeGroupToggleProps {
  selected: AgeGroup;
  onChange: (group: AgeGroup) => void;
}

const groups: { value: AgeGroup; label: string; emoji: string; ages: string }[] = [
  { value: "vauva", label: "Vauva", emoji: "👶", ages: "0–1 v" },
  { value: "taapero", label: "Taapero", emoji: "🧒", ages: "1–3 v" },
  { value: "koululainen", label: "Koululainen", emoji: "🎒", ages: "4–10 v" },
];

export default function AgeGroupToggle({ selected, onChange }: AgeGroupToggleProps) {
  return (
    <div className="flex gap-2">
      {groups.map((g) => (
        <button
          key={g.value}
          onClick={() => onChange(g.value)}
          className={`flex-1 rounded-lg px-3 py-3 text-center transition-all duration-200 border ${
            selected === g.value
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card text-foreground border-border hover:bg-muted"
          }`}
        >
          <div className="text-2xl mb-1">{g.emoji}</div>
          <div className="text-sm font-display font-700">{g.label}</div>
          <div className={`text-xs mt-0.5 ${selected === g.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {g.ages}
          </div>
        </button>
      ))}
    </div>
  );
}
