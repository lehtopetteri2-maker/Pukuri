import { useState, useMemo, useEffect, useCallback } from "react";
import { AgeGroup, WeatherData } from "@/lib/weatherData";
import { AlertTriangle, Settings } from "lucide-react";
import { useLanguage, TranslationKey } from "@/lib/i18n";
import { Switch } from "@/components/ui/switch";

interface ChecklistItem {
  id: string;
  labelKey: TranslationKey;
  emoji: string;
  seasonal?: boolean; // if true, subject to seasonal hide rule
}

const SPARE_CLOTHES: ChecklistItem[] = [
  { id: "varahousut", labelKey: "item.varahousut", emoji: "👖" },
  { id: "varapaita", labelKey: "item.varapaita", emoji: "👕" },
  { id: "alusvaatteet", labelKey: "item.alusvaatteet", emoji: "🩲" },
  { id: "varahanskat", labelKey: "item.varahanskat", emoji: "🧤" },
  { id: "vaihtosukat", labelKey: "item.vaihtosukat", emoji: "🧦" },
];

// All possible misc items per age group (weather-dynamic + static + new items)
const allMiscByAge: Record<AgeGroup, ChecklistItem[]> = {
  vauva: [
    { id: "vaippapaketti", labelKey: "item.vaippapaketti", emoji: "🧷" },
    { id: "tutti", labelKey: "item.tutti", emoji: "🍼" },
    { id: "unilelu", labelKey: "item.unilelu", emoji: "🧸" },
    { id: "aurinkorasva", labelKey: "item.aurinkorasva", emoji: "☀️" },
    { id: "lippis", labelKey: "item.lippis", emoji: "🧢" },
    { id: "kuravarusteet", labelKey: "item.kuravarusteet", emoji: "🌧️" },
    { id: "vaihtohanskat", labelKey: "item.vaihtohanskat", emoji: "🧤" },
    { id: "lamminkerrasto", labelKey: "item.lamminkerrasto", emoji: "🧶" },
    { id: "heijastinliivi", labelKey: "item.heijastinliivi", emoji: "🦺" },
    { id: "istuinalusta", labelKey: "item.istuinalusta", emoji: "🪑" },
    { id: "unipussi", labelKey: "item.unipussi", emoji: "🛏️" },
    { id: "retkievaat", labelKey: "item.retkievaat", emoji: "🥪" },
  ],
  taapero: [
    { id: "juomapullo", labelKey: "item.juomapullo", emoji: "💧" },
    { id: "omalelu", labelKey: "item.omalelu", emoji: "🧸" },
    { id: "välipala", labelKey: "item.välipala", emoji: "🍎" },
    { id: "aurinkorasva", labelKey: "item.aurinkorasva", emoji: "☀️" },
    { id: "lippis", labelKey: "item.lippis", emoji: "🧢" },
    { id: "kuravarusteet", labelKey: "item.kuravarusteet", emoji: "🌧️" },
    { id: "vaihtohanskat", labelKey: "item.vaihtohanskat", emoji: "🧤" },
    { id: "lamminkerrasto", labelKey: "item.lamminkerrasto", emoji: "🧶" },
    { id: "pyorakypara", labelKey: "item.pyorakypara", emoji: "⛑️" },
    { id: "heijastinliivi", labelKey: "item.heijastinliivi", emoji: "🦺" },
    { id: "istuinalusta", labelKey: "item.istuinalusta", emoji: "🪑" },
    { id: "retkievaat", labelKey: "item.retkievaat", emoji: "🥪" },
  ],
  "leikki-ikäinen": [
    { id: "juomapullo", labelKey: "item.juomapullo", emoji: "💧" },
    { id: "omalelu", labelKey: "item.omalelu", emoji: "🧸" },
    { id: "välipala", labelKey: "item.välipala", emoji: "🍎" },
    { id: "aurinkorasva", labelKey: "item.aurinkorasva", emoji: "☀️" },
    { id: "lippis", labelKey: "item.lippis", emoji: "🧢" },
    { id: "kuravarusteet", labelKey: "item.kuravarusteet", emoji: "🌧️" },
    { id: "vaihtohanskat", labelKey: "item.vaihtohanskat", emoji: "🧤" },
    { id: "lamminkerrasto", labelKey: "item.lamminkerrasto", emoji: "🧶" },
    { id: "luistimet", labelKey: "item.luistimet", emoji: "⛸️", seasonal: true },
    { id: "hiihtosukset", labelKey: "item.hiihtosukset", emoji: "🎿", seasonal: true },
    { id: "pyorakypara", labelKey: "item.pyorakypara", emoji: "⛑️" },
    { id: "heijastinliivi", labelKey: "item.heijastinliivi", emoji: "🦺" },
    { id: "istuinalusta", labelKey: "item.istuinalusta", emoji: "🪑" },
    { id: "retkievaat", labelKey: "item.retkievaat", emoji: "🥪" },
  ],
  koululainen: [
    { id: "avaimet", labelKey: "item.avaimet", emoji: "🔑" },
    { id: "välipala", labelKey: "item.välipala", emoji: "🍎" },
    { id: "uikkarit", labelKey: "item.uikkarit", emoji: "🩱" },
    { id: "sisäliikunta", labelKey: "item.sisäliikunta", emoji: "🏃" },
    { id: "lippis", labelKey: "item.lippis", emoji: "🧢" },
    { id: "kuravarusteet", labelKey: "item.kuravarusteet", emoji: "🌧️" },
    { id: "vaihtohanskat", labelKey: "item.vaihtohanskat", emoji: "🧤" },
    { id: "luistimet", labelKey: "item.luistimet", emoji: "⛸️", seasonal: true },
    { id: "hiihtosukset", labelKey: "item.hiihtosukset", emoji: "🎿", seasonal: true },
    { id: "pyorakypara", labelKey: "item.pyorakypara", emoji: "⛑️" },
    { id: "heijastinliivi", labelKey: "item.heijastinliivi", emoji: "🦺" },
    { id: "istuinalusta", labelKey: "item.istuinalusta", emoji: "🪑" },
    { id: "retkievaat", labelKey: "item.retkievaat", emoji: "🥪" },
  ],
};

function isSeasonallyHidden(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  return (month === 3 && day >= 10) || (month >= 4 && month <= 6) || (month === 7 && day <= 2);
}

function getStorageKey(ag: AgeGroup, type: "checked" | "note" | "active") { return `daycare-checklist-${ag}-${type}`; }
function loadChecked(ag: AgeGroup): Set<string> { try { const r = localStorage.getItem(getStorageKey(ag, "checked")); return r ? new Set(JSON.parse(r)) : new Set(); } catch { return new Set(); } }
function saveChecked(ag: AgeGroup, s: Set<string>) { localStorage.setItem(getStorageKey(ag, "checked"), JSON.stringify([...s])); }
function loadNote(ag: AgeGroup): string { return localStorage.getItem(getStorageKey(ag, "note")) || ""; }
function saveNote(ag: AgeGroup, n: string) { localStorage.setItem(getStorageKey(ag, "note"), n); }
function loadActive(ag: AgeGroup): Set<string> | null { try { const r = localStorage.getItem(getStorageKey(ag, "active")); return r ? new Set(JSON.parse(r)) : null; } catch { return null; } }
function saveActive(ag: AgeGroup, s: Set<string>) { localStorage.setItem(getStorageKey(ag, "active"), JSON.stringify([...s])); }

interface DaycareChecklistProps { ageGroup: AgeGroup; weather: WeatherData; }

export default function DaycareChecklist({ ageGroup, weather }: DaycareChecklistProps) {
  const { t } = useLanguage();
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked(ageGroup));
  const [note, setNote] = useState(() => loadNote(ageGroup));
  const [showSettings, setShowSettings] = useState(false);

  // Get all available misc items for this age group, filtering seasonal
  const hideSeasonalItems = isSeasonallyHidden();
  const availableMiscItems = useMemo(() => {
    return allMiscByAge[ageGroup].filter(item => {
      if (item.seasonal && hideSeasonalItems) return false;
      return true;
    });
  }, [ageGroup, hideSeasonalItems]);

  // Default active = all items from the original static+dynamic lists
  const [activeItems, setActiveItems] = useState<Set<string>>(() => {
    const saved = loadActive(ageGroup);
    if (saved) return saved;
    // Default: activate all available items
    return new Set(availableMiscItems.map(i => i.id));
  });

  useEffect(() => {
    setChecked(loadChecked(ageGroup));
    setNote(loadNote(ageGroup));
    const saved = loadActive(ageGroup);
    if (saved) {
      setActiveItems(saved);
    } else {
      setActiveItems(new Set(allMiscByAge[ageGroup].filter(i => !(i.seasonal && isSeasonallyHidden())).map(i => i.id)));
    }
  }, [ageGroup]);

  useEffect(() => { saveChecked(ageGroup, checked); }, [checked, ageGroup]);
  useEffect(() => { saveNote(ageGroup, note); }, [note, ageGroup]);
  useEffect(() => { saveActive(ageGroup, activeItems); }, [activeItems, ageGroup]);

  // Only show active misc items in the checklist
  const visibleMiscItems = useMemo(() => {
    return availableMiscItems.filter(item => activeItems.has(item.id));
  }, [availableMiscItems, activeItems]);

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
  const allItems = [...SPARE_CLOTHES, ...visibleMiscItems];
  const allDone = allItems.length > 0 && allItems.every((i) => checked.has(i.id));

  const toggle = useCallback((id: string) => {
    setChecked((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setActiveItems((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
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
          {SPARE_CLOTHES.map((item) => renderItem(item, true))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-display font-600 text-muted-foreground uppercase tracking-wide">
            {t("checklist.miscItems")}
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            {showSettings ? t("checklist.hideSettings") : t("checklist.showSettings")}
          </button>
        </div>

        {showSettings && (
          <div className="mb-4 p-3 rounded-md border border-border bg-muted/20 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">{t("checklist.activeItemsDesc")}</p>
            {availableMiscItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-sm text-foreground">{t(item.labelKey)}</span>
                </div>
                <Switch
                  checked={activeItems.has(item.id)}
                  onCheckedChange={() => toggleActive(item.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 mb-3">
          {visibleMiscItems.length > 0 ? (
            visibleMiscItems.map((item) => renderItem(item))
          ) : (
            <p className="text-xs text-muted-foreground italic py-2">{t("checklist.showSettings")}</p>
          )}
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
