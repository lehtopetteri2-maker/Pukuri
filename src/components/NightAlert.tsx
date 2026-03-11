import { WeatherData } from "@/lib/weatherData";
import { Thermometer } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface NightAlertProps {
  weather: WeatherData;
}

export default function NightAlert({ weather }: NightAlertProps) {
  const { t } = useLanguage();
  const tonightLow = weather.temperature - 7;

  let message: string | null = null;
  if (weather.temperature > 0 && tonightLow < 0) {
    message = t("night.freezing", {
      from: `${weather.temperature > 0 ? "+" : ""}${weather.temperature}`,
      to: String(tonightLow),
    });
  } else if (tonightLow < -15) {
    message = t("night.hardFrost", { temp: String(tonightLow) });
  }

  if (!message) return null;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3 animate-fade-in">
      <Thermometer className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
      <div>
        <h3 className="text-sm font-display font-700 text-foreground">{t("night.title")}</h3>
        <p className="text-sm text-foreground/80 mt-1">{message}</p>
      </div>
    </div>
  );
}
