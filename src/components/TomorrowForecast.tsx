import { WeatherData, AgeGroup, getWeatherIcon, getClothingRecommendation, ClothingItem } from "@/lib/weatherData";
import type { TomorrowData } from "@/lib/weatherApi";
import { getTomorrowForecast } from "@/lib/tomorrowWeather";
import { AlertTriangle, Moon, Sunrise, Sun } from "lucide-react";
import { useLanguage, translateClothingItem } from "@/lib/i18n";
import { PufferOverallIcon, PufferJacketIcon, PufferTrousersIcon } from "./WinterIcons";

interface TomorrowForecastProps {
  weather: WeatherData;
  ageGroup: AgeGroup;
  tomorrow?: TomorrowData | null;
  forecastList?: any[];
}

/** Extract tomorrow's morning (~08) and afternoon (~14) data from forecast list */
function extractTomorrowMorningAfternoon(forecastList: any[]): {
  morningTemp: number | null;
  morningFeelsLike: number | null;
  morningConditionId: number | null;
  morningWind: number | null;
  morningHumidity: number | null;
  morningDesc: string | null;
  morningPop: number;
  afternoonTemp: number | null;
  afternoonFeelsLike: number | null;
  afternoonConditionId: number | null;
  afternoonWind: number | null;
  afternoonHumidity: number | null;
  afternoonDesc: string | null;
  afternoonPop: number;
} {
  const tomorrow = new Date(Date.now() + 86400000);
  const tomorrowKey = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

  let morningEntry: any = null;
  let afternoonEntry: any = null;

  for (const entry of forecastList) {
    const d = new Date(entry.dt * 1000);
    const entryKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    if (entryKey !== tomorrowKey) continue;
    const hour = d.getHours();
    if (hour >= 6 && hour <= 9 && !morningEntry) morningEntry = entry;
    if (hour >= 12 && hour <= 15 && !afternoonEntry) afternoonEntry = entry;
  }

  const extract = (e: any) => e ? {
    temp: Math.round(e.main.temp),
    feelsLike: Math.round(e.main.feels_like),
    conditionId: e.weather[0].id,
    wind: Math.round(e.wind?.speed ?? 0),
    humidity: e.main.humidity,
    desc: e.weather[0].description,
    pop: Math.round((e.pop ?? 0) * 100),
  } : null;

  const m = extract(morningEntry);
  const a = extract(afternoonEntry);

  return {
    morningTemp: m?.temp ?? null, morningFeelsLike: m?.feelsLike ?? null,
    morningConditionId: m?.conditionId ?? null, morningWind: m?.wind ?? null,
    morningHumidity: m?.humidity ?? null, morningDesc: m?.desc ?? null, morningPop: m?.pop ?? 0,
    afternoonTemp: a?.temp ?? null, afternoonFeelsLike: a?.feelsLike ?? null,
    afternoonConditionId: a?.conditionId ?? null, afternoonWind: a?.wind ?? null,
    afternoonHumidity: a?.humidity ?? null, afternoonDesc: a?.desc ?? null, afternoonPop: a?.pop ?? 0,
  };
}

function mapCondition(id: number): import("@/lib/weatherData").WeatherCondition {
  if (id >= 200 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snowy";
  if (id >= 700 && id < 800) return "windy";
  if (id === 800) return "sunny";
  return "cloudy";
}

function buildSnapshot(base: WeatherData, temp: number, feelsLike: number, condId: number | null, wind: number | null, humidity: number | null, desc: string | null, pop: number): WeatherData {
  return {
    ...base,
    temperature: feelsLike,
    feelsLike,
    condition: condId ? mapCondition(condId) : base.condition,
    windSpeed: wind ?? base.windSpeed,
    humidity: humidity ?? base.humidity,
    rainProbability: pop,
    description: desc ?? base.description,
  };
}

/** Ensure rain gear is present when rain probability > 40% */
function ensureRainGear(items: ClothingItem[], temp: number): ClothingItem[] {
  const hasRainGear = items.some(i =>
    i.name.includes("Kurahousut") || i.name.includes("Sadehaalari") || i.name.includes("kura") ||
    i.name.includes("Vedenpitävä")
  );
  if (hasRainGear) return items;

  const result = [...items];
  result.push({
    name: "Kurahousut",
    emoji: "🌧️",
    description: "Huomenna sataa — vedenpitävät varusteet mukaan",
  });
  result.push(
    temp < 10
      ? { name: "Kumisaappaat + villasukat", emoji: "🥾🧦", description: "Kumisaappaat ja villasukat suojaavat kylmältä" }
      : { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat ohuilla sukilla" }
  );
  return result;
}

function renderPrepGrid(items: ClothingItem[], lang: string) {
  const { translateClothingItem: translate } = require("@/lib/i18n");
  return null; // placeholder, actual rendering in component
}

export default function TomorrowForecastCard({ weather, ageGroup, tomorrow: apiTomorrow, forecastList }: TomorrowForecastProps) {
  const { t, lang } = useLanguage();
  const mockTomorrow = getTomorrowForecast(weather);

  const tempMin = apiTomorrow ? apiTomorrow.tempMin : mockTomorrow.tempMin;
  const tempMax = apiTomorrow ? apiTomorrow.tempMax : mockTomorrow.tempMax;
  const rainProbability = apiTomorrow ? apiTomorrow.rainProbability : mockTomorrow.rainProbability;
  const condition = apiTomorrow ? apiTomorrow.condition : mockTomorrow.condition;

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

  // Warnings
  const warnings: string[] = [];
  if (tomorrowWeather.temperature < weather.temperature - 2) {
    warnings.push(t("tomorrow.colderWarning"));
  }
  if (weather.rainProbability < 30 && rainProbability > 50) {
    warnings.push(t("tomorrow.rainWarning"));
  }

  // Check for AM/PM dual split from forecast
  const hasForecast = forecastList && forecastList.length > 0;
  let isDual = false;
  let morningItems: ClothingItem[] = [];
  let afternoonItems: ClothingItem[] = [];
  let morningTemp = 0;
  let afternoonTemp = 0;

  if (hasForecast) {
    const data = extractTomorrowMorningAfternoon(forecastList);
    morningTemp = data.morningTemp ?? tomorrowWeather.temperature;
    afternoonTemp = data.afternoonTemp ?? tomorrowWeather.temperature;
    const gap = Math.abs(afternoonTemp - morningTemp);
    isDual = gap > 7;

    if (isDual) {
      const mWeather = buildSnapshot(tomorrowWeather, morningTemp, data.morningFeelsLike ?? morningTemp, data.morningConditionId, data.morningWind, data.morningHumidity, data.morningDesc, data.morningPop);
      const aWeather = buildSnapshot(tomorrowWeather, afternoonTemp, data.afternoonFeelsLike ?? afternoonTemp, data.afternoonConditionId, data.afternoonWind, data.afternoonHumidity, data.afternoonDesc, data.afternoonPop);

      morningItems = getClothingRecommendation(mWeather, ageGroup);
      afternoonItems = getClothingRecommendation(aWeather, ageGroup);

      // Add rain gear if needed
      if (data.morningPop > 40) morningItems = ensureRainGear(morningItems, morningTemp);
      if (data.afternoonPop > 40) afternoonItems = ensureRainGear(afternoonItems, afternoonTemp);
    }
  }

  // Single list fallback — use same getClothingRecommendation
  let prepItems: ClothingItem[] = [];
  if (!isDual) {
    prepItems = getClothingRecommendation(tomorrowWeather, ageGroup);
    if (rainProbability > 40) {
      prepItems = ensureRainGear(prepItems, tomorrowWeather.temperature);
    }
    prepItems = prepItems.slice(0, 6);
  }

  const renderItem = (item: ClothingItem) => {
    const translated = translateClothingItem(item, lang);
    return (
      <div key={item.name} className="flex items-center gap-2 rounded-md bg-night-foreground/10 p-2">
        <span className="text-lg">{item.emoji}</span>
        <span className="text-sm font-display font-600">{translated.name}</span>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-night text-night-foreground p-6 shadow-md animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="h-4 w-4 text-night-muted" />
        <h2 className="text-sm font-display font-700 uppercase tracking-wide text-night-muted">
          {t("tomorrow.title")}
        </h2>
        <span className="text-xs bg-night-foreground/10 px-2 py-0.5 rounded-full font-display font-600 text-night-muted">
          {t(`weekday.${new Date(Date.now() + 86400000).getDay()}` as any)}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-display font-800 tracking-tight">
            {tempMin}° / {tempMax}°
          </div>
          <p className="text-sm text-night-muted mt-1">
            {t("tomorrow.rainProb")} {rainProbability} %
          </p>
        </div>
        <span className="text-5xl">{getWeatherIcon(condition)}</span>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md bg-destructive/15 border border-destructive/30 p-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-sm">{w}</span>
            </div>
          ))}
        </div>
      )}

      {isDual ? (
        <div>
          <h3 className="text-xs font-display font-700 uppercase tracking-wide text-night-muted mb-3">
            {t("tomorrow.prepTitle")}
          </h3>

          {/* Morning */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sunrise className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-display font-700 text-amber-400 uppercase tracking-wide">
                {t("tomorrow.morningGear")} ({morningTemp}°)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {morningItems.slice(0, 4).map(renderItem)}
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sun className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-display font-700 text-orange-400 uppercase tracking-wide">
                {t("tomorrow.afternoonGear")} ({afternoonTemp}°)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {afternoonItems.slice(0, 4).map(renderItem)}
            </div>
          </div>
        </div>
      ) : prepItems.length > 0 ? (
        <div>
          <h3 className="text-xs font-display font-700 uppercase tracking-wide text-night-muted mb-2">
            {t("tomorrow.prepTitle")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {prepItems.map(renderItem)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
