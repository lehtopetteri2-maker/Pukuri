import type { WeatherData, WeatherCondition, ClothingItem, AgeGroup } from "./weatherData";
import { getClothingRecommendation } from "./weatherData";

export interface TomorrowForecast {
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  rainProbability: number;
  description: string;
  /** Simulated full WeatherData for clothing logic */
  weatherData: WeatherData;
}

/**
 * Generate a mock "tomorrow" forecast derived from today's weather.
 * Adds slight random-looking but deterministic variation based on city name hash.
 */
export function getTomorrowForecast(today: WeatherData): TomorrowForecast {
  // Simple hash from city name for deterministic variation
  let hash = 0;
  for (let i = 0; i < today.city.length; i++) {
    hash = ((hash << 5) - hash + today.city.charCodeAt(i)) | 0;
  }
  const shift = ((hash % 7) - 3); // -3 to +3 degree shift
  const rainShift = (hash % 30) - 10; // -10 to +19

  const tempAvg = today.temperature + shift;
  const tempMin = tempAvg - 2;
  const tempMax = tempAvg + 2;
  const rainProb = Math.max(0, Math.min(100, today.rainProbability + rainShift));

  let condition: WeatherCondition = today.condition;
  if (rainProb > 60 && tempAvg > 2) condition = "rainy";
  else if (rainProb > 60 && tempAvg <= 2) condition = "snowy";
  else if (rainProb < 20 && tempAvg > 5) condition = "sunny";
  else if (today.windSpeed > 10) condition = "windy";

  const weatherData: WeatherData = {
    temperature: tempAvg,
    feelsLike: tempAvg - 3,
    condition,
    windSpeed: today.windSpeed + ((hash % 3) - 1),
    humidity: today.humidity,
    rainProbability: rainProb,
    afternoonRain: rainProb > 50,
    city: today.city,
    description: "",
  };

  return { tempMin, tempMax, condition, rainProbability: rainProb, description: "", weatherData };
}

export function getTomorrowWarnings(today: WeatherData, tomorrow: TomorrowForecast): string[] {
  const warnings: string[] = [];

  // Colder tomorrow
  if (tomorrow.weatherData.temperature < today.temperature - 2) {
    warnings.push("Huomiseksi kylmenee, muista lämpimämpi kerrasto.");
  }

  // First rainy day after dry
  if (today.rainProbability < 30 && tomorrow.rainProbability > 50) {
    warnings.push("Huomenna sataa, muista viedä kuravarusteet päiväkotiin.");
  }

  return warnings;
}

export function getTomorrowPrepItems(tomorrow: TomorrowForecast, ageGroup: AgeGroup): ClothingItem[] {
  return getClothingRecommendation(tomorrow.weatherData, ageGroup).slice(0, 4);
}
