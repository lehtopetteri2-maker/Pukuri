import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cityWeather } from "@/lib/cityWeatherData";

interface LocationSearchProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
}

const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
const allLocalCities = Object.keys(cityWeather);

interface GeoResult {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export default function LocationSearch({ currentCity, onSelectCity, onGeolocate, loading }: LocationSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
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

  const searchCities = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lower = q.trim().toLowerCase();

    // Local matches first (instant)
    const localMatches = allLocalCities
      .filter((c) => c.toLowerCase().startsWith(lower))
      .slice(0, 10);

    setResults(localMatches);

    // Then fetch from Geocoding API (Finland only)
    if (q.trim().length >= 2) {
      setSearching(true);
      try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q.trim())},FI&limit=10&appid=${API_KEY}`;
        const res = await fetch(url);
        if (res.ok) {
          const data: GeoResult[] = await res.json();
          const apiCities = data
            .filter((r) => r.country === "FI")
            .map((r) => r.name);

          // Merge local + API results, deduplicate
          const merged = [...localMatches];
          for (const city of apiCities) {
            if (!merged.some((m) => m.toLowerCase() === city.toLowerCase())) {
              merged.push(city);
            }
          }
          setResults(merged.slice(0, 20));
        }
      } catch {
        // Keep local results on error
      } finally {
        setSearching(false);
      }
    }
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCities(value), 300);
  }, [searchCities]);

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
    }
  };

  const handleSelect = (city: string) => {
    onSelectCity(city);
    setQuery("");
    setOpen(false);
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
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
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

          {open && results.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-md overflow-y-auto"
              style={{ zIndex: 9999, maxHeight: '60vh' }}
            >
              {results.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {city}
                </button>
              ))}
              <div className="h-[100px]" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
