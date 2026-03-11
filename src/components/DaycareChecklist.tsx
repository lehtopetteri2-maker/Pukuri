import { useState, useMemo } from "react";
import { AgeGroup, WeatherData } from "@/lib/weatherData";
import { AlertTriangle } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
}

const SPARE_CLOTHES: ChecklistItem[] = [
  { id: "varahousut", label: "Varahousut", emoji: "👖" },
  { id: "varapaita", label: "Varapaita", emoji: "👕" },
  { id: "alusvaatteet", label: "Alusvaatteet (2 kpl)", emoji: "🩲" },
  { id: "varahanskat", label: "Varahanskat", emoji: "🧤" },
  { id: "vaihtosukat", label: "Vaihtosukat", emoji: "🧦" },
];

const dailyBaseByAge: Record<AgeGroup, ChecklistItem[]> = {
  vauva: [
    { id: "vaippapaketti", label: "Vaippapaketti", emoji: "🧷" },
    { id: "tutti", label: "Tutti", emoji: "🍼" },
    { id: "unilelu", label: "Unilelu", emoji: "🧸" },
  ],
  taapero: [
    { id: "vaippapaketti", label: "Vaippapaketti", emoji: "🧷" },
    { id: "unilelu", label: "Unilelu", emoji: "🧸" },
  ],
  "leikki-ikäinen": [
    { id: "välipala", label: "Välipala", emoji: "🍎" },
  ],
  koululainen: [
    { id: "välipala", label: "Välipala", emoji: "🍎" },
    { id: "avaimet", label: "Avaimet", emoji: "🔑" },
  ],
};

function getDayReminder(): string | null {
  const day = new Date().getDay();
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

  const dailyItems = useMemo(() => {
    const base = [...dailyBaseByAge[ageGroup]];
    const ids = new Set(base.map((i) => i.id));

    const add = (id: string, label: string, emoji: string) => {
      if (!ids.has(id)) {
        base.push({ id, label, emoji });
        ids.add(id);
      }
    };

    const temp = weather.temperature;
    const isRainy = weather.rainProbability > 40 || weather.afternoonRain;

    if (temp > 10) {
      add("aurinkorasva", "Aurinkorasva", "☀️");
      add("lippis", "Lippis/Hattu", "🧢");
    }

    if (isRainy) {
      add("kuravarusteet", "Kuravarusteet", "🌧️");
      add("vaihtohanskat", "Vaihtohanskat", "🧤");
    }

    if (temp < 10) {
      add("lamminkerrasto", "Lämmin kerrasto", "🧶");
    }

    const month = new Date().getMonth();
    if (month >= 4 && month <= 7) {
      add("juomapullo", "Juomapullo", "💧");
    }

    return base;
  }, [ageGroup, weather.temperature, weather.rainProbability, weather.afternoonRain]);

  const dayReminder = getDayReminder();
  const allItems = [...dailyItems, ...SPARE_CLOTHES];
  const allDone = allItems.every((i) => checked.has(i.id));

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = (item: ChecklistItem, muted = false) => {
    const isDone = checked.has(item.id);
    return (
      <button
        key={item.id}
        onClick={() => toggle(item.id)}
        className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all duration-150 text-left ${
          isDone
            ? "bg-mint-light/60 border-primary/20 opacity-70"
            : muted
              ? "bg-muted/30 border-border/60 hover:bg-muted/50"
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
          className={`text-sm ${muted ? "font-normal" : "font-medium"} ${
            isDone ? "line-through text-muted-foreground" : muted ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {item.label}
        </span>
      </button>
    );
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

      {/* Päivittäiset & Ajankohtaiset */}
      <h3 className="text-xs font-display font-700 text-muted-foreground uppercase tracking-wide mb-2">
        Päivittäiset & Ajankohtaiset
      </h3>
      <div className="space-y-2 mb-5">
        {dailyItems.map((item) => renderItem(item))}
      </div>

      {/* Varavaatteet */}
      <h3 className="text-xs font-display font-600 text-muted-foreground/70 uppercase tracking-wide mb-2">
        Varavaatteet — tarkista viikoittain
      </h3>
      <div className="space-y-1.5">
        {SPARE_CLOTHES.map((item) => renderItem(item, true))}
      </div>
    </div>
  );
}
