import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { searchLocations, getCountryFlag, getCountryName, type GeoResult } from "@/lib/geocodingApi";

interface LocationSearchProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onSelectCoords?: (lat: number, lon: number) => void;
  onGeolocate: () => void;
  loading: boolean;
}

export default function LocationSearch({ currentCity, onSelectCity, onSelectCoords, onGeolocate, loading }: LocationSearchProps) {
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

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await searchLocations(q);
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

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

  const handleSelect = (result: GeoResult) => {
    if (onSelectCoords) {
      onSelectCoords(result.lat, result.lon);
    } else {
      onSelectCity(result.name);
    }
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
                <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("location.updating")}
                </div>
              )}
              {results.map((result, i) => (
                <button
                  key={`${result.lat}-${result.lon}-${i}`}
                  type="button"
                  onClick={() => handleSelect(result)}
                  className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">
                    {result.name}
                    {result.localName && result.localName !== result.name && (
                      <span className="text-muted-foreground"> ({result.localName})</span>
                    )}
                    {result.state && (
                      <span className="text-muted-foreground text-xs ml-1">· {result.state}</span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {getCountryFlag(result.country)} {getCountryName(result.country)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
