/**
 * Dual Recommendation Engine
 * Extracts morning (08:00) vs afternoon (14:00) temps from forecast,
 * computes wind chill, mud factor, and activity-level adjustments.
 */

import type { WeatherData, AgeGroup, ClothingItem } from "./weatherData";
import { getClothingRecommendation } from "./weatherData";

export interface DualRecommendation {
  /** true when morning/afternoon gap > 7°C */
  isDual: boolean;
  morningClothing: ClothingItem[];
  afternoonClothing: ClothingItem[];
  morningTemp: number;
  afternoonTemp: number;
  morningFeelsLike: number;
  afternoonFeelsLike: number;
  /** Wind warning text key or null */
  windWarning: boolean;
  windSpeed: number;
  /** Mud factor: ground still wet from recent rain */
  mudFactor: boolean;
  recentRainMm: number;
}

/** Extract morning (~08) and afternoon (~14) entries from forecast list */
function extractMorningAfternoon(forecastList: any[]): {
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
  recentRainMm: number;
} {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  // Also check yesterday for recent rain (last 12h)
  const yesterday = new Date(now.getTime() - 86400000);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

  let morningEntry: any = null;
  let afternoonEntry: any = null;
  let recentRainMm = 0;

  for (const entry of forecastList) {
    const d = new Date(entry.dt * 1000);
    const entryKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const hour = d.getHours();

    // Recent rain: last 12 hours
    const hoursAgo = (now.getTime() - d.getTime()) / 3600000;
    if (hoursAgo >= 0 && hoursAgo <= 12) {
      recentRainMm += (entry.rain?.["3h"] ?? entry.rain?.["1h"] ?? 0);
      recentRainMm += (entry.snow?.["3h"] ?? entry.snow?.["1h"] ?? 0);
    }
    // Also count yesterday's late entries
    if (entryKey === yesterdayKey && hour >= 18) {
      recentRainMm += (entry.rain?.["3h"] ?? entry.rain?.["1h"] ?? 0);
    }

    if (entryKey !== todayKey) continue;

    // Morning: closest to 08:00 (accept 06-09)
    if (hour >= 6 && hour <= 9 && !morningEntry) {
      morningEntry = entry;
    }
    // Afternoon: closest to 14:00 (accept 12-15)
    if (hour >= 12 && hour <= 15 && !afternoonEntry) {
      afternoonEntry = entry;
    }
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
    morningTemp: m?.temp ?? null,
    morningFeelsLike: m?.feelsLike ?? null,
    morningConditionId: m?.conditionId ?? null,
    morningWind: m?.wind ?? null,
    morningHumidity: m?.humidity ?? null,
    morningDesc: m?.desc ?? null,
    morningPop: m?.pop ?? 0,
    afternoonTemp: a?.temp ?? null,
    afternoonFeelsLike: a?.feelsLike ?? null,
    afternoonConditionId: a?.conditionId ?? null,
    afternoonWind: a?.wind ?? null,
    afternoonHumidity: a?.humidity ?? null,
    afternoonDesc: a?.desc ?? null,
    afternoonPop: a?.pop ?? 0,
    recentRainMm: Math.round(recentRainMm * 10) / 10,
  };
}

function mapCondition(id: number): import("./weatherData").WeatherCondition {
  if (id >= 200 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snowy";
  if (id >= 700 && id < 800) return "windy";
  if (id === 800) return "sunny";
  return "cloudy";
}

function buildWeatherSnapshot(
  base: WeatherData,
  temp: number,
  feelsLike: number,
  conditionId: number | null,
  wind: number | null,
  humidity: number | null,
  desc: string | null,
  pop: number,
): WeatherData {
  return {
    ...base,
    temperature: temp, // Use ACTUAL temperature (spring rule needs it)
    feelsLike,
    condition: conditionId ? mapCondition(conditionId) : base.condition,
    windSpeed: wind ?? base.windSpeed,
    humidity: humidity ?? base.humidity,
    rainProbability: pop,
    description: desc ?? base.description,
  };
}

/** Add activity-level adjustments per age group */
function applyActivityLevel(items: ClothingItem[], ageGroup: AgeGroup): ClothingItem[] {
  const result = [...items];

  if (ageGroup === "vauva") {
    // Baby is stationary — always add an extra insulation layer
    const hasExtra = result.some(i => i.name === "Lämpöpussi / lisäkerros");
    if (!hasExtra) {
      result.push({
        name: "Lämpöpussi / lisäkerros",
        emoji: "🧸",
        description: "Vauva on paikoillaan — lisää yksi kerros lämpöä",
      });
    }
  }

  return result;
}

/** Add mud factor items if ground is wet */
function applyMudFactor(
  items: ClothingItem[],
  recentRainMm: number,
  currentCondition: string,
  temperature: number
): ClothingItem[] {
  if (recentRainMm <= 1) return items;

  const result = [...items];
  const hasWaterproof = result.some(i =>
    i.name.includes("Kumisaappaat") || i.name.includes("Kurahousut") || i.name.includes("kura")
  );

  if (!hasWaterproof) {
    // Alle +10°C -> lisätään villasukat kumisaappaisiin
    const kumpparit: ClothingItem = temperature < 10
      ? {
          name: "Kumisaappaat + villasukat",
          emoji: "🥾🧦",
          description: "Kumisaappaat ja villasukat suojaavat kylmältä",
        }
      : {
          name: "Kumisaappaat",
          emoji: "🥾",
          description: "Maa on märkä yöllisen sateen jäljiltä",
        };

    result.push(kumpparit);
    result.push({
      name: "Kurahousut",
      emoji: "🌧️",
      description: "Vaikka nyt on poutaa, maa on vielä märkä",
    });
  }

  return result;
}

export function computeDualRecommendation(
  weather: WeatherData,
  ageGroup: AgeGroup,
  forecastList: any[],
): DualRecommendation {
  const data = extractMorningAfternoon(forecastList);

  const morningTemp = data.morningTemp ?? weather.temperature;
  const afternoonTemp = data.afternoonTemp ?? weather.temperature;
  const morningFeelsLike = data.morningFeelsLike ?? weather.feelsLike;
  const afternoonFeelsLike = data.afternoonFeelsLike ?? weather.feelsLike;
  const gap = Math.abs(afternoonTemp - morningTemp);
  const isDual = gap > 7;

  const windSpeed = Math.max(data.morningWind ?? 0, data.afternoonWind ?? 0, weather.windSpeed);
  const windWarning = windSpeed > 6;

  const recentRainMm = data.recentRainMm;
  const mudFactor = recentRainMm > 1;

  // Build weather snapshots with actual temp for spring rule
  const morningWeather = buildWeatherSnapshot(
    weather, morningTemp, morningFeelsLike,
    data.morningConditionId, data.morningWind, data.morningHumidity,
    data.morningDesc, data.morningPop,
  );

  const afternoonWeather = buildWeatherSnapshot(
    weather, afternoonTemp, afternoonFeelsLike,
    data.afternoonConditionId, data.afternoonWind, data.afternoonHumidity,
    data.afternoonDesc, data.afternoonPop,
  );

  // Get clothing — spring rule uses actual temp, others use feelsLike internally
  let morningClothing = getClothingRecommendation(morningWeather, ageGroup);
  let afternoonClothing = getClothingRecommendation(afternoonWeather, ageGroup);

  // Activity level adjustments
  morningClothing = applyActivityLevel(morningClothing, ageGroup);
  afternoonClothing = applyActivityLevel(afternoonClothing, ageGroup);

  // Mud factor
  morningClothing = applyMudFactor(morningClothing, recentRainMm, weather.condition, weather.feelsLike);
  afternoonClothing = applyMudFactor(afternoonClothing, recentRainMm, weather.condition, weather.feelsLike);

  // Wind warning: add windproof shell note
  if (windWarning) {
    const windItem: ClothingItem = {
      name: "Tuulenpitävä kuorikerros",
      emoji: "💨",
      description: "Kova tuuli lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros",
    };
    if (!morningClothing.some(i => i.name === windItem.name)) {
      morningClothing.push(windItem);
    }
    if (!afternoonClothing.some(i => i.name === windItem.name)) {
      afternoonClothing.push(windItem);
    }
  }

  return {
    isDual,
    morningClothing,
    afternoonClothing,
    morningTemp,
    afternoonTemp,
    morningFeelsLike,
    afternoonFeelsLike,
    windWarning,
    windSpeed,
    mudFactor,
    recentRainMm,
  };
}
