import { WeatherData } from "@/lib/weatherData";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface MorningSummaryProps {
  weather: WeatherData;
}

export default function MorningSummary({ weather }: MorningSummaryProps) {
  const { t } = useLanguage();
  if (!weather.afternoonRain) return null;

  return (
    <div className="rounded-lg border border-secondary bg-sky-light p-4 flex items-start gap-3 animate-fade-in">
      <AlertTriangle className="h-5 w-5 text-secondary-foreground mt-0.5 shrink-0" />
      <div>
        <h3 className="text-sm font-display font-700 text-foreground">{t("morning.title")}</h3>
        <p className="text-sm text-foreground/80 mt-1">{t("morning.afternoonRain")}</p>
      </div>
    </div>
  );
}
