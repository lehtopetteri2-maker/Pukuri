import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { WeatherData } from "@/lib/weatherData";

interface AiAnalysisProps {
  weather: WeatherData;
}

function generateAnalysis(weather: WeatherData): string[] {
  const tips: string[] = [];

  if (weather.rainProbability > 40 || weather.afternoonRain) {
    tips.push(
      "🌧️ Huomataan lähestyvä sadealue klo 14. Suosittelen kuravarusteita jo aamusta, jotta ulkoilu ei keskeydy."
    );
  }

  if (weather.windSpeed >= 7) {
    tips.push(
      `💨 Tänään on kova tuuli (${weather.windSpeed} m/s). Vaikka mittari näyttää ${weather.temperature > 0 ? "+" : ""}${weather.temperature}°C, viima tuntuu pakkaselta. Valitse tuulenpitävä kuorikerros.`
    );
  } else if (weather.windSpeed >= 4) {
    tips.push(
      `💨 Kohtalainen tuuli (${weather.windSpeed} m/s) viilentää tuntuvasti. Tuulenpitävä kerros on hyvä valinta.`
    );
  }

  const feelsLikeDiff = Math.abs(weather.temperature - weather.feelsLike);
  if (feelsLikeDiff >= 4) {
    tips.push(
      `🌡️ Aamu on kylmä (${weather.feelsLike > 0 ? "+" : ""}${weather.feelsLike}°C tuntuu), mutta iltapäivällä lämpötila nousee (${weather.temperature > 0 ? "+" : ""}${weather.temperature}°C). Kerrospukeutuminen on tänään avainasemassa.`
    );
  }

  if (weather.condition === "sunny" && weather.temperature > 15) {
    tips.push(
      "☀️ Korkea UV-indeksi. Muista aurinkorasva ja lippis suojaksi."
    );
  }

  if (tips.length === 0) {
    tips.push(
      `✅ Tänään on rauhallinen sääpäivä (${weather.temperature > 0 ? "+" : ""}${weather.temperature}°C, ${weather.description.toLowerCase()}). Normaalit kauden vaatteet riittävät hyvin.`
    );
  }

  return tips;
}

export default function AiAnalysis({ weather }: AiAnalysisProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setTips(generateAnalysis(weather));
      setAnimating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [weather.city, weather.temperature, weather.windSpeed, weather.rainProbability]);

  return (
    <div className="rounded-lg border border-secondary/30 bg-gradient-to-br from-sky-light via-card to-accent/30 p-5 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-secondary/30 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-secondary-foreground" />
          </div>
          <h2 className="text-sm font-display font-700 text-foreground uppercase tracking-wide">
            Säävahdin analyysi
          </h2>
        </div>
        <div
          className={`flex items-center gap-1 text-xs text-muted-foreground transition-opacity ${
            animating ? "opacity-100" : "opacity-50"
          }`}
        >
          <RefreshCw className={`h-3 w-3 ${animating ? "animate-spin" : ""}`} />
          <span>{animating ? "Analysoidaan..." : "Päivitetty"}</span>
        </div>
      </div>

      <div className={`space-y-2.5 transition-opacity duration-300 ${animating ? "opacity-30" : "opacity-100"}`}>
        {tips.map((tip, i) => (
          <p
            key={i}
            className="text-sm text-foreground/90 leading-relaxed pl-1"
          >
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
}
