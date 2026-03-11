import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { WeatherData, AgeGroup } from "@/lib/weatherData";
import { useLanguage, TranslationKey } from "@/lib/i18n";
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

export default function AiAnalysis({ weather, ageGroup }: AiAnalysisProps) {
  const { t } = useLanguage();
  const [tips, setTips] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      const newTips: string[] = [];
      const ageLabel = ageGroup ? t(`ai.ageLabel.${ageGroup}` as TranslationKey) : "";

      if (weather.rainProbability > 40 || weather.afternoonRain) {
        newTips.push(t("ai.rainTip"));
      }

      if (weather.windSpeed >= 7) {
        newTips.push(t("ai.hardWindTip", {
          speed: weather.windSpeed,
          temp: `${weather.temperature > 0 ? "+" : ""}${weather.temperature}`,
        }));
      } else if (weather.windSpeed >= 4) {
        newTips.push(t("ai.moderateWindTip", { speed: weather.windSpeed }));
      }

      const feelsLikeDiff = Math.abs(weather.temperature - weather.feelsLike);
      if (feelsLikeDiff >= 4) {
        newTips.push(t("ai.layeringTip", {
          feelsLike: `${weather.feelsLike > 0 ? "+" : ""}${weather.feelsLike}`,
          temp: `${weather.temperature > 0 ? "+" : ""}${weather.temperature}`,
        }));
      }

      if (weather.uvi !== undefined && weather.uvi >= 3) {
        newTips.push(t("ai.uvTip", { uvi: weather.uvi, age: ageLabel }));
      } else if (weather.condition === "sunny" && weather.temperature > 15) {
        newTips.push(t("ai.sunnyUvTip"));
      }

      if (newTips.length === 0) {
        newTips.push(t("ai.calmDay", {
          temp: `${weather.temperature > 0 ? "+" : ""}${weather.temperature}`,
          desc: weather.description.toLowerCase(),
        }));
      }

      setTips(newTips);
      setAnimating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [weather.city, weather.temperature, weather.windSpeed, weather.rainProbability, ageGroup, t]);

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
                  {t("ai.title")}
                </h2>
                {ageGroup && (
                  <span className="text-xs text-muted-foreground">
                    {t("ai.ageGroup")}: {t(`age.${ageGroup}` as TranslationKey)}
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
              <span className="hidden sm:inline">{animating ? t("ai.analyzing") : t("ai.updated")}</span>
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
