import { WeatherData, getWeatherIcon } from "@/lib/weatherData";
import { Droplets, Wind, MapPin, CloudRain, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface WeatherCardProps {
  weather: WeatherData;
  cacheAge?: number | null;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function WeatherCard({ weather, cacheAge, onRefresh, loading }: WeatherCardProps) {
  const { t } = useLanguage();

  const cacheLabel =
    cacheAge === null || cacheAge === undefined
      ? null
      : cacheAge < 1
        ? t("weather.justUpdated")
        : t("weather.updatedAgo", { min: cacheAge });

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{weather.city}</span>
        </div>
        <div className="flex items-center gap-2">
          {cacheLabel && (
            <span className="text-xs text-muted-foreground">{cacheLabel}</span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              title={t("weather.refreshNow")}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-6xl font-display font-800 tracking-tight text-foreground">
            {weather.temperature}°
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("weather.feelsLike")} {weather.feelsLike}°
          </p>
          <p className="text-sm text-foreground/80 mt-2 capitalize">{weather.description}</p>
        </div>
        <div className="text-7xl">{getWeatherIcon(weather.condition)}</div>
      </div>

      <div className="flex gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind className="h-4 w-4" />
          <span>{weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Droplets className="h-4 w-4" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CloudRain className="h-4 w-4" />
          <span>{t("weather.rain")} {weather.rainProbability}%</span>
        </div>
      </div>
    </div>
  );
}
