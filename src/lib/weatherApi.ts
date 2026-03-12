import type { WeatherData, WeatherCondition } from "./weatherData";

const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
const BASE = "https://api.openweathermap.org/data/2.5";

function mapCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return "rainy";
  if (id >= 300 && id < 400) return "rainy";
  if (id >= 500 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snowy";
  if (id >= 700 && id < 800) return "windy";
  if (id === 800) return "sunny";
  return "cloudy";
}

/** Capitalize first letter for cleaner city names */
function capitalizeCity(city: string): string {
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
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


async function tryFetchJson(url: string, label: string): Promise<any | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      console.log(`[Säävahti] ${label} API error ${res.status}: ${body}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.log(`[Säävahti] ${label} network error:`, err);
    return null;
  }
}

function parseCurrentWeather(d: any): WeatherData {
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
    uvi: d.uvi ?? undefined,
  };
}

function parseForecast(d: any): { tomorrow: TomorrowData; afternoonRain: boolean } {
  const now = new Date();
  const todayDate = now.getDate();
  const tomorrowDate = new Date(now.getTime() + 86400000).getDate();

  let afternoonRain = false;
  for (const entry of d.list) {
    const entryDate = new Date(entry.dt * 1000);
    if (entryDate.getDate() === todayDate) {
      const hour = entryDate.getHours();
      if (hour >= 12 && hour <= 18 && (entry.pop ?? 0) > 0.4) {
        afternoonRain = true;
        break;
      }
    }
  }

  const tomorrowEntries = d.list.filter((entry: any) => {
    return new Date(entry.dt * 1000).getDate() === tomorrowDate;
  });

  if (tomorrowEntries.length === 0) {
    return {
      afternoonRain,
      tomorrow: { tempMin: 0, tempMax: 0, condition: "cloudy", rainProbability: 0, avgTemp: 0, avgWind: 0, humidity: 0, description: "" },
    };
  }

  const temps = tomorrowEntries.map((e: any) => e.main.temp);
  const winds = tomorrowEntries.map((e: any) => e.wind.speed);
  const pops = tomorrowEntries.map((e: any) => (e.pop ?? 0) * 100);
  const humidities = tomorrowEntries.map((e: any) => e.main.humidity);
  const midEntry = tomorrowEntries[Math.floor(tomorrowEntries.length / 2)];

  return {
    afternoonRain,
    tomorrow: {
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      condition: mapCondition(midEntry.weather[0].id),
      rainProbability: Math.round(Math.max(...pops)),
      avgTemp: Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length),
      avgWind: Math.round(winds.reduce((a: number, b: number) => a + b, 0) / winds.length),
      humidity: Math.round(humidities.reduce((a: number, b: number) => a + b, 0) / humidities.length),
      description: midEntry.weather[0].description,
    },
  };
}

export async function fetchWeatherData(city: string): Promise<{
  current: WeatherData;
  tomorrow: TomorrowData;
  forecastList: any[];
  fromApi: boolean;
}> {
  const normalizedCity = capitalizeCity(city.trim());

  const [weatherJson, forecastJson] = await Promise.all([
    tryFetchJson(`${BASE}/weather?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${API_KEY}&lang=fi`, "Current"),
    tryFetchJson(`${BASE}/forecast?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${API_KEY}&lang=fi`, "Forecast"),
  ]);

  // If API fails (401, network error etc.), use fallback mock data
  if (!weatherJson) {
    console.log(`[Säävahti] Käytetään testisäätietoja kaupungille: ${normalizedCity}`);
    const mock = getMockWeather(normalizedCity);
    return { current: mock, tomorrow: getMockTomorrow(mock), forecastList: [], fromApi: false };
  }

  const current = parseCurrentWeather(weatherJson);

  if (forecastJson) {
    const forecast = parseForecast(forecastJson);
    current.afternoonRain = forecast.afternoonRain;
    return { current, tomorrow: forecast.tomorrow, forecastList: forecastJson.list ?? [], fromApi: true };
  }

  return { current, tomorrow: getMockTomorrow(current), forecastList: [], fromApi: true };
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<{
  current: WeatherData;
  tomorrow: TomorrowData;
  forecastList: any[];
  fromApi: boolean;
}> {
  const weatherJson = await tryFetchJson(
    `${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=fi`,
    "Coords"
  );

  if (!weatherJson) {
    console.log("[Säävahti] GPS-haku epäonnistui, käytetään testisäätä");
    const mock = getMockWeather("Helsinki");
    return { current: mock, tomorrow: getMockTomorrow(mock), forecastList: [], fromApi: false };
  }

  const current = parseCurrentWeather(weatherJson);
  const forecastJson = await tryFetchJson(
    `${BASE}/forecast?q=${encodeURIComponent(current.city)}&units=metric&appid=${API_KEY}&lang=fi`,
    "Coords Forecast"
  );

  if (forecastJson) {
    const forecast = parseForecast(forecastJson);
    current.afternoonRain = forecast.afternoonRain;
    return { current, tomorrow: forecast.tomorrow, forecastList: forecastJson.list ?? [], fromApi: true };
  }

  return { current, tomorrow: getMockTomorrow(current), forecastList: [], fromApi: true };
}
