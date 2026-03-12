import { ForecastAlerts } from "@/lib/forecastAlerts";
import { WeatherData } from "@/lib/weatherData";
import { Thermometer, CloudRain, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface NightAlertProps {
  weather: WeatherData;
  alerts: ForecastAlerts;
}

export default function NightAlert({ weather, alerts }: NightAlertProps) {
  const { t } = useLanguage();

  if (!alerts.loaded) {
    return null;
  }

  const messages: { icon: React.ReactNode; text: string }[] = [];

  // Tomorrow significantly colder
  if (alerts.tomorrowColder && alerts.tomorrowMaxTemp !== null) {
    messages.push({
      icon: <Thermometer className="h-4 w-4 text-destructive shrink-0 mt-0.5" />,
      text: t("night.tomorrowColder", {
        today: String(weather.temperature),
        tomorrow: String(alerts.tomorrowMaxTemp),
      }),
    });
  }

  // Freezing tonight (original logic kept as fallback)
  const tonightLow = weather.temperature - 7;
  if (weather.temperature > 0 && tonightLow < 0) {
    messages.push({
      icon: <Thermometer className="h-4 w-4 text-destructive shrink-0 mt-0.5" />,
      text: t("night.freezing", {
        from: `${weather.temperature > 0 ? "+" : ""}${weather.temperature}`,
        to: String(tonightLow),
      }),
    });
  } else if (tonightLow < -15) {
    messages.push({
      icon: <Thermometer className="h-4 w-4 text-destructive shrink-0 mt-0.5" />,
      text: t("night.hardFrost", { temp: String(tonightLow) }),
    });
  }

  // Tomorrow rain
  if (alerts.tomorrowRain) {
    messages.push({
      icon: <CloudRain className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />,
      text: t("night.tomorrowRain"),
    });
  }

  if (messages.length === 0) return null;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <Thermometer className="h-5 w-5 text-destructive shrink-0" />
        <h3 className="text-sm font-display font-700 text-foreground">{t("night.title")}</h3>
      </div>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-2 pl-1">
            {m.icon}
            <p className="text-sm text-foreground/80">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
