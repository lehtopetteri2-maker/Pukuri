import { useState, useMemo } from "react";
import { AgeGroup, WeatherData } from "@/lib/weatherData";
import { AlertTriangle } from "lucide-react";

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
  ],
  taapero: [
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "varaHousut", label: "Varahousut", emoji: "👖" },
    { id: "vaippapaketti", label: "Vaippapaketti", emoji: "🧷" },
    { id: "unilelu", label: "Unilelu", emoji: "🧸" },
  ],
  "leikki-ikäinen": [
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "varaHousut", label: "Varahousut", emoji: "👖" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
  ],
  koululainen: [
    { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
    { id: "varasukat", label: "Varasukat", emoji: "🧦" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
    { id: "avaimet", label: "Avaimet", emoji: "🔑" },
  ],
};

function getDayReminder(): string | null {
  const day = new Date().getDay(); // 0=su, 1=ma, 5=pe
  if (day === 5) return "📋 Muista tyhjentää reppu viikonlopuksi ja tarkistaa vaihtovaatteiden määrä!";
  if (day === 0) return "👕 Huomenna on maanantai — muista pakata vaihtovaatteet päiväkotiin!";
  if (day === 1 && new Date().getHours() < 12) return "👕 Muista viedä vaihtovaatteet takaisin päiväkotiin tänään!";
  return null;
}

interface DaycareChecklistProps {
  ageGroup: AgeGroup;
  weather: WeatherData;
}

export default function DaycareChecklist({ ageGroup, weather }: DaycareChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    const base = [...checklistByAge[ageGroup]];
    const ids = new Set(base.map((i) => i.id));

    const add = (id: string, label: string, emoji: string) => {
      if (!ids.has(id)) {
        base.push({ id, label, emoji });
        ids.add(id);
      }
    };

    const temp = weather.temperature;
    const isRainy = weather.rainProbability > 40 || weather.afternoonRain;

    // Lämmin sää > +10 °C
    if (temp > 10) {
      add("aurinkorasva", "Aurinkorasva", "☀️");
      add("lippis", "Lippis/Hattu", "🧢");
    }

    // Sade
    if (isRainy) {
      add("kuravarusteet", "Kuravarusteet", "🌧️");
      add("vaihtohanskat", "Vaihtohanskat", "🧤");
    }

    // Kylmä < +10 °C
    if (temp < 10) {
      add("varavillasukat", "Varavillasukat", "🧦");
      add("lamminkerrasto", "Lämmin kerrasto", "🧶");
    }

    // Kesäkausi (touko–elo)
    const month = new Date().getMonth();
    if (month >= 4 && month <= 7) {
      add("juomapullo", "Juomapullo", "💧");
    }

    return base;
  }, [ageGroup, weather.temperature, weather.rainProbability, weather.afternoonRain]);

  const dayReminder = getDayReminder();
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

      {dayReminder && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 p-3 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <span className="text-sm text-foreground">{dayReminder}</span>
        </div>
      )}

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
