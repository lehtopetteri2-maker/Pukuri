import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities } from "@/lib/weatherData";

interface LocationSearchProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
}

export default function LocationSearch({ currentCity, onSelectCity }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = open ? searchCities(query) : [];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (city: string) => {
    setLoading(true);
    setOpen(false);
    setQuery("");
    // Simulate loading
    setTimeout(() => {
      onSelectCity(city);
      setLoading(false);
    }, 800);
  };

  const handleGPS = () => {
    setLoading(true);
    setOpen(false);
    // Simulate geolocation → nearest city
    setTimeout(() => {
      onSelectCity("Helsinki");
      setLoading(false);
    }, 1200);
  };

  return (
    <div ref={containerRef} className="relative animate-fade-in">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-display font-600">Päivitetään säätietoja...</span>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-card p-4 shadow-sm border border-border space-y-3">
        {/* Current city display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-700">
              Sää nyt: <span className="text-primary">{currentCity}</span>
            </span>
          </div>
          <button
            onClick={handleGPS}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
          >
            <MapPin className="h-3.5 w-3.5" />
            Käytä nykyistä sijaintia
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Etsi paikkakuntaa..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          />
        </div>

        {/* Dropdown results */}
        {open && results.length > 0 && (
          <div className="rounded-md border border-border bg-card shadow-lg max-h-48 overflow-y-auto animate-fade-in">
            {results.map((city) => (
              <button
                key={city}
                onClick={() => handleSelect(city)}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  city === currentCity
                    ? "bg-mint-light text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {city}
                {city === currentCity && (
                  <span className="ml-auto text-xs text-primary">✓ Valittu</span>
                )}
              </button>
            ))}
          </div>
        )}

        {open && query && results.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Paikkakuntaa ei löytynyt: "{query}"
          </p>
        )}
      </div>
    </div>
  );
}
