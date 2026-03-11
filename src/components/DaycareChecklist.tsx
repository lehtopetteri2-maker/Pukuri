import { useState, useMemo, useEffect, useCallback } from "react";
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

/** Fixed daily items per age group (always shown) */
const dailyFixedByAge: Record<AgeGroup, ChecklistItem[]> = {
  vauva: [
    { id: "vaippapaketti", label: "Vaippapaketti", emoji: "🧷" },
    { id: "tutti", label: "Tutti", emoji: "🍼" },
    { id: "unilelu", label: "Unilelu", emoji: "🧸" },
  ],
  taapero: [
    { id: "juomapullo", label: "Juomapullo", emoji: "💧" },
    { id: "omalelu", label: "Oma lelu", emoji: "🧸" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
  ],
  "leikki-ikäinen": [
    { id: "juomapullo", label: "Juomapullo", emoji: "💧" },
    { id: "omalelu", label: "Oma lelu", emoji: "🧸" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
  ],
  koululainen: [
    { id: "avaimet", label: "Avaimet", emoji: "🔑" },
    { id: "välipala", label: "Välipala", emoji: "🍎" },
    { id: "uikkarit", label: "Uikkarit & pyyhe", emoji: "🩱" },
    { id: "sisäliikunta", label: "Sisäliikuntavaatteet & pyyhe", emoji: "🏃" },
  ],
};

function getDayReminder(): string | null {
  const day = new Date().getDay();
  const hour = new Date().getHours();
  if (day === 5) return "📋 Muista tyhjentää reppu viikonlopuksi ja tarkistaa vaihtovaatteiden määrä!";
  if (day === 0) return "👕 Huomenna on maanantai — muista pakata vaihtovaatteet päiväkotiin!";
  if (day === 1 && hour < 12) return "👕 Muista viedä vaihtovaatteet takaisin päiväkotiin tänään!";
  return null;
}

function getStorageKey(ageGroup: AgeGroup, type: "checked" | "note") {
  return `daycare-checklist-${ageGroup}-${type}`;
}
function loadChecked(ag: AgeGroup): Set<string> {
  try { const r = localStorage.getItem(getStorageKey(ag, "checked")); return r ? new Set(JSON.parse(r)) : new Set(); } catch { return new Set(); }
}
function saveChecked(ag: AgeGroup, s: Set<string>) { localStorage.setItem(getStorageKey(ag, "checked"), JSON.stringify([...s])); }
function loadNote(ag: AgeGroup): string { return localStorage.getItem(getStorageKey(ag, "note")) || ""; }
function saveNote(ag: AgeGroup, n: string) { localStorage.setItem(getStorageKey(ag, "note"), n); }

interface DaycareChecklistProps {
  ageGroup: AgeGroup;
  weather: WeatherData;
}

export default function DaycareChecklist({ ageGroup, weather }: DaycareChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked(ageGroup));
  const [note, setNote] = useState(() => loadNote(ageGroup));

  useEffect(() => { setChecked(loadChecked(ageGroup)); setNote(loadNote(ageGroup)); }, [ageGroup]);
  useEffect(() => { saveChecked(ageGroup, checked); }, [checked, ageGroup]);
  useEffect(() => { saveNote(ageGroup, note); }, [note, ageGroup]);

  // Daily fixed items — add UV-dependent sunscreen for taapero/leikki-ikäinen
  const dailyItems = useMemo(() => {
    const base = [...dailyFixedByAge[ageGroup]];
    const ids = new Set(base.map((i) => i.id));
    const add = (id: string, label: string, emoji: string) => { if (!ids.has(id)) { base.push({ id, label, emoji }); ids.add(id); } };

    const uv = weather.uvi ?? 0;
    if ((ageGroup === "taapero" || ageGroup === "leikki-ikäinen" || ageGroup === "vauva") && uv >= 3) {
      add("aurinkorasva", "Aurinkorasva", "☀️");
    }
    return base;
  }, [ageGroup, weather.uvi]);

  // Weather-dependent items
  const weatherItems = useMemo(() => {
    const items: ChecklistItem[] = [];
    const ids = new Set<string>();
    const add = (id: string, label: string, emoji: string) => { if (!ids.has(id)) { items.push({ id, label, emoji }); ids.add(id); } };

    const temp = weather.temperature;
    const isRainy = weather.rainProbability > 40 || weather.afternoonRain;

    if (temp > 10) add("lippis", "Lippis/Hattu", "🧢");
    if (isRainy) { add("kuravarusteet", "Kuravarusteet", "🌧️"); add("vaihtohanskat", "Vaihtohanskat", "🧤"); }
    if (temp < 10) add("lamminkerrasto", "Lämmin kerrasto", "🧶");
    if ((ageGroup === "leikki-ikäinen" || ageGroup === "koululainen") && temp < 0) {
      add("luistimet", "Luistimet & kypärä", "⛸️");
    }
    return items;
  }, [ageGroup, weather.temperature, weather.rainProbability, weather.afternoonRain]);

  const dayReminder = getDayReminder();
  const allItems = [...dailyItems, ...weatherItems, ...SPARE_CLOTHES];
  const allDone = allItems.every((i) => checked.has(i.id));

  const toggle = useCallback((id: string) => {
    setChecked((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }, []);

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
        <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
          {isDone && <span className="text-primary-foreground text-xs">✓</span>}
        </div>
        <span className="text-lg">{item.emoji}</span>
        <span className={`text-sm ${muted ? "font-normal" : "font-medium"} ${isDone ? "line-through text-muted-foreground" : muted ? "text-muted-foreground" : "text-foreground"}`}>
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
          <span className="text-xs font-medium bg-primary/15 text-primary px-2 py-1 rounded-full">✅ Kaikki pakattu!</span>
        )}
      </div>

      {dayReminder && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 p-3 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <span className="text-sm text-foreground">{dayReminder}</span>
        </div>
      )}

      {/* ── Päivittäiset tavarat ── */}
      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 mb-4">
        <h3 className="text-xs font-display font-700 text-primary uppercase tracking-wide mb-3">
          ☀️ Päivittäiset tavarat
        </h3>
        <div className="space-y-2">
          {dailyItems.map((item) => renderItem(item))}
        </div>

        {/* Oma muistiinpano */}
        <div className="mt-3">
          <label htmlFor={`note-${ageGroup}`} className="text-xs font-display font-600 text-muted-foreground uppercase tracking-wide mb-1.5 block">
            📝 Oma muistiinpano
          </label>
          <textarea
            id={`note-${ageGroup}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Kirjoita tähän oma tavara tai muistutus…"
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>
      </div>

      {/* ── Säänmukaiset varusteet ── */}
      {weatherItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-display font-700 text-muted-foreground uppercase tracking-wide mb-2">
            🌦️ Säänmukaiset varusteet
          </h3>
          <div className="space-y-2">
            {weatherItems.map((item) => renderItem(item))}
          </div>
        </div>
      )}

      {/* ── Varavaatteet (arkisto) ── */}
      <h3 className="text-xs font-display font-600 text-muted-foreground/70 uppercase tracking-wide mb-2">
        Varavaatteet (arkisto) — tarkista viikoittain
      </h3>
      <div className="space-y-1.5">
        {SPARE_CLOTHES.map((item) => renderItem(item, true))}
      </div>
    </div>
  );
}
