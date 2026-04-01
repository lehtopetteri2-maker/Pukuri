import { useState, useEffect, useMemo } from "react";
import { Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { WeatherData, AgeGroup, isSpringMonth } from "@/lib/weatherData";
import { DualRecommendation } from "@/lib/dualRecommendation";
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
  dual?: DualRecommendation;
}

export default function AiAnalysis({ weather, ageGroup, dual }: AiAnalysisProps) {
  const { t } = useLanguage();
  const [tips, setTips] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      const newTips: string[] = [];
      const ageLabel = ageGroup ? t(`ai.ageLabel.${ageGroup}` as TranslationKey) : "";

      // 1. PRIORITY: Temperature gap (AM vs PM) — highlighted morning tip at the top
      if (dual?.isDual) {
        const amTemp = dual.morningTemp;
        const pmTemp = dual.afternoonTemp;
        newTips.push(t("ai.morningGapHighlight" as TranslationKey, {
          amTemp: `${amTemp > 0 ? "+" : ""}${amTemp}`,
          pmTemp: `${pmTemp > 0 ? "+" : ""}${pmTemp}`,
        }));
      }

      // 2. Wind chill > 6 m/s
      if (weather.windSpeed > 6) {
        newTips.push(t("ai.windChillTip", { speed: weather.windSpeed }));
      }

      // 3. Mud Factor — ground still wet (>1mm in last 12h)
      if (dual?.mudFactor) {
        newTips.push(t("ai.mudTipWet" as TranslationKey));
      }

      // 4. UV reminder > 3
      if (weather.uvi !== undefined && weather.uvi > 3) {
        newTips.push(t("ai.uvReminderTip", { uvi: weather.uvi }));
      }

      // 5. Rain approaching
      if (weather.rainProbability > 40 || weather.afternoonRain) {
        newTips.push(t("ai.rainTip"));
      }

      // 6. Layering zone +2…+10 °C
      const temp = weather.feelsLike ?? weather.temperature;
      if (temp >= 2 && temp <= 10 && !dual?.isDual) {
        newTips.push(t("ai.layerZoneTip"));
      }

      // 7. Feels-like gap (when no dual)
      const feelsLikeDiff = Math.abs(weather.temperature - weather.feelsLike);
      if (feelsLikeDiff >= 4 && !dual?.isDual) {
        newTips.push(t("ai.layeringTip", {
          feelsLike: `${weather.feelsLike > 0 ? "+" : ""}${weather.feelsLike}`,
          temp: `${weather.temperature > 0 ? "+" : ""}${weather.temperature}`,
        }));
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
  }, [weather.city, weather.temperature, weather.windSpeed, weather.rainProbability, weather.uvi, ageGroup, dual, t]);

  // Show attention icon if there are special tips (not just calm day)
  const hasSpecialTips = useMemo(() => {
    if (!dual) return weather.uvi !== undefined && weather.uvi > 3;
    return dual.mudFactor || dual.isDual || dual.windWarning || (weather.uvi !== undefined && weather.uvi > 3);
  }, [dual, weather.uvi]);

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
                <h2 className="text-sm font-display font-700 text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  {t("ai.title")}
                  {hasSpecialTips && (
                    <span className="text-base" title={t("ai.hasSpecialTip")}>💡</span>
                  )}
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
                  className="text-sm text-foreground/90 leading-relaxed border-l-2 border-sky/30 pl-3"
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
