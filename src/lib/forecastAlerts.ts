/**
 * Computes dynamic alerts from raw OpenWeatherMap forecast data.
 * Used by MorningSummary and NightAlert components.
 */

export interface ForecastAlerts {
  // Morning (08–14): rain info
  rainStartTime: string | null;       // e.g. "10:00"
  rainMm: number;                     // total mm in 08-14 window
  // Morning: freezing
  morningFreezing: boolean;           // any temp < 0 between 06-09
  morningMinTemp: number;
  // UV
  uvMax: number;
  // Evening: tomorrow comparison
  tomorrowMorningTemp: number | null; // temp around 07:00
  tomorrowMaxTemp: number | null;
  tomorrowColder: boolean;            // >5° colder than today
  tomorrowRain: boolean;              // rain probability > 40%
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
  const todayDate = now.getDate();
  const tomorrowDate = new Date(now.getTime() + 86400000).getDate();

  let rainStartTime: string | null = null;
  let rainMm = 0;
  let morningFreezing = false;
  let morningMinTemp = 99;

  // Scan today's entries
  for (const entry of forecastList) {
    const d = new Date(entry.dt * 1000);
    if (d.getDate() !== todayDate) continue;
    const hour = d.getHours();

    // Morning freezing check (06-09)
    if (hour >= 6 && hour <= 9) {
      const temp = entry.main.temp;
      if (temp < morningMinTemp) morningMinTemp = temp;
      if (temp < 0) morningFreezing = true;
    }

    // Rain between 08-14
    if (hour >= 8 && hour <= 14) {
      const rainAmount = entry.rain?.["3h"] ?? entry.rain?.["1h"] ?? 0;
      const snowAmount = entry.snow?.["3h"] ?? entry.snow?.["1h"] ?? 0;
      const totalPrecip = rainAmount + snowAmount;
      if (totalPrecip > 0.1) {
        rainMm += totalPrecip;
        if (!rainStartTime) {
          rainStartTime = `${String(hour).padStart(2, "0")}:00`;
        }
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

  return {
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
}
