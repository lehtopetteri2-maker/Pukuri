import type { WeatherData } from "./weatherData";
import type { TomorrowData } from "./weatherApi";

const CACHE_KEY = "pukuri-weather-cache";
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

/** Max distance in km to consider coordinates "same location" */
const COORD_THRESHOLD_KM = 5;

export interface WeatherCache {
  city: string;
  current: WeatherData;
  tomorrow: TomorrowData;
  forecastList: any[];
  fromApi: boolean;
  timestamp: number;
  lat?: number;
  lon?: number;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function readCache(): WeatherCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: WeatherCache = JSON.parse(raw);
    if (!Array.isArray(cache.forecastList)) return null;
    return cache;
  } catch {
    return null;
  }
}

export function getCachedWeather(city: string): WeatherCache | null {
  const cache = readCache();
  if (!cache) return null;
  if (cache.city.toLowerCase() !== city.toLowerCase()) return null;
  return cache;
}

export function getCachedWeatherByCoords(lat: number, lon: number): WeatherCache | null {
  const cache = readCache();
  if (!cache || cache.lat == null || cache.lon == null) return null;
  if (haversineKm(lat, lon, cache.lat, cache.lon) > COORD_THRESHOLD_KM) return null;
  return cache;
}

export function isCacheFresh(cache: WeatherCache): boolean {
  return Date.now() - cache.timestamp < CACHE_TTL;
}

export function getCacheAgeMinutes(cache: WeatherCache): number {
  return Math.round((Date.now() - cache.timestamp) / 60000);
}

export function saveWeatherCache(
  city: string,
  current: WeatherData,
  tomorrow: TomorrowData,
  forecastList: any[],
  fromApi: boolean,
  lat?: number,
  lon?: number,
): void {
  const cache: WeatherCache = { city, current, tomorrow, forecastList, fromApi, timestamp: Date.now(), lat, lon };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    console.log("[Pukuri] Välimuistin tallennus epäonnistui");
  }
}
