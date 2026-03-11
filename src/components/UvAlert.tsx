import { Sun } from "lucide-react";
import type { WeatherData } from "@/lib/weatherData";
import { useLanguage } from "@/lib/i18n";

interface UvAlertProps {
  weather: WeatherData;
}

export default function UvAlert({ weather }: UvAlertProps) {
  const { t } = useLanguage();
  if (weather.uvi === undefined || weather.uvi < 3) return null;

  const level = weather.uvi >= 8 ? t("uv.veryHigh") : weather.uvi >= 6 ? t("uv.high") : t("uv.moderate");

  return (
    <div className="rounded-lg border border-orange-300/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 flex items-start gap-3 animate-fade-in">
      <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
        <Sun className="h-5 w-5 text-amber-500" />
      </div>
      <div>
        <h3 className="text-sm font-display font-700 text-foreground">
          {t("uv.titleFormat", { level, uvi: weather.uvi })}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {t("uv.description")}
        </p>
      </div>
    </div>
  );
}
