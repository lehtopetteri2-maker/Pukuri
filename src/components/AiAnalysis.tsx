import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { WeatherData, AgeGroup } from "@/lib/weatherData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AiAnalysisProps {
  weather: WeatherData;
  ageGroup?: AgeGroup;
}

function generateAnalysis(weather: WeatherData, ageGroup?: AgeGroup): string[] {
  const tips: string[] = [];
  const ageLabel = ageGroup 
    ? ageGroup === "vauva" ? "vauvalle" 
      : ageGroup === "taapero" ? "taaperolle" 
      : ageGroup === "leikki-ikäinen" ? "leikki-ikäiselle" 
      : "koululaiselle"
    : "";

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

export default function AiAnalysis({ weather, ageGroup }: AiAnalysisProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setTips(generateAnalysis(weather, ageGroup));
      setAnimating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [weather.city, weather.temperature, weather.windSpeed, weather.rainProbability, ageGroup]);

  return (
    <div className="rounded-lg border border-sky/20 bg-gradient-to-br from-sky/10 via-card to-accent/20 shadow-sm overflow-hidden">
      <Accordion type="single" collapsible defaultValue="" className="w-full">
        <AccordionItem value="analysis" className="border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-sky/5 transition-colors [&[data-state=open]>div>svg]:rotate-180 min-h-[56px]">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-7 w-7 rounded-md bg-sky/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-sky-foreground" />
              </div>
              <div className="flex flex-col items-start text-left">
                <h2 className="text-sm font-display font-700 text-foreground uppercase tracking-wide">
                  Säävahdin analyysi
                </h2>
                {ageGroup && (
                  <span className="text-xs text-muted-foreground">
                    Ikäryhmä: {ageGroup}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity mr-2 ${
                animating ? "opacity-100" : "opacity-50"
              }`}
            >
              <RefreshCw className={`h-3 w-3 ${animating ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{animating ? "Analysoidaan..." : "Päivitetty"}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className={`space-y-3 transition-opacity duration-300 ${animating ? "opacity-30" : "opacity-100"}`}>
              {tips.map((tip, i) => (
                <p
                  key={i}
                  className="text-sm text-foreground/90 leading-relaxed pl-1 border-l-2 border-sky/30 pl-3"
                >
                  {tip}
                </p>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
