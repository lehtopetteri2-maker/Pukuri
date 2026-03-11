import { WeatherData, AgeGroup, getWeatherIcon, getClothingRecommendation } from "@/lib/weatherData";
import type { TomorrowData } from "@/lib/weatherApi";
import {
  getTomorrowForecast,
  getTomorrowWarnings,
  getTomorrowPrepItems,
} from "@/lib/tomorrowWeather";
import { AlertTriangle, Moon } from "lucide-react";

interface TomorrowForecastProps {
  weather: WeatherData;
  ageGroup: AgeGroup;
  tomorrow?: TomorrowData | null;
}

export default function TomorrowForecastCard({ weather, ageGroup, tomorrow: apiTomorrow }: TomorrowForecastProps) {
  // Use API data if available, otherwise fall back to mock
  const mockTomorrow = getTomorrowForecast(weather);

  const tempMin = apiTomorrow ? apiTomorrow.tempMin : mockTomorrow.tempMin;
  const tempMax = apiTomorrow ? apiTomorrow.tempMax : mockTomorrow.tempMax;
  const rainProbability = apiTomorrow ? apiTomorrow.rainProbability : mockTomorrow.rainProbability;
  const condition = apiTomorrow ? apiTomorrow.condition : mockTomorrow.condition;

  // Build a WeatherData for clothing recommendation
  const tomorrowWeather: WeatherData = apiTomorrow
    ? {
        temperature: apiTomorrow.avgTemp,
        feelsLike: apiTomorrow.avgTemp - 3,
        condition: apiTomorrow.condition,
        windSpeed: apiTomorrow.avgWind,
        humidity: apiTomorrow.humidity,
        rainProbability: apiTomorrow.rainProbability,
        afternoonRain: apiTomorrow.rainProbability > 50,
        city: weather.city,
        description: apiTomorrow.description,
      }
    : mockTomorrow.weatherData;

  const warnings = getTomorrowWarnings(weather, {
    ...mockTomorrow,
    weatherData: tomorrowWeather,
    rainProbability,
  });

  const prepItems = getClothingRecommendation(tomorrowWeather, ageGroup).slice(0, 4);

  return (
    <div className="rounded-lg bg-night text-night-foreground p-6 shadow-md animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Moon className="h-4 w-4 text-night-muted" />
        <h2 className="text-sm font-display font-700 uppercase tracking-wide text-night-muted">
          Huomisen sää — Ennuste
        </h2>
      </div>

      {/* Temp & condition */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-display font-800 tracking-tight">
            {tempMin}° / {tempMax}°
          </div>
          <p className="text-sm text-night-muted mt-1">
            Sateen todennäköisyys {rainProbability} %
          </p>
        </div>
        <span className="text-5xl">{getWeatherIcon(condition)}</span>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-md bg-destructive/15 border border-destructive/30 p-3"
            >
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-sm">{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Prep items */}
      {prepItems.length > 0 && (
        <div>
          <h3 className="text-xs font-display font-700 uppercase tracking-wide text-night-muted mb-2">
            Valmistele huomiseksi — Poimi valmiiksi:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {prepItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 rounded-md bg-night-foreground/10 p-2"
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-display font-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
