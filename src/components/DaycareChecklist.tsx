import { useState, useMemo, useEffect, useCallback } from "react";
import { AgeGroup, WeatherData } from "@/lib/weatherData";
import { AlertTriangle } from "lucide-react";
import { useLanguage, TranslationKey } from "@/lib/i18n";

interface ChecklistItem {
  id: string;
  labelKey: TranslationKey;
  emoji: string;
}

function getSpareClothes(): ChecklistItem[] {
  const month = new Date().getMonth() + 1; // 1-12
  const isReflectorSeason = month >= 9 || month <= 3; // Sep–Mar

  const items: ChecklistItem[] = [
    { id: "vaihtosukat", labelKey: "item.vaihtosukat", emoji: "🧦" },
    { id: "varahanskat", labelKey: "item.varahanskat", emoji: "🧤" },
    { id: "varapaita", labelKey: "item.varapaita", emoji: "👕" },
    { id: "varahousut", labelKey: "item.varahousut", emoji: "👖" },
    { id: "alusvaatteet", labelKey: "item.alusvaatteet", emoji: "🩲" },
  ];

  if (isReflectorSeason) {
    items.push({ id: "heijastin", labelKey: "item.heijastin" as any, emoji: "🔦" });
  }

  return items;
}

const miscByAge: Record<AgeGroup, ChecklistItem[]> = {
  vauva: [
    { id: "vaippapaketti", labelKey: "item.vaippapaketti", emoji: "🧷" },
    { id: "tutti", labelKey: "item.tutti", emoji: "🍼" },
    { id: "unilelu", labelKey: "item.unilelu", emoji: "🧸" },
    { id: "aurinkorasva", labelKey: "item.aurinkorasva", emoji: "☀️" },
  ],
  taapero: [
    { id: "juomapullo", labelKey: "item.juomapullo", emoji: "💧" },
    { id: "omalelu", labelKey: "item.omalelu", emoji: "🧸" },
    { id: "välipala", labelKey: "item.välipala", emoji: "🍎" },
    { id: "aurinkorasva", labelKey: "item.aurinkorasva", emoji: "☀️" },
  ],
  "leikki-ikäinen": [
    { id: "juomapullo", labelKey: "item.juomapullo", emoji: "💧" },
    { id: "omalelu", labelKey: "item.omalelu", emoji: "🧸" },
    { id: "välipala", labelKey: "item.välipala", emoji: "🍎" },
    { id: "aurinkorasva", labelKey: "item.aurinkorasva", emoji: "☀️" },
  ],
  koululainen: [
    { id: "avaimet", labelKey: "item.avaimet", emoji: "🔑" },
    { id: "välipala", labelKey: "item.välipala", emoji: "🍎" },
    { id: "uikkarit", labelKey: "item.uikkarit", emoji: "🩱" },
    { id: "sisäliikunta", labelKey: "item.sisäliikunta", emoji: "🏃" },
  ],
};

function getStorageKey(ag: AgeGroup, type: "checked" | "note") { return `daycare-checklist-${ag}-${type}`; }
function loadChecked(ag: AgeGroup): Set<string> { try { const r = localStorage.getItem(getStorageKey(ag, "checked")); return r ? new Set(JSON.parse(r)) : new Set(); } catch { return new Set(); } }
function saveChecked(ag: AgeGroup, s: Set<string>) { localStorage.setItem(getStorageKey(ag, "checked"), JSON.stringify([...s])); }
function loadNote(ag: AgeGroup): string { return localStorage.getItem(getStorageKey(ag, "note")) || ""; }
function saveNote(ag: AgeGroup, n: string) { localStorage.setItem(getStorageKey(ag, "note"), n); }

interface DaycareChecklistProps { ageGroup: AgeGroup; weather: WeatherData; }

export default function DaycareChecklist({ ageGroup, weather }: DaycareChecklistProps) {
  const { t } = useLanguage();
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked(ageGroup));
  const [note, setNote] = useState(() => loadNote(ageGroup));

  useEffect(() => { setChecked(loadChecked(ageGroup)); setNote(loadNote(ageGroup)); }, [ageGroup]);
  useEffect(() => { saveChecked(ageGroup, checked); }, [checked, ageGroup]);
  useEffect(() => { saveNote(ageGroup, note); }, [note, ageGroup]);

  const seasonalItems = useMemo(() => {
    const items: ChecklistItem[] = [];
    const ids = new Set<string>();
    const add = (id: string, labelKey: TranslationKey, emoji: string) => { if (!ids.has(id)) { items.push({ id, labelKey, emoji }); ids.add(id); } };

    const temp = weather.temperature;
    const isRainy = weather.rainProbability > 40 || weather.afternoonRain;

    if (temp > 10) add("lippis", "item.lippis", "🧢");
    if (isRainy) { add("kuravarusteet", "item.kuravarusteet", "🌧️"); add("vaihtohanskat", "item.vaihtohanskat", "🧤"); }
    if (temp < 10 && ageGroup !== "koululainen") add("lamminkerrasto", "item.lamminkerrasto", "🧶");
    const now = new Date();
    const month = now.getMonth(); // 0-indexed
    const day = now.getDate();
    const hideSkates = (month === 3 && day >= 10) || (month >= 4 && month <= 6) || (month === 7 && day <= 2);
    if (!hideSkates && (ageGroup === "leikki-ikäinen" || ageGroup === "koululainen") && temp < 0) add("luistimet", "item.luistimet", "⛸️");

    return items;
  }, [ageGroup, weather.temperature, weather.rainProbability, weather.afternoonRain]);

  const miscItems = useMemo(() => [...seasonalItems, ...miscByAge[ageGroup]], [ageGroup, seasonalItems]);

  const getDayReminder = (): TranslationKey | null => {
    const day = new Date().getDay();
    const hour = new Date().getHours();
    const suffix = ageGroup === "koululainen" ? ".school" : "";
    if (day === 5) return `checklist.fridayReminder` as TranslationKey;
    if (day === 0) return `checklist.sundayReminder${suffix}` as TranslationKey;
    if (day === 1 && hour < 12) return `checklist.mondayReminder${suffix}` as TranslationKey;
    return null;
  };

  const dayReminderKey = getDayReminder();
  const spareClothes = useMemo(() => getSpareClothes(), []);
  const allItems = [...spareClothes, ...miscItems];
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
          {t(item.labelKey)}
        </span>
      </button>
    );
  };

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-700 text-foreground">{t(ageGroup === "koululainen" ? "checklist.title.school" : "checklist.title")}</h2>
        {allDone && (
          <span className="text-xs font-medium bg-primary/15 text-primary px-2 py-1 rounded-full">{t("checklist.allPacked")}</span>
        )}
      </div>

      {dayReminderKey && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 p-3 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <span className="text-sm text-foreground">{t(dayReminderKey)}</span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xs font-display font-600 text-muted-foreground/70 uppercase tracking-wide mb-2">
          {t("checklist.spareClothes")}
        </h3>
        <div className="space-y-1.5">
          {spareClothes.map((item) => renderItem(item, true))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-display font-600 text-muted-foreground uppercase tracking-wide mb-2">
          {t("checklist.miscItems")}
        </h3>
        <div className="space-y-2 mb-3">
          {miscItems.map((item) => renderItem(item))}
        </div>
        <div>
          <label htmlFor={`note-${ageGroup}`} className="text-xs font-display font-600 text-muted-foreground uppercase tracking-wide mb-1.5 block">
            {t("checklist.myNote")}
          </label>
          <textarea
            id={`note-${ageGroup}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("checklist.notePlaceholder")}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
