/**
 * Computes dynamic alerts from raw OpenWeatherMap forecast data.
 * Used by MorningSummary and NightAlert components.
 */

export interface ForecastAlerts {
  // Rain info for remaining day
  rainStartTime: string | null;
  rainMm: number;
  // Morning: freezing
  morningFreezing: boolean;
  morningMinTemp: number;
  // UV
  uvMax: number;
  // Evening: tomorrow comparison
  tomorrowMorningTemp: number | null;
  tomorrowMaxTemp: number | null;
  tomorrowColder: boolean;
  tomorrowRain: boolean;
  // Data loaded
  loaded: boolean;
}

export function emptyAlerts(): ForecastAlerts {
  return {
    rainStartTime: null,
    rainMm: 0,
    morningFreezing: false,
    morningMinTemp: 0,
    uvMax: 0,
    tomorrowMorningTemp: null,
    tomorrowMaxTemp: null,
    tomorrowColder: false,
    tomorrowRain: false,
    loaded: false,
  };
}

export function computeAlerts(
  forecastList: any[],
  currentTemp: number,
  uvi?: number
): ForecastAlerts {
  const now = new Date();
  const currentHour = now.getHours();
  const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const tomorrowDateObj = new Date(now.getTime() + 86400000);
  const tomorrowKey = `${tomorrowDateObj.getFullYear()}-${tomorrowDateObj.getMonth() + 1}-${tomorrowDateObj.getDate()}`;

  console.log("[Säävahti] Generoidaan suositukset...", {
    forecastEntries: forecastList.length,
    currentTemp,
    uvi,
    currentHour,
  });

  let rainStartTime: string | null = null;
  let rainMm = 0;
  let morningFreezing = false;
  let morningMinTemp = 99;

  // Dynamic time window: from current hour to end of day
  const isAfterNoon = currentHour > 12;
  const rainWindowStart = isAfterNoon ? currentHour : 8;
  const rainWindowEnd = isAfterNoon ? 20 : 14;

  for (const entry of forecastList) {
    const d = new Date(entry.dt * 1000);
    if (d.getDate() !== todayDate) continue;
    const hour = d.getHours();

    // Morning freezing check (06-09) — only relevant if still morning
    if (currentHour <= 10 && hour >= 6 && hour <= 9) {
      const temp = entry.main.temp;
      if (temp < morningMinTemp) morningMinTemp = temp;
      if (temp < 0) morningFreezing = true;
    }

    // Rain/snow in remaining day window
    if (hour >= rainWindowStart && hour <= rainWindowEnd) {
      const rainAmount = entry.rain?.["3h"] ?? entry.rain?.["1h"] ?? 0;
      const snowAmount = entry.snow?.["3h"] ?? entry.snow?.["1h"] ?? 0;
      const totalPrecip = rainAmount + snowAmount;
      if (totalPrecip > 0.1) {
        rainMm += totalPrecip;
        if (!rainStartTime) {
          rainStartTime = `${String(hour).padStart(2, "0")}:00`;
        }
      }
      // Also check pop (probability of precipitation)
      const pop = entry.pop ?? 0;
      if (pop > 0.5 && !rainStartTime) {
        rainStartTime = `${String(hour).padStart(2, "0")}:00`;
      }
    }
  }

  // Tomorrow entries
  let tomorrowMorningTemp: number | null = null;
  let tomorrowMaxTemp: number | null = null;
  let tomorrowRain = false;

  for (const entry of forecastList) {
    const d = new Date(entry.dt * 1000);
    if (d.getDate() !== tomorrowDate) continue;
    const hour = d.getHours();
    const temp = entry.main.temp;

    // Morning ~07:00 (closest entry 06-09)
    if (hour >= 6 && hour <= 9 && tomorrowMorningTemp === null) {
      tomorrowMorningTemp = Math.round(temp);
    }

    // Track max temp
    if (tomorrowMaxTemp === null || temp > tomorrowMaxTemp) {
      tomorrowMaxTemp = Math.round(temp);
    }

    // Rain check
    const pop = entry.pop ?? 0;
    if (pop > 0.4) {
      tomorrowRain = true;
    }
  }

  const tomorrowColder =
    tomorrowMaxTemp !== null && currentTemp - tomorrowMaxTemp > 5;

  const alerts: ForecastAlerts = {
    rainStartTime,
    rainMm,
    morningFreezing,
    morningMinTemp: morningMinTemp === 99 ? currentTemp : Math.round(morningMinTemp),
    uvMax: uvi ?? 0,
    tomorrowMorningTemp,
    tomorrowMaxTemp,
    tomorrowColder,
    tomorrowRain,
    loaded: true,
  };

  console.log("[Säävahti] Suositukset generoitu:", alerts);
  return alerts;
}
