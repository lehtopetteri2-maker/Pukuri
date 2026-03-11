import type { WeatherData } from "./weatherData";
import type { TomorrowData } from "./weatherApi";

const CACHE_KEY = "saavahti-weather-cache";
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

export interface WeatherCache {
  city: string;
  current: WeatherData;
  tomorrow: TomorrowData;
  fromApi: boolean;
  timestamp: number;
}

export function getCachedWeather(city: string): WeatherCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: WeatherCache = JSON.parse(raw);
    if (cache.city.toLowerCase() !== city.toLowerCase()) return null;
    return cache;
  } catch {
    return null;
  }
}

export function isCacheFresh(cache: WeatherCache): boolean {
  return Date.now() - cache.timestamp < CACHE_TTL;
}

export function getCacheAgeMinutes(cache: WeatherCache): number {
  return Math.round((Date.now() - cache.timestamp) / 60000);
}

export function saveWeatherCache(city: string, current: WeatherData, tomorrow: TomorrowData, fromApi: boolean): void {
  const cache: WeatherCache = { city, current, tomorrow, fromApi, timestamp: Date.now() };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    console.log("[Säävahti] Välimuistin tallennus epäonnistui");
  }
}
