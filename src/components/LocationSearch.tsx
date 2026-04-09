import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface LocationSearchProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
}

const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

interface GeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/** Normalize Nordic characters for fuzzy matching */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae");
}

/** Format display label for a geocoding result */
function formatLabel(r: GeoResult): string {
  const parts = [r.name];
  if (r.state) parts.push(r.state);
  parts.push(r.country);
  return parts.join(", ");
}

export default function LocationSearch({ currentCity, onSelectCity, onGeolocate, loading }: LocationSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Geocoding search with debounce
  const searchGeo = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `${GEO_URL}?q=${encodeURIComponent(q.trim())}&limit=15&appid=${API_KEY}`
      );
      if (!res.ok) {
        setResults([]);
        return;
      }
      const data: GeoResult[] = await res.json();

      // Prioritize Nordic countries
      const nordic = new Set(["FI", "SE", "NO", "DK"]);
      data.sort((a, b) => {
        const aN = nordic.has(a.country) ? 0 : 1;
        const bN = nordic.has(b.country) ? 0 : 1;
        return aN - bN;
      });

      // Deduplicate by name+country
      const seen = new Set<string>();
      const unique = data.filter((r) => {
        const key = `${normalize(r.name)}-${r.country}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setResults(unique);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => searchGeo(value), 300);
    } else {
      setResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      onSelectCity(query.trim());
      setQuery("");
      setOpen(false);
    }
  };

  const handleSelect = (r: GeoResult) => {
    onSelectCity(r.name);
    setQuery("");
    setOpen(false);
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative animate-fade-in" style={{ zIndex: 50 }}>
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

        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={t("location.searchPlaceholder")}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          />

          {open && (results.length > 0 || searching) && (
            <div
              className="absolute z-[100] top-full left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-lg overflow-y-auto max-h-64"
            >
              {searching && results.length === 0 && (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("location.updating")}
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={`${r.name}-${r.country}-${r.lat}-${i}`}
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{formatLabel(r)}</span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
