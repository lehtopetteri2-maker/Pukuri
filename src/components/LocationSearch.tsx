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
const GEO_BASE = "https://api.openweathermap.org/geo/1.0/direct";

interface GeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Normalize Nordic characters: å→a, ä→a, ö→o, ø→o, æ→ae, ü→u
function normalizeNordic(s: string): string {
  return s
    .replace(/[åÅ]/g, (c) => (c === "å" ? "a" : "A"))
    .replace(/[äÄ]/g, (c) => (c === "ä" ? "a" : "A"))
    .replace(/[öÖ]/g, (c) => (c === "ö" ? "o" : "O"))
    .replace(/[øØ]/g, (c) => (c === "ø" ? "o" : "O"))
    .replace(/[æÆ]/g, (c) => (c === "æ" ? "ae" : "AE"))
    .replace(/[üÜ]/g, (c) => (c === "ü" ? "u" : "U"));
}

// Common Finnish/local name → international name aliases
const CITY_ALIASES: Record<string, string> = {
  tukholma: "Stockholm", kööpenhamina: "Copenhagen", kööbenhavn: "Copenhagen",
  oslo: "Oslo", bergen: "Bergen", göteborg: "Gothenburg",
  malmö: "Malmö", uumaja: "Umeå", tromssa: "Tromsø",
  ateena: "Athens", pariisi: "Paris", lontoo: "London",
  berliini: "Berlin", rooma: "Rome", pietari: "Saint Petersburg",
};

// Deduplicate results by lat/lon (rounded to 2 decimals)
function deduplicateResults(results: GeoResult[]): GeoResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.lat.toFixed(2)}_${r.lon.toFixed(2)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Check if a GeoResult matches the query (name or local_names)
function matchesQuery(r: GeoResult, q: string): boolean {
  const nq = normalizeNordic(q.toLowerCase());
  if (normalizeNordic(r.name.toLowerCase()).startsWith(nq)) return true;
  if (r.local_names) {
    return Object.values(r.local_names).some(
      (ln) => normalizeNordic(ln.toLowerCase()).startsWith(nq)
    );
  }
  return false;
}

function sortByRelevance(results: GeoResult[], query: string): GeoResult[] {
  const q = query.toLowerCase();
  const nq = normalizeNordic(q);
  return [...results].sort((a, b) => {
    // Exact name match first
    const aExact = a.name.toLowerCase() === q || normalizeNordic(a.name.toLowerCase()) === nq ? 0 : 1;
    const bExact = b.name.toLowerCase() === q || normalizeNordic(b.name.toLowerCase()) === nq ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    // Starts-with on original or normalized
    const aStarts = (a.name.toLowerCase().startsWith(q) || normalizeNordic(a.name.toLowerCase()).startsWith(nq)) ? 0 : 1;
    const bStarts = (b.name.toLowerCase().startsWith(q) || normalizeNordic(b.name.toLowerCase()).startsWith(nq)) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    // Nordic countries first
    const nordic = new Set(["FI", "SE", "NO", "DK"]);
    const aNordic = nordic.has(a.country) ? 0 : 1;
    const bNordic = nordic.has(b.country) ? 0 : 1;
    return aNordic - bNordic;
  });
}

function getDisplayName(r: GeoResult): string {
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchGeoResults = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const normalized = normalizeNordic(trimmed);
      const alias = CITY_ALIASES[trimmed.toLowerCase()];

      // Build unique query variants
      const queries = new Set([trimmed]);
      if (normalized !== trimmed) queries.add(normalized);
      if (alias) queries.add(alias);

      // Fetch all variants in parallel
      const fetches = [...queries].map(async (term) => {
        const url = `${GEO_BASE}?q=${encodeURIComponent(term)}&limit=20&appid=${API_KEY}`;
        try {
          const res = await fetch(url);
          if (!res.ok) return [];
          return (await res.json()) as GeoResult[];
        } catch {
          return [];
        }
      });

      const allResults = (await Promise.all(fetches)).flat();
      const deduped = deduplicateResults(allResults);
      const sorted = sortByRelevance(deduped, trimmed);
      setResults(sorted.slice(0, 20));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchGeoResults(value);
    }, 300);
  }, [fetchGeoResults]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSelectCity(query.trim());
      setQuery("");
      setOpen(false);
      setResults([]);
    }
  };

  const handleSelect = (r: GeoResult) => {
    onSelectCity(r.name);
    setQuery("");
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div ref={containerRef} className="relative animate-fade-in">
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
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={t("location.searchPlaceholder")}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          />

          {open && (results.length > 0 || searching) && (
            <div
              className="absolute z-30 top-full left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-md overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 100% - 50px - 64px)' }}
              ref={(el) => {
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const viewportH = window.innerHeight;
                  const maxH = viewportH - rect.top - 50;
                  el.style.maxHeight = `${Math.max(maxH, 120)}px`;
                }
              }}
            >
              {searching && results.length === 0 && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{t("location.updating")}</span>
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={`${r.lat}-${r.lon}-${i}`}
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {getDisplayName(r)}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
