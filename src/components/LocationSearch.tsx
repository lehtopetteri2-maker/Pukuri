import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
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
  onSelectCity: (city: string) => void;
  onSelectCoords?: (lat: number, lon: number) => void;
  onGeolocate: () => void;
  loading: boolean;
}

const FLAG: Record<string, string> = { FI: "🇫🇮", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰" };

export default function LocationSearch({ currentCity, onSelectCity, onSelectCoords, onGeolocate, loading }: LocationSearchProps) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const sheetInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Lock body scroll when sheet is open
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
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      // Fire parallel requests for each Nordic country to maximize coverage
      const fetches = ["FI", "SE", "NO", "DK"].map(cc =>
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)},${cc}&limit=10&appid=${API_KEY}`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [] as GeoResult[])
      );
      const allResults = (await Promise.all(fetches)).flat() as GeoResult[];

      // Deduplicate by lat/lon rounded to 2 decimals
      const seen = new Set<string>();
      const unique = allResults.filter(r => {
        if (!NORDIC_COUNTRIES.has(r.country)) return false;
        const key = `${r.lat.toFixed(2)}_${r.lon.toFixed(2)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sort: exact prefix match first, then alphabetical
      const lq = q.toLowerCase();
      unique.sort((a, b) => {
        const aMatch = getDisplayName(a).toLowerCase().startsWith(lq) ? 0 : 1;
        const bMatch = getDisplayName(b).toLowerCase().startsWith(lq) ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return getDisplayName(a).localeCompare(getDisplayName(b), "fi");
      });

      setResults(unique.slice(0, 20));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(() => searchGeo(val.trim()), 300);
  };

  const getDisplayName = (r: GeoResult): string => {
    // Try local language name first
    const langMap: Record<string, string> = { fi: "fi", sv: "sv", no: "no", da: "da", en: "en" };
    const langKey = langMap[lang] || "fi";
    if (r.local_names?.[langKey]) return r.local_names[langKey];
    return r.name;
  };

  const getAltName = (r: GeoResult): string | null => {
    const display = getDisplayName(r);
    // Show alternative name if different from display
    if (r.local_names) {
      const alts = ["fi", "sv", "en", "no", "da"]
        .map(k => r.local_names![k])
        .filter(Boolean)
        .filter(n => n !== display);
      if (alts.length > 0) return alts[0];
    }
    if (r.name !== display) return r.name;
    return null;
  };

  const handleSelect = (r: GeoResult) => {
    const name = getDisplayName(r);
    if (onSelectCoords) {
      onSelectCoords(r.lat, r.lon);
    } else {
      onSelectCity(name);
    }
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
      {/* Compact location bar */}
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

      {/* Bottom Sheet overlay */}
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
                <button onClick={handleClose} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
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
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
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

            {/* Results list */}
            <div className="flex-1 overflow-y-auto border-t border-border px-1 pb-4">
              {query.length < 2 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {t("location.searchHint") || "Kirjoita vähintään 2 merkkiä"}
                </div>
              ) : results.length === 0 && !searching ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Ei tuloksia
                </div>
              ) : (
                results.map((r, i) => {
                  const name = getDisplayName(r);
                  const alt = getAltName(r);
                  return (
                    <button
                      key={`${r.lat}-${r.lon}-${i}`}
                      type="button"
                      onClick={() => handleSelect(r)}
                      className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                    >
                      <span className="text-base shrink-0">{FLAG[r.country] || "📍"}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">{name}</span>
                        {(alt || r.state) && (
                          <span className="text-xs text-muted-foreground truncate">
                            {[alt, r.state].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
