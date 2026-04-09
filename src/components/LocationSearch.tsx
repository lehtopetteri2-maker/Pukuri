import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
const GEO_BASE = "https://api.openweathermap.org/geo/1.0";
const NORDIC_COUNTRIES = new Set(["FI", "SE", "NO", "DK"]);

interface GeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface LocationSearchProps {
  currentCity: string;
  onSelectCity: (city: string, lat?: number, lon?: number) => void;
  onGeolocate: () => void;
  loading: boolean;
}

export default function LocationSearch({ currentCity, onSelectCity, onGeolocate, loading }: LocationSearchProps) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const sheetInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => sheetInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  const searchGeo = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `${GEO_BASE}/direct?q=${encodeURIComponent(q.trim())}&limit=20&appid=${API_KEY}`
      );
      if (!res.ok) { setResults([]); return; }
      const data: GeoResult[] = await res.json();
      // Filter to Nordic countries and deduplicate by name+country
      const nordic = data.filter((r) => NORDIC_COUNTRIES.has(r.country));
      const seen = new Set<string>();
      const deduped = nordic.filter((r) => {
        const key = `${r.name}-${r.country}-${r.state ?? ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setResults(deduped);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchGeo(val), 300);
  };

  const displayName = (r: GeoResult): string => {
    // Try local name in user's language
    const localKey = lang === "fi" ? "fi" : lang === "sv" ? "sv" : "en";
    const local = r.local_names?.[localKey];
    if (local && local !== r.name) return `${local} (${r.name})`;
    return r.name;
  };

  const countryName = (code: string) => {
    const names: Record<string, Record<string, string>> = {
      FI: { fi: "Suomi", sv: "Finland", en: "Finland" },
      SE: { fi: "Ruotsi", sv: "Sverige", en: "Sweden" },
      NO: { fi: "Norja", sv: "Norge", en: "Norway" },
      DK: { fi: "Tanska", sv: "Danmark", en: "Denmark" },
    };
    const flags: Record<string, string> = { FI: "🇫🇮", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰" };
    const n = names[code]?.[lang] ?? code;
    return `${flags[code] ?? ""} ${n}`;
  };

  const handleSelect = (r: GeoResult) => {
    const name = r.local_names?.fi ?? r.local_names?.en ?? r.name;
    onSelectCity(name, r.lat, r.lon);
    setQuery("");
    setResults([]);
    setSheetOpen(false);
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSheetOpen(false);
  };

  return (
    <>
      <div className="relative animate-fade-in">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-display font-600">{t("location.updating")}</span>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-card p-4 shadow-sm border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-display font-700">
                {t("location.weatherNow")}: <span className="text-primary">{currentCity}</span>
              </span>
            </div>
            <button
              onClick={onGeolocate}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted disabled:opacity-50"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("location.useCurrentLocation")}</span>
              <span className="sm:hidden">📍</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="w-full flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm text-muted-foreground hover:border-ring/50 transition-colors text-left"
          >
            <Search className="h-4 w-4 shrink-0" />
            {t("location.searchPlaceholder")}
          </button>
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

          <div className="relative mt-auto bg-card rounded-t-2xl shadow-2xl border-t border-border flex flex-col animate-fade-in"
               style={{ maxHeight: "90vh", minHeight: "50vh" }}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-4 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-display font-700 text-foreground">
                  {t("location.searchPlaceholder")}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={sheetInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder={t("location.searchPlaceholder")}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                />
              </div>

              <button
                onClick={() => { onGeolocate(); handleClose(); }}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md bg-primary/10 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                {t("location.useCurrentLocation")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border-t border-border px-1 pb-4">
              {searching ? (
                <div className="py-8 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Haetaan...</span>
                </div>
              ) : query.trim().length > 0 && results.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {query.trim().length < 2 ? "Kirjoita vähintään 2 merkkiä" : "Ei tuloksia"}
                </div>
              ) : results.length > 0 ? (
                results.map((r, i) => (
                  <button
                    key={`${r.name}-${r.lat}-${r.lon}-${i}`}
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{displayName(r)}</span>
                      {r.state && (
                        <span className="text-xs text-muted-foreground ml-1.5">{r.state}</span>
                      )}
                    </div>
                    <span className="text-sm shrink-0">{countryFlag(r.country)}</span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {lang === "fi" ? "Kirjoita paikkakunnan nimi" : lang === "sv" ? "Skriv ortnamn" : "Type a place name"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
