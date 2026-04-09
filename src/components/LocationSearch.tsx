import { useState, useRef, useEffect, useMemo } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cityWeather } from "@/lib/cityWeatherData";

interface LocationSearchProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
}

const allCities = Object.keys(cityWeather).sort((a, b) => a.localeCompare(b, "fi"));

export default function LocationSearch({ currentCity, onSelectCity, onGeolocate, loading }: LocationSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
      // Focus sheet input after animation
      setTimeout(() => sheetInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allCities;
    const q = query.trim().toLowerCase();
    return allCities.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (city: string) => {
    onSelectCity(city);
    setQuery("");
    setSheetOpen(false);
  };

  const handleClose = () => {
    setQuery("");
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

          {/* Fake input that opens the bottom sheet */}
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

          {/* Sheet */}
          <div className="relative mt-auto bg-card rounded-t-2xl shadow-2xl border-t border-border flex flex-col animate-fade-in"
               style={{ maxHeight: "90vh", minHeight: "50vh" }}>
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header with search */}
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
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("location.searchPlaceholder")}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                />
              </div>

              {/* Geolocation button */}
              <button
                onClick={() => { onGeolocate(); handleClose(); }}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md bg-primary/10 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                {t("location.useCurrentLocation")}
              </button>
            </div>

            {/* City list */}
            <div className="flex-1 overflow-y-auto border-t border-border px-1 pb-4">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {t("location.noResults") || "Ei tuloksia"}
                </div>
              ) : (
                filtered.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className={city === currentCity ? "font-700 text-primary" : ""}>
                      {city}
                    </span>
                    {city === currentCity && (
                      <span className="ml-auto text-xs text-primary">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
