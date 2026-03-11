import type { WeatherData, WeatherCondition } from "./weatherData";

const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
const BASE = "https://api.openweathermap.org/data/2.5";

function mapCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return "rainy"; // thunderstorm
  if (id >= 300 && id < 400) return "rainy"; // drizzle
  if (id >= 500 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snowy";
  if (id >= 700 && id < 800) return "windy"; // atmosphere
  if (id === 800) return "sunny";
  return "cloudy"; // 80x
}

export interface ForecastEntry {
  dt: number;
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  windSpeed: number;
  humidity: number;
  rainProbability: number;
  description: string;
}

export interface TomorrowData {
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  rainProbability: number;
  avgTemp: number;
  avgWind: number;
  humidity: number;
  description: string;
}

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&lang=fi&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CITY_NOT_FOUND");
  const d = await res.json();

  return {
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    condition: mapCondition(d.weather[0].id),
    windSpeed: Math.round(d.wind.speed),
    humidity: d.main.humidity,
    rainProbability: d.clouds?.all ?? 0,
    afternoonRain: false, // will be enriched from forecast
    city: d.name,
    description: d.weather[0].description,
  };
}

export async function fetchCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const url = `${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&lang=fi&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("COORDS_NOT_FOUND");
  const d = await res.json();

  return {
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    condition: mapCondition(d.weather[0].id),
    windSpeed: Math.round(d.wind.speed),
    humidity: d.main.humidity,
    rainProbability: d.clouds?.all ?? 0,
    afternoonRain: false,
    city: d.name,
    description: d.weather[0].description,
  };
}

export async function fetchForecast(city: string): Promise<{ tomorrow: TomorrowData; afternoonRain: boolean }> {
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&lang=fi&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("FORECAST_NOT_FOUND");
  const d = await res.json();

  const now = new Date();
  const todayDate = now.getDate();
  const tomorrowDate = new Date(now.getTime() + 86400000).getDate();

  // Check afternoon rain today (12-18)
  let afternoonRain = false;
  for (const entry of d.list) {
    const entryDate = new Date(entry.dt * 1000);
    if (entryDate.getDate() === todayDate) {
      const hour = entryDate.getHours();
      if (hour >= 12 && hour <= 18) {
        const pop = entry.pop ?? 0;
        if (pop > 0.4) {
          afternoonRain = true;
          break;
        }
      }
    }
  }

  // Tomorrow's entries
  const tomorrowEntries = d.list.filter((entry: any) => {
    const entryDate = new Date(entry.dt * 1000);
    return entryDate.getDate() === tomorrowDate;
  });

  if (tomorrowEntries.length === 0) {
    return {
      afternoonRain,
      tomorrow: {
        tempMin: 0, tempMax: 0, condition: "cloudy",
        rainProbability: 0, avgTemp: 0, avgWind: 0, humidity: 0, description: "",
      },
    };
  }

  const temps = tomorrowEntries.map((e: any) => e.main.temp);
  const winds = tomorrowEntries.map((e: any) => e.wind.speed);
  const pops = tomorrowEntries.map((e: any) => (e.pop ?? 0) * 100);
  const humidities = tomorrowEntries.map((e: any) => e.main.humidity);

  const avgTemp = Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length);
  const midEntry = tomorrowEntries[Math.floor(tomorrowEntries.length / 2)];

  return {
    afternoonRain,
    tomorrow: {
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      condition: mapCondition(midEntry.weather[0].id),
      rainProbability: Math.round(Math.max(...pops)),
      avgTemp,
      avgWind: Math.round(winds.reduce((a: number, b: number) => a + b, 0) / winds.length),
      humidity: Math.round(humidities.reduce((a: number, b: number) => a + b, 0) / humidities.length),
      description: midEntry.weather[0].description,
    },
  };
}

export async function fetchWeatherData(city: string): Promise<{
  current: WeatherData;
  tomorrow: TomorrowData;
}> {
  const [current, forecastData] = await Promise.all([
    fetchCurrentWeather(city),
    fetchForecast(city),
  ]);

  current.afternoonRain = forecastData.afternoonRain;

  // Enrich rain probability from forecast if available
  if (forecastData.tomorrow.rainProbability > current.rainProbability) {
    // Keep current as-is, just update afternoonRain
  }

  return { current, tomorrow: forecastData.tomorrow };
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<{
  current: WeatherData;
  tomorrow: TomorrowData;
}> {
  const current = await fetchCurrentWeatherByCoords(lat, lon);
  const forecastData = await fetchForecast(current.city);
  current.afternoonRain = forecastData.afternoonRain;
  return { current, tomorrow: forecastData.tomorrow };
}
